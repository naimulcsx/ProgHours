import dayjs from 'dayjs';
import { and, count, eq, sql, sum } from 'drizzle-orm';

import { db } from '../database';
import {
  problemTags,
  problems,
  submissions,
  tags,
  users,
} from '../database/schema';

interface RangeQuery {
  type: 'range' | 'allTime';
  fromDate?: string;
  toDate?: string;
}

interface UserStatisticsQuery extends RangeQuery {
  userId: string;
}

export function calculatePoints({
  totalProblemsSolved,
  averageDifficulty,
}: {
  totalProblemsSolved: number;
  averageDifficulty: string | number;
}): number {
  // Convert averageDifficulty to number if it's a string
  const avgDiff =
    typeof averageDifficulty === 'string'
      ? parseFloat(averageDifficulty)
      : averageDifficulty;

  // Base multiplier for problems solved (linear growth)
  const problemMultiplier = 100;

  // Exponential growth factor for difficulty
  // We divide by 1000 to normalize the difficulty range (typically 800-3500)
  // and use Math.pow for exponential growth
  const difficultyFactor = Math.pow(avgDiff / 1000, 2);

  // Calculate total points
  // Problems solved grows linearly
  // Difficulty grows exponentially
  const points = totalProblemsSolved * problemMultiplier * difficultyFactor;

  // Round to 2 decimal places
  return Math.round(points * 100) / 100;
}

export async function getLeaderboard(query: RangeQuery) {
  const baseQuery = db
    .select({
      userId: users.id,
      username: users.username,
      totalSolveTime: sum(submissions.solveTime),
      totalDifficulty: sum(problems.difficulty),
      totalSolved: count(problems.id),
      totalSolvedWithDifficulty: count(
        sql<number>`CASE WHEN ${problems.difficulty} > 0 THEN 1 ELSE NULL END`,
      ),
    })
    .from(submissions)
    .leftJoin(problems, eq(submissions.problemId, problems.id))
    .leftJoin(users, eq(users.id, submissions.userId))
    .where(
      query.type === 'range'
        ? and(
            eq(submissions.verdict, 'AC'),
            sql`${submissions.solvedAt} >= TO_TIMESTAMP(${query.fromDate}, 'YYYY-MM-DD')`,
            sql`${submissions.solvedAt} <= TO_TIMESTAMP(${query.toDate}, 'YYYY-MM-DD')`,
          )
        : eq(submissions.verdict, 'AC'),
    )
    .groupBy(users.id);

  return baseQuery;
}

export async function getSubmissionStats(
  userId: string,
  query: UserStatisticsQuery,
  groupBy: 'daily' | 'weekly' | 'monthly' = 'daily',
) {
  // Get submission counts grouped by the specified interval
  const dateGrouping = {
    daily: sql<string>`DATE(${submissions.solvedAt})`,
    weekly: sql<string>`DATE_TRUNC('week', ${submissions.solvedAt} + INTERVAL '1 day') - INTERVAL '1 day'`,
    monthly: sql<string>`DATE_TRUNC('month', ${submissions.solvedAt})`,
  };

  const stats = await db
    .select({
      date: dateGrouping[groupBy],
      AC: sum(submissions.acCount),
      WA: sum(submissions.waCount),
      TLE: sum(submissions.tleCount),
    })
    .from(submissions)
    .where(
      query.type === 'range'
        ? and(
            eq(submissions.userId, userId),
            sql`${submissions.solvedAt} >= TO_TIMESTAMP(${query.fromDate}, 'YYYY-MM-DD')`,
            sql`${submissions.solvedAt} <= TO_TIMESTAMP(${query.toDate}, 'YYYY-MM-DD')`,
          )
        : eq(submissions.userId, userId),
    )
    .groupBy(dateGrouping[groupBy])
    .execute();

  // Convert to array and sort by date
  const dailySubmissions = stats
    .map((stat) => ({
      date: stat.date,
      AC: Number(stat.AC) || 0,
      WA: Number(stat.WA) || 0,
      TLE: Number(stat.TLE) || 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return dailySubmissions.map((item) => ({
    ...item,
    date: dayjs(item.date).format('DD MMM'),
  }));
}

export async function getTagStats(query: UserStatisticsQuery) {
  const tagStats = await db
    .select({
      tag: tags.name,
      solveTime: sum(submissions.solveTime),
      solveCount: count(submissions.id),
    })
    .from(submissions)
    .leftJoin(problems, eq(submissions.problemId, problems.id))
    .leftJoin(problemTags, eq(problems.id, problemTags.problemId))
    .leftJoin(tags, eq(problemTags.tagId, tags.id))
    .where(
      query.type === 'range'
        ? and(
            eq(submissions.userId, query.userId),
            eq(submissions.verdict, 'AC'),
            sql`${submissions.solvedAt} >= TO_TIMESTAMP(${query.fromDate}, 'YYYY-MM-DD')`,
            sql`${submissions.solvedAt} <= TO_TIMESTAMP(${query.toDate}, 'YYYY-MM-DD')`,
          )
        : and(
            eq(submissions.userId, query.userId),
            eq(submissions.verdict, 'AC'),
          ),
    )
    .groupBy(tags.name)
    .execute()
    .then((results) =>
      results
        .filter((result) => result.tag !== null)
        .map((result) => {
          // Create a deterministic hash of the tag name to select a consistent color
          const hash = (result.tag as string).split('').reduce((acc, char) => {
            return char.charCodeAt(0) + ((acc << 5) - acc);
          }, 0);

          const colors = [
            '#fd7f6f',
            '#7eb0d5',
            '#b2e061',
            '#bd7ebe',
            '#ffb55a',
            '#ffee65',
            '#beb9db',
            '#fdcce5',
            '#8bd3c7',
          ];
          const color = colors[Math.abs(hash) % colors.length];

          return {
            tag: result.tag as string,
            color,
            solveTime: Number(result.solveTime) || 0,
            solveCount: Number(result.solveCount) || 0,
          };
        }),
    );

  return tagStats;
}

export async function getUserStatistics(query: UserStatisticsQuery) {
  const [aggregateStats] = await db
    .select({
      totalSolveTime: sum(submissions.solveTime),
      totalProblemsSolved: count(problems.id),
      averageDifficulty: sql<number>`AVG(${problems.difficulty})`,
    })
    .from(submissions)
    .leftJoin(problems, eq(submissions.problemId, problems.id))
    .where(
      query.type === 'range'
        ? and(
            eq(submissions.userId, query.userId),
            eq(submissions.verdict, 'AC'),
            sql`${submissions.solvedAt} >= TO_TIMESTAMP(${query.fromDate}, 'YYYY-MM-DD')`,
            sql`${submissions.solvedAt} <= TO_TIMESTAMP(${query.toDate}, 'YYYY-MM-DD')`,
          )
        : and(
            eq(submissions.userId, query.userId),
            eq(submissions.verdict, 'AC'),
          ),
    )
    .execute();

  const dailySubmissions = await getSubmissionStats(
    query.userId,
    query,
    'weekly',
  );
  const stats = aggregateStats;

  const tagStats = await getTagStats(query);

  return {
    totalPoints: calculatePoints(stats),
    totalSolveTime: stats.totalSolveTime,
    totalProblemsSolved: Number(stats.totalProblemsSolved) || 0,
    averageDifficulty: stats.averageDifficulty,
    dailySubmissions,
    tagStats,
  };
}
