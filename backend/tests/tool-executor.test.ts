import { describe, expect, it, vi } from 'vitest';
import { executeTool } from '../src/ai/tools/executor.js';
import { toolRegistry, toolDefinitions } from '../src/ai/tools/registry.js';
import { GeminiProvider } from '../src/ai/providers/gemini.provider.js';
import { MockAIProvider } from '../src/ai/providers/mock.provider.js';
import { aiEnv } from '../src/ai/config/env.js';
import { customerService } from '../src/services/customer.service.js';
import { executeAction } from '../src/actions/executor.js';
import { salesService } from '../src/services/sales.service.js';

describe('AI/data boundary', () => {
  it('exposes no DB-backed tools to the AI registry', () => { expect(Object.keys(toolRegistry)).toEqual([]); expect(toolDefinitions).toEqual([]); });
  it('rejects arbitrary SQL and unknown tools', async () => { await expect(executeTool('execute_sql', {})).resolves.toEqual({ ok: false, error: 'Unknown approved tool: execute_sql' }); await expect(executeTool('search_customer', {})).resolves.toEqual({ ok: false, error: 'Unknown approved tool: search_customer' }); });
  it('parses live intent without DB access in the provider', async () => { await expect(new MockAIProvider().parseIntent('Order Hino bulan ini apa saja?')).resolves.toMatchObject({ intent: 'GET_CUSTOMER_ORDERS', parameters: { customerQuery: expect.stringContaining('Hino') } }); });
  it('keeps provider payload free of DB results during a live action', async () => {
    const original = aiEnv.GEMINI_API_KEY; aiEnv.GEMINI_API_KEY = 'test-key';
    const fetchSpy = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => { const body = String(init?.body); expect(body).not.toContain('PT HINO'); expect(body).not.toContain('999999'); expect(body.match(/SLS\.TEST\.001/g)?.length).toBe(1); return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"intent":"GET_ORDER_DETAILS","parameters":{"orderNumber":"SLS.TEST.001"}}' }] } }] }), { status: 200 }); });
    vi.stubGlobal('fetch', fetchSpy); const intent = await new GeminiProvider().parseIntent('SLS.TEST.001 isinya apa?'); expect(intent.intent).toBe('GET_ORDER_DETAILS'); expect(fetchSpy).toHaveBeenCalledTimes(1); vi.unstubAllGlobals(); aiEnv.GEMINI_API_KEY = original;
  });
  it('returns DB action directly without a second provider call', async () => { const search = vi.spyOn(salesService, 'search').mockResolvedValue([{ id: 1, orderNumber: 'SLS.TEST.001', customerPoNumber: null, orderDate: null, customer: { code: '1', name: 'PT HINO', alias: null }, status: null, deliveryFrom: null, deliveryTo: null, totalLines: 1, items: [{ productId: null, productCode: 'P-1', productDescription: 'Test', quantity: 999999, unit: null }] }]); const result = await executeAction({ intent: 'SEARCH_ORDER', parameters: { orderNumber: 'SLS.TEST.001' } }); expect(result.data).toEqual(expect.arrayContaining([expect.objectContaining({ orderNumber: 'SLS.TEST.001' })])); search.mockRestore(); });
  it('keeps customer ambiguity in backend', async () => { const search = vi.spyOn(customerService, 'search').mockResolvedValue([{ code: '1', name: 'Hino A', alias: null }, { code: '2', name: 'Hino B', alias: null }]); const result = await executeAction({ intent: 'GET_CUSTOMER_ORDERS', parameters: { customerQuery: 'Hino' } }); expect(result.status).toBe('AMBIGUOUS'); expect(result.customerCandidates).toHaveLength(2); search.mockRestore(); });
  it('rejects unsupported intents deterministically', async () => { const provider = new MockAIProvider(); await expect(provider.parseIntent('Buatkan laporan bebas')).resolves.toMatchObject({ intent: 'UNSUPPORTED' }); });
});
