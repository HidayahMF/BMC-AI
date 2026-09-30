import type { AIProvider, ToolResult } from './provider.js';
import { AIProviderError } from './provider-error.js';
import { env } from '../../config/env.js';
import { executeTool } from '../tools/executor.js';
import { toolDefinitions } from '../tools/registry.js';

let activeRequests = 0; const waiters: Array<() => void> = [];
async function acquire() { while (activeRequests >= env.AI_MAX_CONCURRENCY) await new Promise<void>((resolve) => waiters.push(resolve)); activeRequests += 1; }
function release() { activeRequests -= 1; waiters.shift()?.(); }
const transient = new Set([408, 429, 500, 502, 503, 504]);
const instruction = 'You are BMC AI. Use approved tools for every business fact. Never invent orders, quantities, delivery, stock, production, dates, or customer data. If a tool says not found, say data tidak ditemukan. Do not generate SQL. Distinguish database facts from backend calculations. If customer search is ambiguous, ask the user to select a candidate and do not choose one yourself.';

type GeminiErrorBody = { error?: { status?: string; message?: string; reason?: string; details?: Array<{ reason?: string; retryDelay?: string }> } };
function retryDelayMs(response: Response, body: GeminiErrorBody) { const header = response.headers.get('retry-after'); if (header && /^\d+(\.\d+)?$/.test(header)) return Math.round(Number(header) * 1000); const value = body.error?.details?.find((item) => item.retryDelay)?.retryDelay; const match = value?.match(/^(\d+(?:\.\d+)?)s$/); return match ? Math.round(Number(match[1]) * 1000) : undefined; }
function safeError(response: Response, body: GeminiErrorBody) { const status = body.error?.status ?? (response.status === 429 ? 'RESOURCE_EXHAUSTED' : undefined); const reason = body.error?.reason ?? body.error?.details?.find((item) => item.reason)?.reason ?? (response.status === 429 ? 'RESOURCE_EXHAUSTED_UNKNOWN' : status ?? 'PROVIDER_ERROR'); const retryable = transient.has(response.status); const safeMessage = response.status === 429 ? 'BMC AI sedang mencapai batas permintaan AI. Coba lagi beberapa saat.' : response.status >= 500 ? 'Layanan AI sedang sibuk. Silakan coba lagi sebentar.' : 'Layanan AI sementara tidak dapat memproses permintaan.'; return new AIProviderError({ provider: 'gemini', statusCode: response.status, providerStatus: status, reason, retryable, retryAfterMs: retryDelayMs(response, body), safeMessage }); }

export class GeminiProvider implements AIProvider {
  async generate({ message }: { message: string; context?: unknown }): Promise<ToolResult> {
    if (!env.GEMINI_API_KEY) throw new AIProviderError({ provider: 'gemini', reason: 'NOT_CONFIGURED', retryable: false, safeMessage: 'Layanan AI belum dikonfigurasi.' });
    await acquire(); const controller = new AbortController(); const timer = setTimeout(() => controller.abort(), env.AI_TIMEOUT_MS);
    try {
      const contents: Array<Record<string, unknown>> = [{ role: 'user', parts: [{ text: message }] }]; const toolsUsed: string[] = []; let lastData: unknown = null; let sources: string[] = [];
      for (let step = 0; step < env.AI_MAX_TOOL_STEPS; step += 1) {
        const payload = { contents, systemInstruction: { parts: [{ text: instruction }] }, tools: [{ functionDeclarations: toolDefinitions }], generationConfig: { temperature: 0.1 } };
        let response: Response | undefined; let body: GeminiErrorBody = {};
        for (let attempt = 1; attempt <= env.AI_RETRY_MAX_ATTEMPTS; attempt += 1) {
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(env.AI_MODEL)}:generateContent?key=${encodeURIComponent(env.GEMINI_API_KEY)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, signal: controller.signal, body: JSON.stringify(payload) });
          if (response.ok) break;
          try { body = await response.clone().json() as GeminiErrorBody; } catch { body = {}; }
          const error = safeError(response, body); console.info(JSON.stringify({ provider: 'gemini', model: env.AI_MODEL, attempt, status: error.details.statusCode, reason: error.details.reason, retryable: error.details.retryable }));
          if (!error.details.retryable || attempt === env.AI_RETRY_MAX_ATTEMPTS) throw error;
          const delay = error.details.retryAfterMs ?? Math.min(env.AI_RETRY_MAX_DELAY_MS, env.AI_RETRY_BASE_DELAY_MS * 2 ** (attempt - 1)) + Math.floor(Math.random() * 250);
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
        const result = await response!.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string; functionCall?: { name: string; args?: unknown } }> } }> };
        const parts = result.candidates?.[0]?.content?.parts ?? []; const call = parts.find((part) => part.functionCall)?.functionCall;
        if (!call) { const answer = parts.map((part) => part.text ?? '').join('').trim(); if (!answer) throw new AIProviderError({ provider: 'gemini', reason: 'EMPTY_RESPONSE', retryable: false, safeMessage: 'Layanan AI memberikan respons kosong.' }); return { answer, data: lastData, sources, toolsUsed }; }
        const toolStart = Date.now(); const toolResult = await executeTool(call.name, call.args ?? {}); console.info(JSON.stringify({ provider: 'gemini', model: env.AI_MODEL, tool: call.name, durationMs: Date.now() - toolStart, success: toolResult.ok })); toolsUsed.push(call.name); lastData = toolResult.data ?? { error: toolResult.error }; if (toolResult.ok && Array.isArray(toolResult.data)) sources = sources.length ? sources : [`SQLSERVER.approved-tool:${call.name}`];
        if (call.name === 'search_customer' && toolResult.ok && Array.isArray(toolResult.data) && toolResult.data.length > 1) return { answer: 'Saya menemukan beberapa customer yang cocok. Mohon pilih customer yang dimaksud.', data: { customers: toolResult.data, needsUserSelection: true }, sources, toolsUsed };
        contents.push({ role: 'model', parts }); contents.push({ role: 'user', parts: [{ functionResponse: { name: call.name, response: toolResult } }] });
      }
      throw new AIProviderError({ provider: 'gemini', reason: 'TOOL_STEP_LIMIT', retryable: false, safeMessage: 'Permintaan AI membutuhkan terlalu banyak langkah.' });
    } finally { clearTimeout(timer); release(); }
  }
  async *stream(input: { message: string; context?: unknown }) { yield (await this.generate(input)).answer; }
}
