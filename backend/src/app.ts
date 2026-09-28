import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { env } from './config/env.js';
import { healthRoutes } from './routes/health.routes.js';
import { aiRoutes } from './routes/ai.routes.js';
export function buildApp() { const app = Fastify({ logger: { redact: ['req.headers.authorization', 'req.headers.cookie'] }, requestTimeout: env.REQUEST_TIMEOUT_MS, genReqId: () => crypto.randomUUID() }); app.register(cors, { origin: true }); app.register(rateLimit, { max: env.AI_RATE_LIMIT_MAX, timeWindow: env.AI_RATE_LIMIT_WINDOW_MS }); app.register(healthRoutes); app.register(aiRoutes); app.setErrorHandler((error, request, reply) => { const typedError = error as { statusCode?: number }; request.log.error({ err: error, requestId: request.id }, 'request failed'); const statusCode = typeof typedError.statusCode === 'number' && typedError.statusCode >= 400 ? typedError.statusCode : 500; void reply.code(statusCode).send({ error: statusCode === 429 ? 'Rate limit exceeded.' : 'Request could not be completed.', requestId: request.id }); }); return app; }
