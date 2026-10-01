import { performance } from 'node:perf_hooks';
import { MockAIProvider } from '../src/ai/providers/mock.provider.js';

const concurrency = Number(process.argv[2] ?? 25);
const durationMs = Number(process.argv[3] ?? 2000);
const provider = new MockAIProvider();
const started = performance.now(); let completed = 0; let errors = 0; const latencies: number[] = [];
async function request() { const start = performance.now(); try { await provider.parseIntent('load test: latest Hino order'); } catch { errors++; } finally { latencies.push(performance.now() - start); completed++; } }
while (performance.now() - started < durationMs) await Promise.all(Array.from({ length: concurrency }, request));
latencies.sort((a, b) => a - b); const percentile = (p: number) => latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * p))] ?? 0;
console.log(JSON.stringify({ mode: 'mock-provider-direct', concurrency, durationMs, completed, errors, errorRate: completed ? errors / completed : 0, p50Ms: percentile(0.5), p95Ms: percentile(0.95), p99Ms: percentile(0.99), note: 'Bypasses HTTP rate limiter and SQL Server; not a database load test.' }, null, 2));
