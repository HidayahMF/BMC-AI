import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { MockAIProvider } from '../ai/providers/mock.provider.js';
import { GeminiProvider } from '../ai/providers/gemini.provider.js';
import { AIProviderError } from '../ai/providers/provider-error.js';
import { askAgent } from '../ai/agent.js';
import { env } from '../config/env.js';
import { clearPendingCustomerResolution, getPendingCustomerResolution, setPendingCustomerResolution } from '../services/conversation.service.js';

const requestSchema = z.object({ message: z.string().trim().min(1).max(4000) });
const askBodySchema = requestSchema.extend({ sessionId: z.string().uuid().optional() });
const selectBodySchema = z.object({ sessionId: z.string().uuid(), customerCode: z.string().trim().min(1).max(50) });
const sessionHits = new Map<string, { started: number; count: number }>();
function sessionAllowed(key: string) { const now = Date.now(); const hit = sessionHits.get(key); if (!hit || now - hit.started >= env.AI_SESSION_RATE_LIMIT_WINDOW_MS) { sessionHits.set(key, { started: now, count: 1 }); return true; } if (hit.count >= env.AI_SESSION_RATE_LIMIT_MAX) return false; hit.count += 1; return true; }

export async function aiRoutes(app: FastifyInstance) {
  const mockProvider = new MockAIProvider(); const geminiProvider = new GeminiProvider(); const provider = env.AI_PROVIDER === 'gemini' ? geminiProvider : mockProvider;
  app.get('/api/ai/capabilities', async () => ({ sales: true, deliveryLookup: true, deliveryProgress: false, inventory: true, productionOutput: false, productionProgress: false, eta: false }));
  app.post('/api/ai/ask', async (request, reply) => {
    const parsed = askBodySchema.safeParse(request.body); if (!parsed.success) return reply.code(400).send({ error: 'Message and optional sessionId are required.' }); if (!sessionAllowed(parsed.data.sessionId ?? request.ip)) return reply.code(429).send({ error: 'Session rate limit exceeded.', requestId: request.id });
    try { const localDataRequest = /stok|stock|saldo\s+stok|persediaan|material|order|sales order|\bso\b|\bpo\b|\bbid\b/i.test(parsed.data.message); const result = env.AI_PROVIDER === 'mock' || localDataRequest ? await askAgent(parsed.data.message) : await provider.generate(parsed.data); if (parsed.data.sessionId && result.toolsUsed.includes('search_customer') && result.data && typeof result.data === 'object' && 'customers' in result.data && Array.isArray(result.data.customers) && result.data.customers.length > 1) setPendingCustomerResolution(parsed.data.sessionId, parsed.data.message, result.data.customers as Array<{ code: string; name: string; alias: string | null }>); return { ...result, requestId: request.id, visualization: null, sessionId: parsed.data.sessionId }; }
    catch (error) { const providerError = error instanceof AIProviderError ? error : null; request.log.error({ provider: providerError?.details.provider, status: providerError?.details.statusCode, reason: providerError?.details.reason, requestId: request.id }, 'AI provider or approved tool failed'); return reply.code(providerError?.details.statusCode === 429 ? 429 : 503).send({ error: providerError?.details.safeMessage ?? 'Layanan AI sementara tidak dapat dihubungi.', requestId: request.id }); }
  });
  app.post('/api/ai/select-customer', async (request, reply) => {
    const parsed = selectBodySchema.safeParse(request.body); if (!parsed.success) return reply.code(400).send({ error: 'A valid sessionId and customerCode are required.' }); const pending = getPendingCustomerResolution(parsed.data.sessionId); if (!pending) return reply.code(409).send({ error: 'Customer selection has expired. Please ask the question again.' }); const selected = pending.candidates.find((customer) => customer.code === parsed.data.customerCode); if (!selected) return reply.code(400).send({ error: 'Selected customer is not one of the candidates.' });
    try { const result = await askAgent(pending.originalMessage, selected); clearPendingCustomerResolution(parsed.data.sessionId); return { ...result, requestId: request.id, visualization: null, sessionId: parsed.data.sessionId, selectedCustomer: selected }; } catch { return reply.code(503).send({ error: 'Data business sedang tidak tersedia. Silakan coba kembali.', requestId: request.id }); }
  });
  app.get('/api/ai/ask/stream', async (request, reply) => { const parsed = requestSchema.safeParse(request.query); if (!parsed.success) return reply.code(400).send({ error: 'Message is required.' }); reply.hijack(); reply.raw.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', connection: 'keep-alive' }); try { for await (const chunk of provider.stream(parsed.data)) reply.raw.write(`data: ${JSON.stringify({ chunk })}\n\n`); reply.raw.write('event: done\ndata: {}\n\n'); } finally { reply.raw.end(); } });
}
