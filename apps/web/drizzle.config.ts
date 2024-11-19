import { defineConfig } from 'drizzle-kit';

import { getEnv } from './app/env.server';

const env = getEnv();

export default defineConfig({
  schema: './app/database/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
