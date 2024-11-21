import {
  Anchor,
  Button,
  Notification,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import {
  Form,
  json,
  redirect,
  useActionData,
  useLoaderData,
} from '@remix-run/react';
import {
  LockIcon,
  MultiplicationSignIcon,
  Tick01Icon,
  Tick02Icon,
  UserIcon,
} from 'hugeicons-react';
import { AuthorizationError } from 'remix-auth';

import { authenticator } from '~/services/auth.server';
import { commitSession, getSession } from '~/services/session.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Sign In' },
    { name: 'description', content: 'Sign in to your account' },
  ];
};

export async function action({ request }: ActionFunctionArgs) {
  try {
    return await authenticator.authenticate('local', request, {
      successRedirect: '/app',
      throwOnError: true,
    });
  } catch (error) {
    // Because redirects work by throwing a Response, you need to check if the
    // caught error is a response and return it or throw it again
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      // here the error is related to the authentication process
      return {
        status: 'error',
        message: error.message,
      };
    }
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await authenticator.isAuthenticated(request);
  const session = await getSession(request.headers.get('Cookie'));

  const message = session.get('message') as string | undefined;

  if (user) {
    throw redirect('/app');
  }

  return json(
    {
      message,
    },
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    },
  );
}

export default function SignIn() {
  const loaderData = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  const notificationTitle = loaderData.message ? 'Success' : 'Error';
  const notificationColor = loaderData.message ? 'success.6' : 'red.6';
  const message = loaderData.message ?? actionData?.message;
  const icon = loaderData.message ? (
    <Tick02Icon strokeWidth={2} />
  ) : (
    <MultiplicationSignIcon strokeWidth={2} />
  );

  return (
    <div>
      {message && (
        <Notification
          title={notificationTitle}
          color={notificationColor}
          icon={icon}
          withCloseButton={false}
          className="mb-6 px-0 shadow-none"
        >
          {message}
        </Notification>
      )}
      <div className="mb-6">
        <Title order={2}>Sign in to your account</Title>
        <Text c="dimmed" size="sm" className="mt-2">
          Don't have an account?{' '}
          <Anchor href="/auth/sign-up" size="sm">
            Sign Up
          </Anchor>
        </Text>
      </div>

      <Form method="post" className="space-y-4">
        <TextInput
          name="username"
          placeholder="Enter your Username"
          leftSection={<UserIcon size={16} />}
        />

        <TextInput
          name="password"
          type="password"
          placeholder="Enter your password"
          leftSection={<LockIcon size={16} />}
        />

        <Text size="sm">
          By signing in, you agree to our{' '}
          <Anchor href="/terms" size="sm">
            Terms and Conditions
          </Anchor>
        </Text>

        <Button fullWidth type="submit" size="md">
          Sign In
        </Button>
      </Form>
    </div>
  );
}
