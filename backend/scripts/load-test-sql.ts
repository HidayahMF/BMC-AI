import { performance } from 'node:perf_hooks';
import sql from 'mssql';
import { closeSqlServer, getSqlServerPool } from '../src/config/sqlserver.js';

const concurrency = Number(process.argv[2] ?? 5); const durationMs = Number(process.argv[3] ?? 1000); const pool = await getSqlServerPool(); const latencies: number[] = []; let completed = 0; let errors = 0; const started = performance.now();
async function request() { const begin = performance.now(); try { const request = pool.request(); request.input('query', sql.NVarChar(100), '%Hino%'); await request.query(`SELECT TOP (5) CONVERT(varchar(50), CustId) AS code, CustomerName AS name FROM dbo.MAS_CUSTOMER WHERE CustomerName LIKE @query ORDER BY CustomerName`); } catch { errors++; } finally { completed++; latencies.push(performance.now() - begin); } }
while (performance.now() - started < durationMs) await Promise.all(Array.from({ length: concurrency }, request));
await closeSqlServer(); latencies.sort((a, b) => a - b); const percentile = (p: number) => latencies[Math.min(latencies.length - 1, Math.floor(latencies.length * p))] ?? 0; console.log(JSON.stringify({ mode: 'sqlserver-light-customer-search', concurrency, durationMs, completed, errors, errorRate: completed ? errors / completed : 0, p50Ms: percentile(0.5), p95Ms: percentile(0.95), p99Ms: percentile(0.99), note: 'Short bounded read-only test; not a production stress test.' }, null, 2));
