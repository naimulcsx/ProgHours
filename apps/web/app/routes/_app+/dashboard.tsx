import { Button } from '@mantine/core';
import { ActionFunctionArgs } from '@remix-run/node';
import { Form } from '@remix-run/react';

import { authenticator } from '~/services/auth.server';

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: '/auth/sign-in' });
}

export default function Dashboard() {
  return (
    <div>
      <Form method="post">
        <Button type="submit">Logout</Button>
      </Form>
    </div>
  );
}
