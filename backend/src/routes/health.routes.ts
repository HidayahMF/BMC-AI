import type { FastifyInstance } from 'fastify';
import { checkMysql } from '../config/mysql.js';
import { checkSqlServer } from '../config/sqlserver.js';
import { redisStatus } from '../config/redis.js';
export async function healthRoutes(app: FastifyInstance) { app.get('/health', async () => ({ status: 'ok' })); app.get('/readyz', async (_request, reply) => { const [sqlServer, mysql] = await Promise.all([checkSqlServer(), checkMysql()]); const dependencies = { sqlServer, mysql, redis: redisStatus() }; const status = sqlServer === 'connected' || mysql === 'connected' ? 'ok' : 'degraded'; return reply.code(status === 'ok' ? 200 : 503).send({ status, dependencies }); }); }
