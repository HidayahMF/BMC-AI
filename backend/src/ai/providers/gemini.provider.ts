import { aiEnv } from '../config/env.js';
import { AIProviderError } from './provider-error.js';
import { parseIntent } from '../intents/parser.js';
import type { Intent } from '../intents/schema.js';
import type { IntentProvider } from './intent-provider.js';
import { semanticPlanSchema, type SemanticPlan } from '../../semantic/schema.js';
import { deterministicSemanticPlan } from '../../semantic/deterministic-plan.js';

const instruction = 'You are a BMC intent parser. Return JSON only with intent and parameters. Never request, infer, or receive database rows. Live data intents are executed by the backend. Knowledge questions may be answered only from supplied approved documentation excerpts. Use SEMANTIC_QUERY for generic live business questions that are not specialized fixed workflows. Allowed intents: SEARCH_CUSTOMER, GET_CUSTOMER_ORDERS, SEARCH_ORDER, GET_ORDER_DETAILS, GET_LATEST_CUSTOMER_ORDERS, GET_DELIVERY_LOOKUP, GET_STOCK_STATUS, SEMANTIC_QUERY, KNOWLEDGE_QUERY, UNSUPPORTED.';
type GeminiErrorBody = { error?: { status?: string; reason?: string; details?: Array<{ reason?: string; retryDelay?: string }> } };
const transient = new Set([408, 429, 500, 502, 503, 504]);
function safeError(response: Response, body: GeminiErrorBody) { const status = body.error?.status ?? (response.status === 429 ? 'RESOURCE_EXHAUSTED' : undefined); return new AIProviderError({ provider: 'gemini', statusCode: response.status, providerStatus: status, reason: body.error?.reason ?? status ?? 'PROVIDER_ERROR', retryable: transient.has(response.status), safeMessage: response.status === 429 ? 'BMC AI sedang mencapai batas permintaan AI. Coba lagi beberapa saat.' : 'Layanan AI sementara tidak dapat memproses permintaan.' }); }

export class GeminiProvider implements IntentProvider {
  async parseIntent(message: string): Promise<Intent> {
    if (!aiEnv.GEMINI_API_KEY) return parseIntent(undefined, message);
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), aiEnv.AI_TIMEOUT_MS);
    try {
      const payload = { contents: [{ role: 'user', parts: [{ text: message }] }], systemInstruction: { parts: [{ text: instruction }] }, generationConfig: { temperature: 0, responseMimeType: 'application/json' } };
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(aiEnv.AI_MODEL)}:generateContent?key=${encodeURIComponent(aiEnv.GEMINI_API_KEY)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, signal: controller.signal, body: JSON.stringify(payload) });
      if (!response.ok) { let body: GeminiErrorBody = {}; try { body = await response.json() as GeminiErrorBody; } catch {} throw safeError(response, body); }
      const result = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim() ?? '';
      let value: unknown; try { value = JSON.parse(text.replace(/^```json\s*|\s*```$/g, '')); } catch { value = undefined; }
      return parseIntent(value, message);
    } finally { clearTimeout(timer); }
  }

  async answerKnowledge(message: string, excerpts: string[]) {
    if (!aiEnv.GEMINI_API_KEY) return excerpts.length ? `Knowledge approved ditemukan untuk: ${message}.\n\n${excerpts.join('\n\n')}` : 'Knowledge approved tidak ditemukan.';
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), aiEnv.AI_TIMEOUT_MS);
    try {
      const payload = { contents: [{ role: 'user', parts: [{ text: `Pertanyaan: ${message}\n\nApproved documentation:\n${excerpts.join('\n\n')}` }] }], systemInstruction: { parts: [{ text: 'Jawab hanya berdasarkan approved documentation. Jangan mengklaim data live, jangan membuat SQL, dan jangan menyebut atau meminta database rows.' }] }, generationConfig: { temperature: 0.1 } };
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(aiEnv.AI_MODEL)}:generateContent?key=${encodeURIComponent(aiEnv.GEMINI_API_KEY)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, signal: controller.signal, body: JSON.stringify(payload) });
      if (!response.ok) { let body: GeminiErrorBody = {}; try { body = await response.json() as GeminiErrorBody; } catch {} throw safeError(response, body); }
      const result = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      return result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim() || 'Knowledge response kosong.';
    } finally { clearTimeout(timer); }
  }

  async parseSemanticPlan(message: string, metadata: unknown): Promise<SemanticPlan> {
    const fallback = deterministicSemanticPlan(message);
    if (!aiEnv.GEMINI_API_KEY) { if (fallback) return fallback; throw new AIProviderError({ provider: 'gemini', reason: 'NOT_CONFIGURED', retryable: false, safeMessage: 'Layanan AI belum dikonfigurasi.' }); }
    const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), aiEnv.AI_TIMEOUT_MS);
    try { const payload = { contents: [{ role: 'user', parts: [{ text: `Question: ${message}\nRelevant approved semantic metadata:\n${JSON.stringify(metadata)}` }] }], systemInstruction: { parts: [{ text: 'Return JSON only matching semantic query plan. Use entity and fields only from metadata. Never output SQL, physical table names, or database values.' }] }, generationConfig: { temperature: 0, responseMimeType: 'application/json' } }; const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(aiEnv.AI_MODEL)}:generateContent?key=${encodeURIComponent(aiEnv.GEMINI_API_KEY)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, signal: controller.signal, body: JSON.stringify(payload) }); if (!response.ok) throw safeError(response, {}); const result = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> }; const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim() ?? ''; return semanticPlanSchema.parse(JSON.parse(text.replace(/^```json\s*|\s*```$/g, ''))); } catch (error) { if (fallback) return fallback; throw error; } finally { clearTimeout(timer); }
  }
}
