/**
 * Data Migration Script
 *
 * This script handles the migration of data from old database schema to the new schema.
 * It migrates users, problems, tags, problem_tags and submissions tables with batch processing.
 *
 * Author: Naimul Haque
 */
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/postgres-js';
import { join } from 'path';
import postgres from 'postgres';

import {
  problemTags,
  problems,
  submissions,
  tags,
  users,
} from '../apps/web/app/database/schema';

config({ path: join(__dirname, '../apps/web/.env') });

const BATCH_SIZE = 100;

type CamelToSnake<T extends string> = T extends `${infer First}${infer Rest}`
  ? `${First extends Capitalize<First> ? '_' : ''}${Lowercase<First>}${CamelToSnake<Rest>}`
  : T;

type ConvertKeysToSnakeCase<T> = {
  [K in keyof T as CamelToSnake<string & K>]: T[K];
};

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
  institutionId: string | null;
  metadata: {
    cgpa: number;
    batch: number;
    section: string;
    department: string;
  };
}

async function migrateUsers(
  oldDbClient: postgres.Sql,
  db: ReturnType<typeof drizzle>,
) {
  const userIdMap: Record<string, string> = {};
  const oldUsers = await oldDbClient<User[]>`SELECT * FROM users`;
  console.log('Found users to migrate:', oldUsers.length);

  for (let i = 0; i < oldUsers.length; i += BATCH_SIZE) {
    const batch = oldUsers.slice(i, i + BATCH_SIZE);
    const userValues = batch.map((user) => {
      const [firstName, ...lastNameParts] = user.full_name.split(' ');
      return {
        firstName,
        lastName: lastNameParts.join(' '),
        email: user.email,
        username: user.username,
        password: user.password,
        phone: user.phone,
        createdAt: new Date(user.created_at),
        updatedAt: new Date(user.updated_at),
        metadata: user.metadata,
      };
    });

    const newUsers = await db
      .insert(users)
      .values(userValues)
      .returning({ id: users.id });

    newUsers.forEach((newUser: { id: string }, index: number) => {
      userIdMap[batch[index].id] = newUser.id;
    });

    console.log(
      `Migrated batch ${i / BATCH_SIZE + 1} of ${Math.ceil(oldUsers.length / BATCH_SIZE)} users`,
    );
  }

  console.log('Successfully migrated all users');
  return userIdMap;
}

async function migrateProblems(
  oldDbClient: postgres.Sql,
  db: ReturnType<typeof drizzle>,
) {
  const problemIdMap: Record<string, string> = {};
  const oldProblems = await oldDbClient<
    Array<ConvertKeysToSnakeCase<typeof problems.$inferSelect>>
  >`SELECT * FROM problems`;
  console.log('Found problems to migrate:', oldProblems.length);
  for (let i = 0; i < oldProblems.length; i += BATCH_SIZE) {
    const batch = oldProblems.slice(i, i + BATCH_SIZE);
    const newProblems = await db
      .insert(problems)
      .values(batch.map(({ id, ...rest }) => rest))
      .returning({ id: problems.id });
    newProblems.forEach((newProblem: { id: string }, index: number) => {
      problemIdMap[batch[index].id] = newProblem.id;
    });
    console.log(
      `Migrated batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
        oldProblems.length / BATCH_SIZE,
      )} problems`,
    );
  }
  console.log('Successfully migrated all problems');
  return problemIdMap;
}

async function migrateTags(
  oldDbClient: postgres.Sql,
  db: ReturnType<typeof drizzle>,
) {
  const tagIdMap: Record<string, string> = {};
  const oldTags = await oldDbClient<
    Array<ConvertKeysToSnakeCase<typeof tags.$inferSelect>>
  >`SELECT * FROM tags`;
  console.log('Found tags to migrate:', oldTags.length);

  for (let i = 0; i < oldTags.length; i += BATCH_SIZE) {
    const batch = oldTags.slice(i, i + BATCH_SIZE);
    const newTags = await db
      .insert(tags)
      .values(batch.map(({ id, ...rest }) => rest))
      .returning({ id: tags.id });
    newTags.forEach((newTag: { id: string }, index: number) => {
      tagIdMap[batch[index].id] = newTag.id;
    });
    console.log(
      `Migrated batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
        oldTags.length / BATCH_SIZE,
      )} tags`,
    );
  }
  console.log('Successfully migrated all tags');
  return tagIdMap;
}

async function migrateProblemTags(
  oldDbClient: postgres.Sql,
  db: ReturnType<typeof drizzle>,
  problemIdMap: Record<string, string>,
  tagIdMap: Record<string, string>,
) {
  const oldProblemTags = await oldDbClient<
    Array<ConvertKeysToSnakeCase<typeof problemTags.$inferSelect>>
  >`SELECT * FROM problem_tags`;
  console.log('Found problem_tags to migrate:', oldProblemTags.length);

  for (let i = 0; i < oldProblemTags.length; i += BATCH_SIZE) {
    const batch = oldProblemTags.slice(i, i + BATCH_SIZE);
    const problemTagValues = batch.map((pt) => {
      if (!problemIdMap[pt.problem_id]) {
        console.error(`Missing problem mapping for ID: ${pt.problem_id}`);
      }
      if (!tagIdMap[pt.tag_id]) {
        console.error(`Missing tag mapping for ID: ${pt.tag_id}`);
      }
      return {
        problemId: problemIdMap[pt.problem_id],
        tagId: tagIdMap[pt.tag_id],
      };
    });

    const validProblemTags = problemTagValues.filter(
      (pt) => pt.problemId && pt.tagId,
    );

    if (validProblemTags.length) {
      await db.insert(problemTags).values(validProblemTags);
    }

    console.log(
      `Migrated batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
        oldProblemTags.length / BATCH_SIZE,
      )} problem_tags`,
    );
  }
  console.log('Successfully migrated all problem_tags');
}

async function migrateSubmissions(
  oldDbClient: postgres.Sql,
  db: ReturnType<typeof drizzle>,
  userIdMap: Record<string, string>,
  problemIdMap: Record<string, string>,
) {
  const oldSubmissions = await oldDbClient<
    Array<ConvertKeysToSnakeCase<typeof submissions.$inferSelect>>
  >`SELECT * FROM submissions`;
  console.log('Found submissions to migrate:', oldSubmissions.length);

  for (let i = 0; i < oldSubmissions.length; i += BATCH_SIZE) {
    const batch = oldSubmissions.slice(i, i + BATCH_SIZE);
    const submissionValues = batch.map(({ id, ...sub }) => ({
      ...sub,
      userId: userIdMap[sub.user_id],
      problemId: problemIdMap[sub.problem_id],
    }));
    await db.insert(submissions).values(submissionValues);
    console.log(
      `Migrated batch ${i / BATCH_SIZE + 1} of ${Math.ceil(
        oldSubmissions.length / BATCH_SIZE,
      )} submissions`,
    );
  }
  console.log('Successfully migrated all submissions');
}

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
    const userIdMap = await migrateUsers(oldDbClient, db);
    const problemIdMap = await migrateProblems(oldDbClient, db);
    const tagIdMap = await migrateTags(oldDbClient, db);

    await migrateProblemTags(oldDbClient, db, problemIdMap, tagIdMap);
    await migrateSubmissions(oldDbClient, db, userIdMap, problemIdMap);

    console.log('Successfully completed full migration');
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
