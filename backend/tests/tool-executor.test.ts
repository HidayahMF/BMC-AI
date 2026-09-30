import { describe, expect, it, vi } from 'vitest';
import { executeTool } from '../src/ai/tools/executor.js';
import { toolRegistry } from '../src/ai/tools/registry.js';
import { GeminiProvider } from '../src/ai/providers/gemini.provider.js';
import { env } from '../src/config/env.js';
import { askAgent } from '../src/ai/agent.js';
import { customerService } from '../src/services/customer.service.js';

describe('approved tool executor', () => {
  it('exposes approved tools without an SQL executor', () => {
    expect(Object.keys(toolRegistry)).toEqual(expect.arrayContaining(['search_customer', 'get_customer_orders', 'get_order_details', 'get_stock_status']));
    expect('execute_sql' in toolRegistry).toBe(false);
  });

  it('rejects unknown tools', async () => {
    await expect(executeTool('execute_sql', {})).resolves.toEqual({ ok: false, error: 'Unknown approved tool: execute_sql' });
    await expect(executeTool('unknown_tool', {})).resolves.toEqual({ ok: false, error: 'Unknown approved tool: unknown_tool' });
  });

  it('rejects invalid approved-tool arguments before execution', async () => {
    await expect(executeTool('search_customer', { query: '' })).resolves.toEqual({ ok: false, error: 'Tool arguments failed validation.' });
    await expect(executeTool('get_order_details', { orderNo: 123 })).resolves.toEqual({ ok: false, error: 'Tool arguments failed validation.' });
  });

  it('returns a controlled provider-unavailable error when Gemini is not configured', async () => {
    const original = env.GEMINI_API_KEY;
    env.GEMINI_API_KEY = '';
    await expect(new GeminiProvider().generate({ message: 'test' })).rejects.toThrow('Layanan AI belum dikonfigurasi.');
    env.GEMINI_API_KEY = original;
  });

  it('returns a deterministic blocked response for production', async () => {
    const result = await askAgent('Produksi Hino hari ini berapa?');
    expect(result.data).toEqual({ capability: 'productionOutput', available: false, reason: 'Sumber actual production belum tervalidasi.' });
    expect(result.answer).toContain('belum dapat dihitung');
  });

  it('preserves customer ambiguity', async () => {
    const search = vi.spyOn(customerService, 'search').mockResolvedValue([
      { code: '1', name: 'Hino A', alias: null },
      { code: '2', name: 'Hino B', alias: null }
    ]);
    const result = await askAgent('Cari customer Hino');
    expect(result.data).toMatchObject({ ambiguous: true, items: expect.any(Array), matches: expect.any(Array) });
    expect(result.toolsUsed).toEqual(['search_customer']);
    search.mockRestore();
  });

  it('retries a transient 503 and succeeds', async () => {
    const original = { key: env.GEMINI_API_KEY, attempts: env.AI_RETRY_MAX_ATTEMPTS, base: env.AI_RETRY_BASE_DELAY_MS };
    env.GEMINI_API_KEY = 'test-key'; env.AI_RETRY_MAX_ATTEMPTS = 3; env.AI_RETRY_BASE_DELAY_MS = 0;
    let calls = 0; vi.stubGlobal('fetch', vi.fn(async () => ++calls === 1 ? new Response(JSON.stringify({ error: { status: 'UNAVAILABLE', message: 'busy' } }), { status: 503 }) : new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: 'OK' }] } }] }), { status: 200 })));
    await expect(new GeminiProvider().generate({ message: 'test' })).resolves.toMatchObject({ answer: 'OK' }); expect(calls).toBe(2); vi.unstubAllGlobals(); Object.assign(env, { GEMINI_API_KEY: original.key, AI_RETRY_MAX_ATTEMPTS: original.attempts, AI_RETRY_BASE_DELAY_MS: original.base });
  });

  it('does not retry permanent 400 errors and preserves sanitized details', async () => {
    const original = env.GEMINI_API_KEY; env.GEMINI_API_KEY = 'test-key'; let calls = 0; vi.stubGlobal('fetch', vi.fn(async () => { calls += 1; return new Response(JSON.stringify({ error: { status: 'INVALID_ARGUMENT', message: 'secret prompt must not leak' } }), { status: 400 }); }));
    await expect(new GeminiProvider().generate({ message: 'test' })).rejects.toMatchObject({ details: { statusCode: 400, providerStatus: 'INVALID_ARGUMENT', retryable: false } }); expect(calls).toBe(1); vi.unstubAllGlobals(); env.GEMINI_API_KEY = original;
  });
});
