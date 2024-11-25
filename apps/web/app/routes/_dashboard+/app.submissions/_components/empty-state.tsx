import { Button, Group, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from '@remix-run/react';
import {
  AlertCircleIcon,
  CheckmarkCircle01Icon,
  Clock01Icon,
  CodeCircleIcon,
  Message01Icon,
  PlusSignCircleIcon,
  Upload01Icon,
} from 'hugeicons-react';

export function EmptyState() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center">
      <div className="mx-auto w-full max-w-3xl px-4 py-8 text-center">
        <div className="rounded-lg bg-white p-8">
          <div className="flex justify-center">
            <div className="rounded-full bg-yellow-100 p-3">
              <AlertCircleIcon className="h-8 w-8 text-yellow-600" />
            </div>
          </div>

          <Title order={2} mt="md" c="gray.9">
            No Submissions Found
          </Title>

          <Text size="sm" c="dimmed" mt="xs">
            Start tracking your competitive programming journey by adding your
            first submission
          </Text>

          <div className="mt-8 grid grid-cols-2 gap-4">
            <Button
              size="md"
              fullWidth
              variant="outline"
              leftSection={<Upload01Icon />}
              onClick={() => navigate('/submissions')}
            >
              Import from Platform
            </Button>

            <Button
              size="md"
              fullWidth
              leftSection={<PlusSignCircleIcon />}
              onClick={() => navigate('/submissions')}
            >
              Add Manual Submission
            </Button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <h3 className="mb-4 text-sm font-medium text-gray-900">
              What you can track:
            </h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4">
                <Clock01Icon className="mb-2 h-6 w-6 text-yellow-500" />
                <h4 className="text-sm font-medium text-gray-900">
                  Solve time
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  Monitor your solving speed
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4">
                <CheckmarkCircle01Icon className="mb-2 h-6 w-6 text-green-500" />
                <h4 className="text-sm font-medium text-gray-900">
                  Submission status
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  Track submission results
                </p>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-gray-50 p-4">
                <Message01Icon className="mb-2 h-6 w-6 text-purple-500" />
                <h4 className="text-sm font-medium text-gray-900">
                  Personal notes
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  Keep solution notes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
