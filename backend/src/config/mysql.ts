import mysql, { Pool } from 'mysql2/promise';
import { env } from './env.js';
let pool: Pool | undefined;
export function getMysqlPool() { if (!env.MYSQL_HOST || !env.MYSQL_USER) throw new Error('MySQL is not configured'); pool ??= mysql.createPool({ host: env.MYSQL_HOST, port: env.MYSQL_PORT, database: env.MYSQL_DATABASE, user: env.MYSQL_USER, password: env.MYSQL_PASSWORD, connectionLimit: env.MYSQL_POOL_MAX, waitForConnections: true, queueLimit: 0, connectTimeout: env.MYSQL_QUERY_TIMEOUT_MS }); return pool; }
export async function closeMysql() { if (pool) { await pool.end(); pool = undefined; } }
export async function checkMysql() { try { await getMysqlPool().query('SELECT 1 AS ok'); return 'connected' as const; } catch { return 'unavailable' as const; } }
export const checkMySql = checkMysql;
export const closeMySql = closeMysql;
export const getMySqlPool = getMysqlPool;
