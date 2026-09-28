import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: new URL('../../../.env', import.meta.url) });

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'), PORT: z.coerce.number().int().positive().default(4000), HOST: z.string().default('0.0.0.0'), REQUEST_TIMEOUT_MS: z.coerce.number().positive().default(30000), DB_MAX_ROWS: z.coerce.number().int().positive().max(50).default(20),
  SQLSERVER_HOST: z.string().default(''), SQLSERVER_PORT: z.coerce.number().positive().default(1433), SQLSERVER_DATABASE: z.string().default('BMC'), SQLSERVER_USER: z.string().default(''), SQLSERVER_PASSWORD: z.string().default(''), SQLSERVER_POOL_MIN: z.coerce.number().nonnegative().default(2), SQLSERVER_POOL_MAX: z.coerce.number().positive().default(15), SQLSERVER_QUERY_TIMEOUT_MS: z.coerce.number().positive().default(10000),
  MYSQL_HOST: z.string().default(''), MYSQL_PORT: z.coerce.number().positive().default(3306), MYSQL_DATABASE: z.string().default('office'), MYSQL_USER: z.string().default(''), MYSQL_PASSWORD: z.string().default(''), MYSQL_POOL_MAX: z.coerce.number().positive().default(15), MYSQL_QUERY_TIMEOUT_MS: z.coerce.number().positive().default(10000),
  AI_PROVIDER: z.string().default('mock'), AI_API_KEY: z.string().default(''), AI_MODEL: z.string().default(''), AI_RATE_LIMIT_MAX: z.coerce.number().positive().default(60), AI_RATE_LIMIT_WINDOW_MS: z.coerce.number().positive().default(60000), REDIS_URL: z.string().default('')
});
export const env = schema.parse(process.env);
