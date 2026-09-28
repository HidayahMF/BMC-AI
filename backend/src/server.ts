import { buildApp } from './app.js';
import { env } from './config/env.js';
import { closeMysql } from './config/mysql.js';
import { closeSqlServer } from './config/sqlserver.js';
import { closeRedis } from './config/redis.js';
const app = buildApp();
await app.listen({ port: env.PORT, host: env.HOST });
async function shutdown(signal: string) { app.log.info({ signal }, 'shutting down'); await app.close(); await Promise.allSettled([closeSqlServer(), closeMysql(), closeRedis()]); process.exit(0); }
process.once('SIGINT', () => void shutdown('SIGINT')); process.once('SIGTERM', () => void shutdown('SIGTERM'));
