import 'dotenv/config';
import * as z from 'zod';

const environmentSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().min(1),
});

const getEnv = () => environmentSchema.parse(process.env);

export { getEnv };
