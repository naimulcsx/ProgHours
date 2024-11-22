import { Button, Group, Pagination } from '@mantine/core';
import { LoaderFunctionArgs, MetaFunction, redirect } from '@remix-run/node';
import { useLoaderData, useNavigate } from '@remix-run/react';
import { desc, eq, sql } from 'drizzle-orm';
import { ArrowLeft02Icon, ArrowRight02Icon } from 'hugeicons-react';

import { AppBreadcrumbs } from '~/components/app-breadcrumbs';
import { PageHeader } from '~/components/page-header';
import { db } from '~/database';
import { submissions } from '~/database/schema';
import { authenticator } from '~/services/auth.server';

import { SubmissionsTimeline } from './_components/submissions-timeline';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'Submissions',
    },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request);
  const url = new URL(request.url);
  const dateParam = url.searchParams.get('date');

  // Get all unique solvedAt dates ordered by most recent
  const [{ dates }] = await db
    .select({
      dates: sql<Date[]>`array_agg(distinct solved_at order by solved_at desc)`,
    })
    .from(submissions)
    .where(eq(submissions.userId, user!.sub));

  // If no date provided, redirect to most recent date
  if (!dateParam) {
    const mostRecentDate = new Date(dates[0]).toISOString().split('T')[0];
    throw redirect(`/app/submissions?date=${mostRecentDate}`);
  }

  const currentDateIndex = dates.findIndex(
    (d) => new Date(d).toISOString().split('T')[0] === dateParam,
  );

  // If invalid date, redirect to most recent
  if (currentDateIndex === -1) {
    const mostRecentDate = new Date(dates[0]).toISOString().split('T')[0];
    throw redirect(`/app/submissions?date=${mostRecentDate}`);
  }

  // Get submissions for the current date
  const data = await db.query.submissions.findMany({
    where: sql`${submissions.userId} = ${user!.sub} AND date(${submissions.solvedAt}) = date(${dates[currentDateIndex]})`,
    with: {
      problem: {
        columns: {
          createdAt: false,
          updatedAt: false,
          metadata: false,
        },
        with: {
          problemTags: {
            columns: {
              problemId: false,
              tagId: false,
            },
            with: {
              tag: true,
            },
          },
        },
      },
    },
    orderBy: [desc(submissions.solvedAt)],
  });

  return {
    submissions: data,
    totalDates: dates.length,
    currentDateIndex,
    dates: dates.map((d) => new Date(d).toISOString().split('T')[0]),
  };
};

export default function Submissions() {
  const navigate = useNavigate();
  const { totalDates, currentDateIndex, dates } =
    useLoaderData<typeof loader>();

  const handleDateChange = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'prev' ? currentDateIndex + 1 : currentDateIndex - 1;
    if (newIndex >= 0 && newIndex < dates.length) {
      navigate(`/app/submissions?date=${dates[newIndex]}`);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader title="My Submissions" description={<AppBreadcrumbs />}>
        Submissions
      </PageHeader>

      <SubmissionsTimeline />

      <Group justify="start" mt="lg" ml={60}>
        <Button
          variant="outline"
          disabled={currentDateIndex === dates.length - 1}
          onClick={() => handleDateChange('prev')}
          leftSection={<ArrowLeft02Icon />}
        >
          Previous Day
        </Button>
        <Button
          variant="outline"
          disabled={currentDateIndex === 0}
          onClick={() => handleDateChange('next')}
          rightSection={<ArrowRight02Icon />}
        >
          Next Day
        </Button>
      </Group>
    </div>
  );
}
