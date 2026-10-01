import { describe, expect, it, vi } from 'vitest';
import Fastify from 'fastify';
import { aiRoutes } from '../src/routes/ai.routes.js';
import type { IntentProvider } from '../src/ai/providers/intent-provider.js';
import type { SemanticPlan } from '../src/semantic/schema.js';
import { GeminiProvider } from '../src/ai/providers/gemini.provider.js';
import { aiEnv } from '../src/ai/config/env.js';
import { presentSemantic } from '../src/semantic/presenter.js';
import { getLastHierarchySegment } from '../src/semantic/display-transform.js';
import { compilePlan } from '../src/semantic/compiler.js';
import { resolvePlan } from '../src/semantic/resolver.js';
import { deterministicSemanticPlan, extractPrNumber, materialSearchTerms } from '../src/semantic/deterministic-plan.js';
import { normalizePurchaseRequestPlan } from '../src/semantic/normalize-plan.js';
import { importMrpReview } from '../src/semantic/mrp-review.js';
import { mkdtemp, readFile as readReviewFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join as joinPath } from 'node:path';

const plan = (filters: SemanticPlan['filters']): SemanticPlan => ({ mode: 'LIVE_QUERY', entity: 'purchase_request', select: ['pr_number', 'material_description', 'quantity'], metrics: [], aggregates: [], groupBy: [], filters, sort: [], limit: 100, offset: 0 });

function providerFor(planner: (message: string, metadata: unknown) => SemanticPlan, intent: 'SEMANTIC_QUERY' | 'UNSUPPORTED' = 'SEMANTIC_QUERY'): IntentProvider {
  return {
    parseIntent: async () => ({ intent, parameters: {} }),
    answerKnowledge: async () => 'unused',
    parseSemanticPlan: async (message, metadata) => planner(message, metadata)
  };
}

async function appFor(executeSemantic: (query: SemanticPlan) => Promise<{ entity: string; rows: unknown[]; rowCount: number; columns: string[] }>, provider: IntentProvider) {
  const app = Fastify();
  await app.register(aiRoutes, { provider, executeSemantic });
  return app;
}

describe('semantic chat runtime', () => {
  it('imports MRP business approval as audit metadata without rows', async () => {
    const root = await mkdtemp(joinPath(tmpdir(), 'bmc-mrp-review-'));
    const result = await importMrpReview({ domain: 'MRP', approverRole: 'MRP_MANAGER', evidenceType: 'BUSINESS_UI_VERIFICATION', answers: [{ id: 'mrp-number-ui', semanticField: 'mrp_number', physicalSource: 'dbo.PURCH_MRP.MRPNo', decision: 'APPROVED', meaning: 'MRP number displayed as No MRP', reason: 'Verified in internal MRP application' }] }, root);
    expect(result.approved).toBe(1);
    expect(await readReviewFile(joinPath(root, 'audit.jsonl'), 'utf8')).toContain('BUSINESS_UI_VERIFICATION');
    expect(await readReviewFile(joinPath(root, 'mrp-approved.json'), 'utf8')).not.toMatch(/rows|MaterialId|Qty|secret/i);
  });
  it('reduces hierarchy values only for display', () => {
    expect(getLastHierarchySegment('PC / LAPTOP;ACCESSORIES;HDMI WIRELESS RECEIVER')).toBe('HDMI WIRELESS RECEIVER');
    expect(getLastHierarchySegment('PC / LAPTOP;LAPTOP;LAPTOP INTEL CORE I3')).toBe('LAPTOP INTEL CORE I3');
    expect(getLastHierarchySegment('MONITOR')).toBe('MONITOR');
    expect(getLastHierarchySegment('GROUP;CATEGORY;')).toBe('CATEGORY');
    expect(getLastHierarchySegment(null)).toBeNull();
  });

  it('keeps semantic filtering bound to the full physical MaterialName value', () => {
    const queryPlan = plan([{ field: 'material_description', operator: 'contains', value: 'laptop' }]);
    const resolved = resolvePlan(queryPlan);
    const compiled = compilePlan(resolved);
    expect(compiled.text).toContain('MaterialName LIKE @p0');
    expect(compiled.params.find((parameter) => parameter.name === 'p0')?.value).toBe('%laptop%');
  });

  it('extracts all meaningful material terms with default AND semantics', () => {
    expect(materialSearchTerms('PR material laptop HP apa aja?')).toEqual(['laptop', 'HP']);
    expect(materialSearchTerms('cari PR mouse logitech M170')).toEqual(['mouse', 'logitech', 'M170']);
    expect(materialSearchTerms('PR monitor 24 inch')).toEqual(['monitor', '24', 'inch']);
    expect(deterministicSemanticPlan('PR material laptop HP apa aja?')?.filters).toEqual([{ field: 'material_description', operator: 'contains_all', value: ['laptop', 'HP'] }]);
  });

  it('recognizes a PR number as pr_number instead of material terms', () => {
    expect(extractPrNumber('034/IT/08/26 isi pr ini apa aja')).toBe('034/IT/08/26');
    expect(materialSearchTerms('034/IT/08/26 isi pr ini apa aja')).toEqual([]);
    expect(deterministicSemanticPlan('034/IT/08/26 isi pr ini apa aja')?.filters).toEqual([{ field: 'pr_number', operator: 'contains', value: '034/IT/08/26' }]);
  });

  it('normalizes a planner that dropped a material term without changing display behavior', () => {
    const incomplete = plan([{ field: 'material_description', operator: 'contains', value: 'laptop' }]);
    expect(normalizePurchaseRequestPlan(incomplete, 'PR material laptop HP apa aja?').filters).toEqual([{ field: 'material_description', operator: 'contains_all', value: ['laptop', 'HP'] }]);
  });

  it('normalizes a planner PR lookup to pr_number and does not search MaterialName', () => {
    const incomplete = plan([{ field: 'material_description', operator: 'contains_all', value: ['034', 'IT', '08', '26'] }]);
    expect(normalizePurchaseRequestPlan(incomplete, '034/IT/08/26 isi pr ini apa aja').filters).toEqual([{ field: 'pr_number', operator: 'contains', value: '034/IT/08/26' }]);
  });

  it('presents semantic rows with aliases and zero-result status', () => {
    const result = presentSemantic(plan([]), { entity: 'purchase_request', rows: [{ pr_number: 'PR-1', material_description: 'PC / LAPTOP;ACCESSORIES;MOUSE LOGITECH M170', quantity: 3 }], rowCount: 1, columns: ['pr_number', 'material_description', 'quantity'] });
    expect(result).toMatchObject({ status: 'SUCCESS', data: [{ pr_number: 'PR-1', material_description: 'MOUSE LOGITECH M170', quantity: 3 }], visualization: { type: 'table', columns: [{ key: 'pr_number', label: 'No PR' }, { key: 'material_description', label: 'Material' }, { key: 'quantity', label: 'Qty' }] } });
    expect(presentSemantic(plan([]), { entity: 'purchase_request', rows: [], rowCount: 0, columns: ['pr_number', 'material_description', 'quantity'] })).toMatchObject({ status: 'ZERO_RESULTS', data: [], answer: 'Tidak ditemukan Purchase Request yang sesuai.' });
  });

  it('sends only abstract metadata to Gemini semantic planning', async () => {
    const originalKey = aiEnv.GEMINI_API_KEY;
    aiEnv.GEMINI_API_KEY = 'test-key';
    const fetchSpy = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      const body = String(init?.body);
      expect(body).toContain('purchase_request');
      expect(body).toContain('material_description');
      expect(body).not.toMatch(/dbo\.|PURC_PURCHREQUEST_TEMP|MaterialName|Qty|database row|redacted-test-value/i);
      return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(plan([{ field: 'material_description', operator: 'contains', value: 'monitor' }])) }] } }] }), { status: 200 });
    });
    vi.stubGlobal('fetch', fetchSpy);
    const result = await new GeminiProvider().parseSemanticPlan('No PR monitor apa?', [{ entity: 'purchase_request', fields: { material_description: { confidence: 'CONFIRMED_BY_DATA' } } }]);
    expect(result.entity).toBe('purchase_request');
    expect(fetchSpy).toHaveBeenCalledOnce();
    vi.unstubAllGlobals();
    aiEnv.GEMINI_API_KEY = originalKey;
  });

  it('reports queryable Purchase Request capabilities from the semantic catalog', async () => {
    const app = await appFor(vi.fn(async () => ({ entity: 'purchase_request', rows: [], rowCount: 0, columns: [] })), providerFor(() => plan([])));
    const result = await app.inject({ method: 'GET', url: '/api/ai/capabilities' });
    expect(result.json()).toMatchObject({ semanticQuery: true, entities: { purchase_request: { queryable: true, fields: { pr_number: true, material_description: true, quantity: true, material_code: true } } } });
    await app.close();
  });

  it('reports partial material requirement capabilities without exposing unvalidated fields', async () => {
    const app = await appFor(vi.fn(async () => ({ entity: 'material_requirement', rows: [], rowCount: 0, columns: [] })), providerFor(() => plan([])));
    const result = await app.inject({ method: 'GET', url: '/api/ai/capabilities' });
     expect(result.json()).toMatchObject({ entities: { material_requirement: { queryable: true, fields: { mrp_number: true, material_code: true, material_description: true, required_quantity: false, requirement_date: false, status: true, pr_creation_status: true, pr_created_quantity: false } } } });
    await app.close();
  });

  it('plans MRP material search without quantity/date fields', () => {
    const mrpPlan = deterministicSemanticPlan('MRP material bearing SKF apa aja?');
    expect(mrpPlan).toMatchObject({ entity: 'material_requirement', select: ['mrp_number', 'material_code', 'material_description'], filters: [{ field: 'material_description', operator: 'contains_all', value: ['bearing', 'SKF'] }] });
  });

  it('plans three-state PR lifecycle filters', () => {
    expect(deterministicSemanticPlan('MRP material yang sebagian sudah dibuat PR apa aja?')?.filters).toEqual([{ field: 'pr_creation_status', operator: 'eq', value: 'SEBAGIAN_DIBUAT_PR' }]);
    expect(deterministicSemanticPlan('MRP material yang belum dibuat PR apa aja?')?.filters).toEqual([{ field: 'pr_creation_status', operator: 'eq', value: 'BELUM_DIBUAT_PR' }]);
    expect(deterministicSemanticPlan('MRP material yang sudah dibuat PR semua apa aja?')?.filters).toEqual([{ field: 'pr_creation_status', operator: 'eq', value: 'SUDAH_DIBUAT_PR' }]);
  });

  it('plans bearing partial lifecycle queries with both semantic filters', () => {
    expect(deterministicSemanticPlan('MRP bearing yang sebagian sudah dibuat PR apa aja?')?.filters).toEqual([
      { field: 'material_description', operator: 'contains_all', value: ['bearing'] },
      { field: 'pr_creation_status', operator: 'eq', value: 'SEBAGIAN_DIBUAT_PR' }
    ]);
  });

  it('blocks unvalidated MRP quantity questions', async () => {
    const provider: IntentProvider = { parseIntent: async () => ({ intent: 'SEMANTIC_QUERY', parameters: {} }), answerKnowledge: async () => 'unused', parseSemanticPlan: async () => ({ mode: 'LIVE_QUERY', entity: 'material_requirement', select: ['mrp_number', 'material_code', 'material_description'], metrics: [], aggregates: [], groupBy: [], filters: [{ field: 'material_description', operator: 'contains_all', value: ['bearing'] }], sort: [], limit: 100, offset: 0 }) };
    const app = await appFor(vi.fn(async () => ({ entity: 'material_requirement', rows: [], rowCount: 0, columns: [] })), provider);
    const result = await app.inject({ method: 'POST', url: '/api/ai/ask', payload: { message: 'MRP bearing qty berapa?' } });
    expect(result.json()).toMatchObject({ sourceMode: 'MAPPING_NOT_FOUND', status: 'MAPPING_NOT_FOUND', data: { field: 'required_quantity' } });
    await app.close();
  });

  it('blocks exact-day MRP creation queries before SQL', async () => {
    const executeSemantic = vi.fn(async () => ({ entity: 'material_requirement', rows: [], rowCount: 0, columns: [] }));
    const app = await appFor(executeSemantic, providerFor(() => deterministicSemanticPlan('MRP yang dibuat hari ini apa aja?')!));
    const result = await app.inject({ method: 'POST', url: '/api/ai/ask', payload: { message: 'MRP yang dibuat hari ini apa aja?' } });
    expect(result.json()).toMatchObject({ status: 'TEMPORAL_PRECISION_NOT_AVAILABLE', sourceMode: 'MAPPING_NOT_FOUND' });
    expect(executeSemantic).not.toHaveBeenCalled();
    await app.close();
  });

  it('plans month and year MRP creation filters explicitly', () => {
    expect(deterministicSemanticPlan('MRP yang dibuat bulan September 2026 apa aja?')?.filters).toEqual([{ field: 'mrp_created_date', operator: 'year_month_equals', value: '2026-09' }]);
    expect(deterministicSemanticPlan('MRP yang dibuat tahun 2026 apa aja?')?.filters).toEqual([{ field: 'mrp_created_date', operator: 'year_equals', value: '2026' }]);
  });

  it('executes partial MRP material search with only confirmed fields', async () => {
    const executeSemantic = vi.fn(async (query: SemanticPlan) => ({ entity: 'material_requirement', rows: [{ material_code: 'M-1', material_description: 'BEARING SKF' }], rowCount: 1, columns: query.select }));
    const app = await appFor(executeSemantic, providerFor(() => ({ mode: 'LIVE_QUERY', entity: 'material_requirement', select: ['material_code', 'material_description'], metrics: [], aggregates: [], groupBy: [], filters: [{ field: 'material_description', operator: 'contains_all', value: ['bearing'] }], sort: [], limit: 100, offset: 0 })));
    const result = await app.inject({ method: 'POST', url: '/api/ai/ask', payload: { message: 'MRP material bearing apa aja?' } });
    expect(result.json()).toMatchObject({ sourceMode: 'LIVE_BACKEND', status: 'SUCCESS', entity: 'material_requirement', data: [{ material_code: 'M-1', material_description: 'BEARING SKF' }], visualization: { columns: [{ key: 'material_code', label: 'Kode Material' }, { key: 'material_description', label: 'Material' }] } });
    await app.close();
  });

  it('runs a Purchase Request query through the same /api/ai/ask handler', async () => {
    const planner = vi.fn((_message: string, metadata: any) => {
      expect(metadata).toEqual(expect.arrayContaining([expect.objectContaining({ entity: 'purchase_request', fields: expect.objectContaining({ pr_number: expect.any(Object), material_description: expect.any(Object), quantity: expect.any(Object), material_code: expect.any(Object) }) })]));
      expect(JSON.stringify(metadata)).not.toMatch(/dbo\.|PURC_PURCHREQUEST_TEMP|MaterialName|Qty/);
      return plan([{ field: 'material_description', operator: 'contains', value: 'monitor' }, { field: 'quantity', operator: 'eq', value: 3 }]);
    });
    const executeSemantic = vi.fn(async (query: SemanticPlan) => { expect(query.entity).toBe('purchase_request'); return { entity: 'purchase_request', rows: [{ pr_number: 'redacted-test-value', material_description: 'monitor', quantity: 3 }], rowCount: 1, columns: query.select }; });
    const app = await appFor(executeSemantic, providerFor(planner));
    const result = await app.inject({ method: 'POST', url: '/api/ai/ask', payload: { message: 'No PR monitor yang qty 3 apa?' } });
    expect(result.statusCode).toBe(200);
    expect(result.json()).toMatchObject({ sourceMode: 'LIVE_BACKEND', status: 'SUCCESS', entity: 'purchase_request', data: [{ pr_number: 'redacted-test-value', material_description: 'monitor', quantity: 3 }], visualization: { type: 'table', columns: [{ key: 'pr_number', label: 'No PR' }, { key: 'material_description', label: 'Material' }, { key: 'quantity', label: 'Qty' }] } });
    expect(JSON.stringify(result.json())).not.toMatch(/PURC_PURCHREQUEST_TEMP|PRNo|MaterialName|SELECT|@p\d|credential/i);
    expect(result.json().sourceMode).not.toBe('BLOCKED');
    expect(planner).toHaveBeenCalledOnce();
    expect(executeSemantic).toHaveBeenCalledOnce();
    await app.close();
  });

  it('returns zero results after successful semantic execution', async () => {
    const planner = vi.fn((_message: string, _metadata: unknown) => plan([{ field: 'material_description', operator: 'contains', value: 'laptop' }, { field: 'material_description', operator: 'contains', value: 'ASUS' }, { field: 'quantity', operator: 'eq', value: 5 }]));
    let providerCalls = 0;
    const provider = providerFor((message, metadata) => { providerCalls += 1; return planner(message, metadata); });
    const executeSemantic = vi.fn(async () => ({ entity: 'purchase_request', rows: [], rowCount: 0, columns: ['pr_number', 'material_description', 'quantity'] }));
    const app = await appFor(executeSemantic, provider);
    const result = await app.inject({ method: 'POST', url: '/api/ai/ask', payload: { message: 'No PR laptop ASUS yang qty 5 apa?' } });
    expect(result.statusCode).toBe(200);
    expect(result.json()).toMatchObject({ sourceMode: 'LIVE_BACKEND', status: 'ZERO_RESULTS', data: [], visualization: { type: 'table' } });
    expect(result.json().answer).toMatch(/tidak ditemukan/i);
    expect(providerCalls).toBe(1);
    expect(executeSemantic).toHaveBeenCalledOnce();
    await app.close();
  });

  it('gives semantic resolution a chance when the legacy parser says unsupported', async () => {
    const planner = vi.fn((_message: string, _metadata: unknown) => plan([{ field: 'material_description', operator: 'contains', value: 'monitor' }]));
    const executeSemantic = vi.fn(async () => ({ entity: 'purchase_request', rows: [], rowCount: 0, columns: ['pr_number', 'material_description', 'quantity'] }));
    const app = await appFor(executeSemantic, providerFor(planner, 'UNSUPPORTED'));
    const result = await app.inject({ method: 'POST', url: '/api/ai/ask', payload: { message: 'No PR monitor apa?' } });
    expect(result.json().sourceMode).toBe('LIVE_BACKEND');
    expect(planner).toHaveBeenCalledOnce();
    expect(executeSemantic).toHaveBeenCalledOnce();
    await app.close();
  });
});
