import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { MockAIProvider } from '../ai/providers/mock.provider.js';
import { GeminiProvider } from '../ai/providers/gemini.provider.js';
import { AIProviderError } from '../ai/providers/provider-error.js';
import { approvedKnowledge } from '../ai/knowledge.js';
import { executeAction } from '../actions/executor.js';
import { presentLive } from '../actions/presenters.js';
import { env } from '../config/env.js';
import { clearPendingCustomerResolution, getPendingCustomerResolution, setPendingCustomerResolution } from '../services/conversation.service.js';
import type { Intent } from '../ai/intents/schema.js';
import type { IntentProvider } from '../ai/providers/intent-provider.js';
import { relevantMetadata } from '../semantic/metadata.js';
import { executeSemanticPlan, SemanticRuntimeError } from '../semantic/executor.js';
import { getEntity } from '../semantic/catalog.js';
import { deterministicSemanticPlan } from '../semantic/deterministic-plan.js';
import { presentSemantic } from '../semantic/presenter.js';
import { normalizePurchaseRequestPlan } from '../semantic/normalize-plan.js';

const requestSchema = z.object({ message: z.string().trim().min(1).max(4000) });
const askBodySchema = requestSchema.extend({ sessionId: z.string().uuid().optional() });
const selectBodySchema = z.object({ sessionId: z.string().uuid(), customerCode: z.string().trim().min(1).max(50) });
const sessionHits = new Map<string, { started: number; count: number }>();
function sessionAllowed(key: string) { const now = Date.now(); const hit = sessionHits.get(key); if (!hit || now - hit.started >= env.AI_SESSION_RATE_LIMIT_WINDOW_MS) { sessionHits.set(key, { started: now, count: 1 }); return true; } if (hit.count >= env.AI_SESSION_RATE_LIMIT_MAX) return false; hit.count += 1; return true; }
function audit(event: string, meta: Record<string, unknown>) { console.info(JSON.stringify({ event, ...meta })); }
function response(result: { sourceMode: string; answer: string; data: unknown; visualization: unknown; sources: string[]; status?: string; entity?: string }, requestId: string, sessionId?: string) { return { ...result, requestId, sessionId, toolsUsed: [], sourceMode: result.sourceMode }; }

export async function aiRoutes(app: FastifyInstance, options: { provider?: IntentProvider; executeSemantic?: typeof executeSemanticPlan } = {}) {
  const provider = options.provider ?? (env.AI_PROVIDER === 'gemini' ? new GeminiProvider() : new MockAIProvider());
  const executeSemantic = options.executeSemantic ?? executeSemanticPlan;
   app.get('/api/ai/capabilities', async () => ({ sales: true, deliveryLookup: true, deliveryProgress: false, inventory: true, productionOutput: false, productionProgress: false, eta: false, semanticQuery: true, entities: Object.fromEntries((['purchase_request', 'material_requirement'] as const).map((name) => { const entity = getEntity(name); return [name, { queryable: entity?.queryable === true, fields: Object.fromEntries(Object.entries(entity?.fields ?? {}).map(([field, value]) => [field, value.queryable === true])), fieldMetadata: Object.fromEntries(Object.entries(entity?.fields ?? {}).filter(([, value]) => value.temporalPrecision || value.enumMapping).map(([field, value]) => [field, { confidence: value.confidence, queryable: value.queryable === true, ...(value.temporalPrecision ? { temporalPrecision: value.temporalPrecision, temporalCapabilities: value.temporalCapabilities } : {}), ...(value.enumMapping ? { values: Object.keys(value.enumMapping) } : {}) }])), aggregates: entity?.queryable === true }]; })) }));
  app.post('/api/ai/ask', async (request, reply) => {
    const parsed = askBodySchema.safeParse(request.body); if (!parsed.success) return reply.code(400).send({ error: 'Message and optional sessionId are required.' }); if (!sessionAllowed(parsed.data.sessionId ?? request.ip)) return reply.code(429).send({ error: 'Session rate limit exceeded.', requestId: request.id });
    try {
      const metadata = relevantMetadata(parsed.data.message);
      audit('SEMANTIC_RUNTIME_STAGE', { requestId: request.id, stage: 'metadata', status: 'PASS', entity: metadata[0]?.entity, fieldCount: metadata[0] ? Object.keys(metadata[0].fields).length : 0 });
      let intent: Intent;
      try { intent = await provider.parseIntent(parsed.data.message); } catch (error) {
        if (!metadata.length || !deterministicSemanticPlan(parsed.data.message)) throw error;
        intent = { intent: 'SEMANTIC_QUERY', parameters: {} };
        audit('AI_INTENT_FALLBACK', { requestId: request.id, intent: intent.intent, reason: 'SEMANTIC_QUERY_PROVIDER_UNAVAILABLE' });
      }
      audit('AI_INTENT_PARSED', { requestId: request.id, intent: intent.intent });
      if (intent.intent === 'KNOWLEDGE_QUERY') { const excerpts = await approvedKnowledge(parsed.data.message); const answer = await provider.answerKnowledge(parsed.data.message, excerpts); return response({ sourceMode: 'KNOWLEDGE', answer, data: { excerpts: excerpts.map((item) => item.split('\n', 1)[0]) }, visualization: null, sources: excerpts.map((item) => item.split('\n', 1)[0]) }, request.id, parsed.data.sessionId); }
      if (intent.intent === 'SEMANTIC_QUERY' || (intent.intent === 'UNSUPPORTED' && metadata.length > 0)) {
        if (!metadata.length) return response({ sourceMode: 'MAPPING_NOT_FOUND', answer: 'Semantic mapping untuk pertanyaan ini belum tersedia.', data: { capability: 'MAPPING_NOT_FOUND', available: false }, visualization: null, sources: [] }, request.id, parsed.data.sessionId);
        audit('SEMANTIC_RUNTIME_STAGE', { requestId: request.id, stage: 'semantic_plan', status: 'START', entity: metadata[0]?.entity });
        const plan = normalizePurchaseRequestPlan(await provider.parseSemanticPlan(parsed.data.message, metadata), parsed.data.message);
        audit('SEMANTIC_RUNTIME_STAGE', { requestId: request.id, stage: 'semantic_plan', status: 'PASS', entity: plan.entity, select: plan.select, filterCount: plan.filters.length, filters: plan.filters.map((filter) => ({ field: filter.field, operator: filter.operator, termCount: Array.isArray(filter.value) ? filter.value.length : filter.value === undefined ? 0 : 1 })) });
        if (plan.entity === 'material_requirement' && /total|sum|jumlah total/i.test(parsed.data.message)) return response({ sourceMode: 'MAPPING_NOT_FOUND', status: 'AGGREGATION_NOT_VALIDATED', entity: plan.entity, answer: 'Agregasi planning quantity MRP belum divalidasi karena grain data masih memiliki duplikasi.', data: { capability: 'AGGREGATION_NOT_VALIDATED', available: false }, visualization: null, sources: [] }, request.id, parsed.data.sessionId);
        if (plan.entity === 'material_requirement' && /hari ini|kemarin|tanggal \d|today|yesterday/i.test(parsed.data.message)) return response({ sourceMode: 'MAPPING_NOT_FOUND', status: 'TEMPORAL_PRECISION_NOT_AVAILABLE', entity: plan.entity, answer: 'Data tanggal pembuatan MRP sebagian besar hanya menyimpan bulan dan tahun, jadi pencarian berdasarkan hari/tanggal spesifik belum dapat dilakukan secara lengkap.', data: { capability: 'TEMPORAL_PRECISION_NOT_AVAILABLE', available: false }, visualization: null, sources: [] }, request.id, parsed.data.sessionId);
        if (plan.entity === 'material_requirement' && /\bqty\b|quantity|berapa|jumlah|required quantity|requirement qty/i.test(parsed.data.message) && !plan.select.includes('planned_purchase_quantity')) return response({ sourceMode: 'MAPPING_NOT_FOUND', status: 'MAPPING_NOT_FOUND', entity: plan.entity, answer: 'Field quantity MRP belum memiliki semantic mapping yang tervalidasi.', data: { capability: 'FIELD_NOT_VALIDATED', field: 'required_quantity', available: false }, visualization: null, sources: [] }, request.id, parsed.data.sessionId);
        const semanticResult = await executeSemantic(plan, request.id);
        audit('SEMANTIC_QUERY_EXECUTED', { requestId: request.id, entity: semanticResult.entity, rowCount: semanticResult.rowCount });
        audit('SEMANTIC_RUNTIME_STAGE', { requestId: request.id, stage: 'presenter', status: 'PASS', entity: semanticResult.entity, rowCount: semanticResult.rowCount });
        return response(presentSemantic(plan, semanticResult), request.id, parsed.data.sessionId);
      }
      const result = await executeAction(intent); audit('BACKEND_ACTION_EXECUTED', { requestId: request.id, action: intent.intent, status: result.status });
      if (result.status === 'AMBIGUOUS' && parsed.data.sessionId && result.customerCandidates) { setPendingCustomerResolution(parsed.data.sessionId, parsed.data.message, intent, result.customerCandidates); return response({ sourceMode: 'LIVE_BACKEND', answer: 'Saya menemukan beberapa customer yang cocok. Mohon pilih customer yang dimaksud.', data: { customers: result.customerCandidates, needsUserSelection: true }, visualization: 'customer-list', sources: ['SQLSERVER.dbo.MAS_CUSTOMER'] }, request.id, parsed.data.sessionId); }
      if (intent.intent === 'UNSUPPORTED') return response({ sourceMode: 'BLOCKED', answer: 'Pertanyaan ini belum memiliki capability yang didukung.', data: { capability: 'UNSUPPORTED', available: false }, visualization: null, sources: [] }, request.id, parsed.data.sessionId);
      return response(presentLive(intent, result), request.id, parsed.data.sessionId);
    } catch (error) { const providerError = error instanceof AIProviderError ? error : null; const semanticError = error instanceof SemanticRuntimeError ? error : null; audit('SEMANTIC_RUNTIME_STAGE', { requestId: request.id, stage: semanticError?.stage ?? 'semantic_plan', status: 'FAIL', entity: semanticError?.details.entity, errorCode: semanticError?.errorCode, errorName: error instanceof Error ? error.name : 'RUNTIME_ERROR', sqlErrorNumber: semanticError?.details.sqlErrorNumber }); request.log.error({ provider: providerError?.details.provider, status: providerError?.details.statusCode, reason: providerError?.details.reason, requestId: request.id, semanticStage: semanticError?.stage, semanticErrorCode: semanticError?.errorCode, errorName: error instanceof Error ? error.name : 'RUNTIME_ERROR', sqlErrorNumber: semanticError?.details.sqlErrorNumber }, 'intent or backend action failed'); return reply.code(providerError?.details.statusCode === 429 ? 429 : 503).send({ error: providerError?.details.safeMessage ?? 'Data business sedang tidak tersedia. Silakan coba kembali.', requestId: request.id }); }
  });
  app.post('/api/ai/select-customer', async (request, reply) => {
    const parsed = selectBodySchema.safeParse(request.body); if (!parsed.success) return reply.code(400).send({ error: 'A valid sessionId and customerCode are required.' }); const pending = getPendingCustomerResolution(parsed.data.sessionId); if (!pending) return reply.code(409).send({ error: 'Customer selection has expired. Please ask the question again.' }); if (!pending.candidates.some((customer) => customer.code === parsed.data.customerCode)) return reply.code(400).send({ error: 'Selected customer is not one of the candidates.' });
    try { const result = await executeAction(pending.intent, parsed.data.customerCode); audit('BACKEND_ACTION_EXECUTED', { requestId: request.id, action: pending.intent.intent, status: result.status }); clearPendingCustomerResolution(parsed.data.sessionId); return response(presentLive(pending.intent, result), request.id, parsed.data.sessionId); } catch { return reply.code(503).send({ error: 'Data business sedang tidak tersedia. Silakan coba kembali.', requestId: request.id }); }
  });
  app.get('/api/ai/ask/stream', async (request, reply) => { const parsed = requestSchema.safeParse(request.query); if (!parsed.success) return reply.code(400).send({ error: 'Message is required.' }); reply.hijack(); reply.raw.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' }); try { const intent = await provider.parseIntent(parsed.data.message); const text = intent.intent === 'KNOWLEDGE_QUERY' ? await provider.answerKnowledge(parsed.data.message, await approvedKnowledge(parsed.data.message)) : presentLive(intent, await executeAction(intent)).answer; reply.raw.write(`data: ${JSON.stringify({ chunk: text })}\n\n`); reply.raw.write('event: done\ndata: {}\n\n'); } finally { reply.raw.end(); } });
}
