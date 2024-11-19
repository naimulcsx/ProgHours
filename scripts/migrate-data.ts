/**
 * Data Migration Script
 *
 * This script handles the migration of user data from an old database schema to the new schema.
 * It performs the following operations: Connects to the PostgreSQL database, retrieves all users
 * from the old schema, transforms and inserts the data into the new schema, and handles errors
 * and cleanup.
 *
 * Author: Naimul Haque
 */
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { join } from 'path';
import postgres from 'postgres';

import { users } from '../apps/web/app/database/schema';

config({ path: join(__dirname, '../apps/web/.env') });

interface UserMetadata {
  cgpa: number;
  batch: number;
  section: string;
  department: string;
}

interface User {
  id: string;
  full_name: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  role: 'REGULAR';
  last_seen: string;
  created_at: string;
  updated_at: string;
  metadata: UserMetadata;
  institutionId: string | null;
}

/**
 * Migrates user data from the old database schema to the new schema.
 * Connects to the database, retrieves all users from the old schema,
 * and inserts them into the new users table with the updated structure.
 */
async function main() {
  const oldDbClient = postgres(
    'postgres://postgres:postgres@localhost:5432/proghours',
  );

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not found in environment variables');
  }

  const newDbClient = postgres(process.env.DATABASE_URL);
  const db = drizzle(newDbClient);

  try {
    const oldUsers = await oldDbClient<User[]>`
      SELECT * FROM users
    `;

    console.log('Found records to migrate:', oldUsers.length);

    for (const user of oldUsers) {
      const [firstName, ...lastNameParts] = user.full_name.split(' ');

      await db.insert(users).values({
        firstName,
        lastName: lastNameParts.join(' '),
        email: user.email,
        username: user.username,
        password: user.password,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
      });
    }

    console.log('Successfully migrated all users');
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    await Promise.all([oldDbClient.end(), newDbClient.end()]);
  }
}

// Execute the migration script
main().catch((error) => {
  console.error('Fatal error during migration:', error);
  process.exit(1);
});
