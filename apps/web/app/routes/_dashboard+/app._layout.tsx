import {
  AppShell,
  AppShellSection,
  Avatar,
  Burger,
  Button,
  Menu,
  NavLink,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from '@remix-run/node';
import {
  Form,
  Link,
  Outlet,
  useLoaderData,
  useLocation,
} from '@remix-run/react';
import {
  Activity01Icon,
  ArrowDown01Icon,
  Award01Icon,
  CodeSquareIcon,
  Github01Icon,
  Home01Icon,
  Logout01Icon,
  Search01Icon,
  Settings01Icon,
  UserGroupIcon,
} from 'hugeicons-react';

import { AppLogo } from '~/assets/app-logo';
import { authenticator } from '~/services/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (new URL(request.url).pathname === '/app') {
    throw redirect('/app/overview');
  }
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    throw redirect('/auth/sign-in');
  }
  return {
    user,
  };
};

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: '/auth/sign-in' });
}

export default function Demo() {
  const [opened, { toggle }] = useDisclosure();
  const { user } = useLoaderData<typeof loader>();
  const location = useLocation();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 270,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header p="md" className="flex items-center justify-between">
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />

        <AppLogo className="text-primary h-7 w-7" />

        <Menu position="bottom-end" width={200}>
          <Menu.Target>
            <Button variant="subtle" className="px-2">
              <div className="flex items-center space-x-2">
                <Avatar size="sm" radius="xl">
                  {user.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </Avatar>
                <Text className="hidden sm:block">{user.fullName}</Text>
                <ArrowDown01Icon size={16} strokeWidth={1.75} />
              </div>
            </Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<Settings01Icon size={16} />}>
              Settings
            </Menu.Item>
            <Form method="post">
              <Menu.Item
                type="submit"
                leftSection={<Logout01Icon size={16} />}
                color="red"
              >
                Logout
              </Menu.Item>
            </Form>
          </Menu.Dropdown>
        </Menu>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShellSection grow>
          <Button
            className="shadow-xs mb-6"
            leftSection={<Search01Icon size={20} />}
            variant="outline"
            color="gray"
            styles={{
              root: {
                height: 40,
                width: '100%',
              },
              inner: {
                justifyContent: 'flex-start',
              },
            }}
          >
            <div className="flex w-full flex-shrink-0 justify-between">
              <Text size="sm" c="dimmed">
                Search...
              </Text>
              <Text className="ml-14" size="sm" c="dimmed">
                Ctrl + K
              </Text>
            </div>
          </Button>
          <div className="space-y-2">
            {[
              {
                to: '/app/overview',
                label: 'Overview',
                icon: <Home01Icon size={24} strokeWidth={1.75} />,
                color: 'primary',
              },
              {
                to: '/app/submissions',
                label: 'Submissions',
                icon: <CodeSquareIcon size={24} strokeWidth={1.75} />,
              },
              {
                to: '/app/groups',
                label: 'Groups',
                icon: <UserGroupIcon size={24} strokeWidth={1.75} />,
              },
              {
                to: '/app/leaderboard',
                label: 'Leaderboard',
                icon: <Award01Icon size={24} strokeWidth={1.75} />,
              },
              {
                to: '/app/activities',
                label: 'Activities',
                icon: <Activity01Icon size={24} strokeWidth={1.75} />,
              },
              {
                to: '/app/settings',
                label: 'Settings',
                icon: <Settings01Icon size={24} strokeWidth={1.75} />,
              },
            ].map(({ to, label, icon, color }) => (
              <NavLink
                key={to}
                component={Link}
                to={to}
                label={label}
                leftSection={icon}
                active={location.pathname === to}
                color={color}
              />
            ))}
          </div>
        </AppShellSection>
        <AppShellSection>
          <div className="from-primary-600 to-primary-800 relative overflow-hidden rounded-md bg-gradient-to-br p-4">
            {/* Decorative SVG circles */}
            <svg
              className="absolute right-0 top-0 opacity-10"
              width="100"
              height="100"
              viewBox="0 0 100 100"
            >
              <circle cx="80" cy="20" r="40" fill="currentColor" />
            </svg>
            <svg
              className="absolute bottom-0 left-0 opacity-10"
              width="120"
              height="120"
              viewBox="0 0 120 120"
            >
              <circle cx="20" cy="100" r="60" fill="currentColor" />
            </svg>

            <Stack gap="md" className="relative z-10">
              <Text size="sm" fw={500} c="white">
                Enjoying progHours? Support our open source journey!
              </Text>
              <Button
                component="a"
                href="https://github.com/progHours/progHours"
                target="_blank"
                rel="noopener noreferrer"
                variant="white"
                leftSection={<Github01Icon size={20} strokeWidth={1.75} />}
                size="sm"
                className="opacity-90"
              >
                Star on GitHub
              </Button>
            </Stack>
          </div>
        </AppShellSection>
      </AppShell.Navbar>

      <AppShell.Main mih="calc(100dvh - 100px)">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
