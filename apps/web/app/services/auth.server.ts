import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { Authenticator } from 'remix-auth';
import { AuthorizationError } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import * as z from 'zod';

import { db } from '~/database';
import { users } from '~/database/schema';
import { sessionStorage } from '~/services/session.server';

export interface User {
  sub: string;
  fullName: string;
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export let authenticator = new Authenticator<User>(sessionStorage);

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const formData = {
      username: form.get('username'),
      password: form.get('password'),
    };

    // Validate form data
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      throw new AuthorizationError('Invalid username or password');
    }

    const { username, password } = result.data;

    let [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));

    if (!user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid username or password');
    }

    return {
      sub: user.id,
      fullName: `${user.firstName} ${user.lastName}`,
    };
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  'local',
);
