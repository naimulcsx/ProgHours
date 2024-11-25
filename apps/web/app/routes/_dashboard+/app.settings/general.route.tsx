import { Button, Card, Text } from '@mantine/core';
import { modals } from '@mantine/modals';
import { MetaFunction } from '@remix-run/node';
import { ActionFunctionArgs } from '@remix-run/node';
import { useSubmit } from '@remix-run/react';
import { eq } from 'drizzle-orm';

import { db } from '~/database';
import { submissions } from '~/database/schema';
import { authenticator } from '~/services/auth.server';

export const meta: MetaFunction = () => {
  return [
    {
      title: 'General Settings',
    },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);

  const formData = await request.formData();
  const intent = formData.get('intent');

  if (intent === 'deleteSubmissionsData') {
    await db.delete(submissions).where(eq(submissions.userId, user!.sub));
    return { success: true };
  }

  return { success: false };
}

export default function SettingsGeneral() {
  const submit = useSubmit();

  const handleDeleteSubmissions = () => {
    modals.openConfirmModal({
      title: 'Clear Submissions',
      children: (
        <Text c="dimmed" size="sm">
          Are you sure you want to delete all your submissions data?
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      onConfirm: () => {
        submit({ intent: 'deleteSubmissionsData' }, { method: 'post' });
      },
      confirmProps: {
        c: 'red.5',
        variant: 'default',
      },
    });
  };
  return (
    <Card className="space-y-4 !border-red-100 !bg-white !p-0 !shadow-none">
      <div className="p-lg flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Delete Submissions Data</h3>
          <p className="text-sm text-gray-500">
            Permanently remove your submissions data from the progHours
            platform. This action is not reversible, so please continue with
            caution.
          </p>
        </div>
      </div>

      <div className="px-lg flex justify-end bg-red-50 py-2">
        <Button variant="default" c="red.5" onClick={handleDeleteSubmissions}>
          Delete Submissions Data
        </Button>
      </div>
    </Card>
  );
}
