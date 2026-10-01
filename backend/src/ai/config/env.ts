import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();
dotenv.config({ path: '../.env' });

const schema = z.object({
  GEMINI_API_KEY: z.string().default(''),
  AI_MODEL: z.string().default('gemini-2.0-flash'),
  AI_TIMEOUT_MS: z.coerce.number().positive().default(15000)
});

export const aiEnv = schema.parse(process.env);
