import {
  Anchor,
  Button,
  Notification,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node';
import { Form, redirect, useActionData } from '@remix-run/react';
import bcrypt from 'bcryptjs';
import { eq, or } from 'drizzle-orm';
import { LockIcon, Mail01Icon, Ticket01Icon, UserIcon } from 'hugeicons-react';
import { z } from 'zod';

import { db } from '~/database';
import { users } from '~/database/schema';
import { getEnv } from '~/env.server';
import { authenticator } from '~/services/auth.server';
import { commitSession, getSession } from '~/services/session.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'Sign Up' },
    { name: 'description', content: 'Create a new account' },
  ];
};

const signUpSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  invitationCode: z.string().min(1, 'Invitation code is required'),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await authenticator.isAuthenticated(request, {
    successRedirect: '/app',
  });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const session = await getSession(request.headers.get('Cookie'));

  const formData = Object.fromEntries(await request.formData());

  const result = signUpSchema.safeParse(formData);

  if (!result.success) {
    return {
      status: 'error',
      errors: result.error.flatten().fieldErrors,
    };
  }

  const existingUsers = await db
    .select()
    .from(users)
    .where(
      or(
        eq(users.email, result.data.email),
        eq(users.username, result.data.username),
      ),
    );

  if (existingUsers.length > 0) {
    const errors: Record<string, string[]> = {};
    if (existingUsers.some((user) => user.email === result.data.email)) {
      errors.email = ['Email already taken'];
    }
    if (existingUsers.some((user) => user.username === result.data.username)) {
      errors.username = ['Username already taken'];
    }
    return {
      status: 'error',
      errors,
    };
  }

  const env = getEnv();

  if (!env.INVITE_CODES.includes(result.data.invitationCode)) {
    return {
      status: 'error',
      errors: { invitationCode: ['Invalid invitation code'] },
    };
  }

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(result.data.password, salt);

  await db.insert(users).values({
    firstName: result.data.firstName,
    lastName: result.data.lastName,
    email: result.data.email,
    username: result.data.username,
    password: hashedPassword,
  });

  session.flash('message', 'Sign up successful! You can now sign in.');

  return redirect('/auth/sign-in', {
    headers: {
      'Set-Cookie': await commitSession(session),
    },
  });
};

export default function SignUp() {
  const actionData = useActionData<typeof action>();

  return (
    <div>
      <Notification
        title="🔐 We're currently in private beta"
        withCloseButton={false}
        className="mb-6 shadow-none"
      >
        You'll need an invitation code to join. However, we plan to make the
        platform open to everyone very soon.
      </Notification>

      <div className="mb-6">
        <Title order={2}>Create a new account</Title>
        <Text c="dimmed" size="sm" className="mt-2">
          Already have an account?{' '}
          <Anchor href="/auth/sign-in" size="sm">
            Sign In
          </Anchor>
        </Text>
      </div>

      <Form method="post" className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            name="firstName"
            placeholder="Enter your first name"
            leftSection={<UserIcon size={16} />}
            error={actionData?.errors?.firstName?.[0]}
          />
          <TextInput
            name="lastName"
            placeholder="Enter your last name"
            leftSection={<UserIcon size={16} />}
            error={actionData?.errors?.lastName?.[0]}
          />
        </div>

        <TextInput
          name="email"
          type="email"
          placeholder="Enter your email"
          leftSection={<Mail01Icon size={16} />}
          error={actionData?.errors?.email?.[0]}
        />

        <TextInput
          name="username"
          placeholder="Choose a username"
          leftSection={<UserIcon size={16} />}
          error={actionData?.errors?.username?.[0]}
        />

        <TextInput
          name="password"
          type="password"
          placeholder="Create a password"
          leftSection={<LockIcon size={16} />}
          error={actionData?.errors?.password?.[0]}
        />

        <TextInput
          name="invitationCode"
          placeholder="Enter invitation code"
          withAsterisk
          leftSection={<Ticket01Icon size={16} />}
          error={actionData?.errors?.invitationCode?.[0]}
        />

        <Text size="sm">
          By signing up, you agree to our{' '}
          <Anchor href="/terms" size="sm">
            Terms and Conditions
          </Anchor>
        </Text>

        <Button fullWidth type="submit" size="md">
          Sign Up
        </Button>
      </Form>
    </div>
  );
}
