import sql from 'mssql';
import { env } from './env.js';
let pool: sql.ConnectionPool | undefined;
export function getSqlServerPool() { if (!env.SQLSERVER_HOST || !env.SQLSERVER_USER) throw new Error('SQL Server is not configured'); if (!pool) pool = new sql.ConnectionPool({ server: env.SQLSERVER_HOST, port: env.SQLSERVER_PORT, database: env.SQLSERVER_DATABASE, user: env.SQLSERVER_USER, password: env.SQLSERVER_PASSWORD, options: { encrypt: false, trustServerCertificate: true }, pool: { min: env.SQLSERVER_POOL_MIN, max: env.SQLSERVER_POOL_MAX, idleTimeoutMillis: 30000 }, requestTimeout: env.SQLSERVER_QUERY_TIMEOUT_MS }); return pool.connect(); }
export async function closeSqlServer() { if (pool) { await pool.close(); pool = undefined; } }
export async function checkSqlServer() { try { const connection = await getSqlServerPool(); await connection.request().query('SELECT 1 AS ok'); return 'connected' as const; } catch { return 'unavailable' as const; } }
