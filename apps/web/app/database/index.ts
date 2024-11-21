import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

import { getEnv } from '../env.server';
import { schema } from './schema';

const env = getEnv();
const client = postgres(env.DATABASE_URL);
export const db = drizzle({ client, schema });
