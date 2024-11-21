import { relations } from 'drizzle-orm';
import {
  boolean,
  date,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 25 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 100 }).notNull(),
  firstName: varchar('first_name', { length: 50 }).notNull(),
  lastName: varchar('last_name', { length: 50 }).notNull(),
  phone: varchar('phone', { length: 25 }),
  country: varchar('country', { length: 3 }), // ISO 3166-1 alpha-2 / alpha-3
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  metadata: json('metadata').default({}),
});

export const usersRelations = relations(users, ({ many }) => ({
  submissions: many(submissions),
}));

export const problems = pgTable('problems', {
  id: uuid('id').primaryKey().defaultRandom(),
  pid: varchar('pid', { length: 50 }).notNull().unique(),
  name: varchar('name', { length: 100 }).notNull(),
  url: varchar('url', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  difficulty: integer('difficulty'),
  metadata: json('metadata').default({}),
});

export const problemRelations = relations(problems, ({ many }) => ({
  submissions: many(submissions),
  problemTags: many(problemTags),
}));

export const tags = pgTable('tags', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 50 }).notNull().unique(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  problemTags: many(problemTags),
}));

export const problemTags = pgTable(
  'problem_tags',
  {
    problemId: uuid('problem_id')
      .references(() => problems.id)
      .notNull(),
    tagId: uuid('tag_id')
      .references(() => tags.id)
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.problemId, table.tagId] })],
);

export const problemTagsRelations = relations(problemTags, ({ one }) => ({
  problem: one(problems, {
    fields: [problemTags.problemId],
    references: [problems.id],
  }),
  tag: one(tags, { fields: [problemTags.tagId], references: [tags.id] }),
}));

export const verdictEnum = pgEnum('verdict', [
  'AC',
  'PS',
  'WA',
  'TLE',
  'MLE',
  'RE',
  'CE',
  'SK',
  'HCK',
  'OTH',
]);

export const submissions = pgTable('submissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  solveTime: integer('solve_time'),
  verdict: verdictEnum('verdict'),
  solvedAt: date('solved_at'),
  userId: uuid('user_id')
    .references(() => users.id)
    .notNull(),
  problemId: uuid('problem_id')
    .references(() => problems.id)
    .notNull(),
  isVerified: boolean('is_verified').default(false),
  acCount: integer('ac_count').default(0),
  psCount: integer('ps_count').default(0),
  waCount: integer('wa_count').default(0),
  tleCount: integer('tle_count').default(0),
  mleCount: integer('mle_count').default(0),
  reCount: integer('re_count').default(0),
  ceCount: integer('ce_count').default(0),
  skCount: integer('sk_count').default(0),
  hckCount: integer('hck_count').default(0),
  othCount: integer('oth_count').default(0),
  metadata: json('metadata')
    .$type<{
      submissions?: {
        id: number;
        pid: string;
        url: string;
        createdAt: string;
        verdict: (typeof verdictEnum.enumValues)[number];
      }[];
    }>()
    .default({}),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const submissionsRelations = relations(submissions, ({ one }) => ({
  user: one(users, { fields: [submissions.userId], references: [users.id] }),
  problem: one(problems, {
    fields: [submissions.problemId],
    references: [problems.id],
  }),
}));

export const schema = {
  users,
  problems,
  tags,
  problemTags,
  submissions,
  usersRelations,
  problemRelations,
  tagsRelations,
  problemTagsRelations,
  submissionsRelations,
};
