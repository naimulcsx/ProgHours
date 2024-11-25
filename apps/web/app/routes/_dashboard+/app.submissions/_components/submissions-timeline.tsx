import {
  Anchor,
  Badge,
  Button,
  Card,
  Group,
  Indicator,
  Stack,
  Text,
  Timeline,
} from '@mantine/core';
import { Calendar } from '@mantine/dates';
import { modals } from '@mantine/modals';
import { useLoaderData, useNavigate } from '@remix-run/react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { Calendar01Icon } from 'hugeicons-react';

import { VerifiedBadgeIcon } from '~/assets/verified-badge-icon';

import { loader } from '../route';
import { OJIcon } from './oj-icon';
import { SubmissionsModal } from './submissions-modal';

dayjs.extend(utc);

export function SubmissionsTimeline() {
  const navigate = useNavigate();
  const { submissions, dates, currentDateIndex } =
    useLoaderData<typeof loader>();

  const groupedSubmissions = submissions.reduce(
    (groups, submission) => {
      const date = new Date(submission.solvedAt!).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(submission);
      return groups;
    },
    {} as Record<string, (typeof submissions)[number][]>,
  );

  const statusColors = {
    AC: 'bg-green-100 text-green-900 font-semibold',
    PS: 'bg-yellow-100 text-yellow-900 font-semibold',
    WA: 'bg-red-100 text-red-900 font-semibold',
    TLE: 'bg-orange-100 text-orange-900 font-semibold',
    MLE: 'bg-purple-100 text-purple-900 font-semibold',
    RE: 'bg-pink-100 text-pink-900 font-semibold',
    CE: 'bg-gray-100 text-gray-900 font-semibold',
    SK: 'bg-blue-100 text-blue-900 font-semibold',
    HCK: 'bg-red-100 text-red-900 font-semibold',
    OTH: 'bg-gray-100 text-gray-900 font-semibold',
  };

  const handleOpenSubmissionListModal = (
    submission: Awaited<ReturnType<typeof loader>>['submissions'][number],
  ) => {
    modals.open({
      size: 'lg',
      title: `Submissions for ${submission.problem.pid}`,
      children: <SubmissionsModal submission={submission} />,
    });
  };

  return (
    <div className="flex">
      <div className="flex-1">
        <Timeline
          active={-1}
          bulletSize={40}
          lineWidth={2}
          classNames={{
            itemBullet: 'bg-gray-100 text-primary-800 border-0',
          }}
          styles={{
            item: {
              '--item-border-color': 'var(--mantine-color-default-border)',
            },
          }}
        >
          {Object.entries(groupedSubmissions)
            .sort(
              ([dateA], [dateB]) =>
                new Date(dateB).getTime() - new Date(dateA).getTime(),
            )
            .map(([date, daySubmissions]) => (
              <Timeline.Item
                key={date}
                bullet={
                  <Calendar01Icon className="h-5 w-5" strokeWidth={1.75} />
                }
                title={
                  <Group className="relative top-1">
                    <Text fw={600} c="gray.9">
                      {dayjs(date).format('MMM DD, YYYY')}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {daySubmissions.length} submission
                      {daySubmissions.length !== 1 ? 's' : ''}
                    </Text>
                  </Group>
                }
              >
                <Stack
                  gap="md"
                  mt="sm"
                  p="lg"
                  className="rounded-sm bg-gray-100"
                >
                  {daySubmissions
                    .sort(
                      (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime(),
                    )
                    .map((submission) => {
                      return (
                        <Card
                          key={submission.id}
                          withBorder={false}
                          className={`!rounded-none border-l-4 !bg-white shadow-none transition-shadow duration-300 hover:shadow-sm ${statusColors[submission.verdict!]}`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div>
                                <div className="flex items-center gap-3">
                                  <Text
                                    size="lg"
                                    fw={500}
                                    className="flex items-center gap-2"
                                  >
                                    <Anchor
                                      c="blue"
                                      href={submission.problem.url}
                                      target="_blank"
                                    >
                                      {submission.problem.pid}
                                    </Anchor>
                                    <span>-</span>
                                    <span>{submission.problem.name}</span>
                                  </Text>
                                  {submission.isVerified && (
                                    <Badge
                                      h={20}
                                      size="xs"
                                      className="rounded-sm bg-blue-50 px-2 py-0.5 font-medium text-blue-900"
                                      rightSection={
                                        <VerifiedBadgeIcon className="h-3 w-3 text-blue-500" />
                                      }
                                    >
                                      <span>Verified</span>
                                    </Badge>
                                  )}
                                </div>
                                <Group gap="xs" className="mt-2">
                                  <OJIcon
                                    pid={submission.problem.pid}
                                    className="h-6 w-6 rounded-sm border p-0.5"
                                  />
                                  <Badge
                                    className={
                                      statusColors[submission.verdict!]
                                    }
                                  >
                                    {submission.verdict}
                                  </Badge>
                                  {submission.problem.problemTags.map(
                                    ({ tag }) => (
                                      <Badge
                                        key={tag.id}
                                        size="sm"
                                        fw={600}
                                        classNames={{
                                          root: '!bg-primary-100 !text-primary-800',
                                        }}
                                      >
                                        {tag.name}
                                      </Badge>
                                    ),
                                  )}
                                </Group>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {submission.metadata?.submissions &&
                                submission.metadata?.submissions?.length >
                                  0 && (
                                  <Button
                                    size="xs"
                                    variant="outline"
                                    onClick={() =>
                                      handleOpenSubmissionListModal(submission)
                                    }
                                  >
                                    View Submissions
                                  </Button>
                                )}
                              <Button size="xs" variant="outline">
                                Edit
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                </Stack>
              </Timeline.Item>
            ))}
        </Timeline>
      </div>
      <div className="shrink-0 basis-64 px-14 pt-8">
        <Calendar
          classNames={{
            day: 'data-[selected=true]:!bg-primary-100 data-[selected=true]:!text-primary-900 data-[selected=true]:!font-medium',
          }}
          defaultDate={dayjs.utc(dates[currentDateIndex]).toDate()}
          maxDate={new Date()}
          getDayProps={(date) => {
            const disabled = !dates.includes(dayjs(date).format('YYYY-MM-DD'));
            return {
              disabled,
              selected:
                dayjs(date).format('YYYY-MM-DD') === dates[currentDateIndex],
              onClick: () => {
                navigate(`?date=${dayjs(date).format('YYYY-MM-DD')}`);
              },
            };
          }}
          renderDay={(date) => {
            const day = date.getDate();
            const disabled = !dates.includes(dayjs(date).format('YYYY-MM-DD'));
            return (
              <Indicator
                size={4}
                color="green.6"
                offset={-2}
                disabled={disabled}
              >
                <div>{day}</div>
              </Indicator>
            );
          }}
        />
      </div>
    </div>
  );
}
