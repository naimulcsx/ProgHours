import 'dotenv/config';
import * as z from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().min(1),
  SESSION_SECRET: z.string().min(1),
  INVITE_CODES: z
    .string()
    .min(1)
    .transform((value) => value.split(',')),
});

const getEnv = () => environmentSchema.parse(process.env);

export { getEnv };
