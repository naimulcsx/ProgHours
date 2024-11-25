import { NavLink } from '@mantine/core';
import { LoaderFunctionArgs, redirect } from '@remix-run/node';
import { Link, Outlet, useLoaderData, useNavigate } from '@remix-run/react';

import { AppBreadcrumbs } from '~/components/app-breadcrumbs';
import { PageHeader } from '~/components/page-header';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (pathname.match(/^\/app\/settings\/?$/)) {
    throw redirect('general');
  }

  const tabValue = pathname.split('/app/settings/')[1] || 'general';

  if (!['general', 'security', 'handles'].includes(tabValue)) {
    throw redirect('general');
  }

  return { tabValue };
};

export default function Settings() {
  const navigate = useNavigate();
  const { tabValue } = useLoaderData<typeof loader>();
  return (
    <div className="space-y-4">
      <PageHeader title="Settings" description={<AppBreadcrumbs />}>
        Settings
      </PageHeader>

      <div className="flex gap-8">
        <nav className="w-64 space-y-1">
          {[
            {
              to: 'general',
              label: 'General',
            },
            {
              to: 'security',
              label: 'Security',
            },
            {
              to: 'handles',
              label: 'Handles',
            },
          ].map(({ to, label }) => (
            <NavLink
              key={to}
              component={Link}
              to={to}
              label={label}
              active={tabValue === to}
            />
          ))}
        </nav>

        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
