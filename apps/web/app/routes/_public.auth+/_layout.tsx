import { LoaderFunctionArgs } from '@remix-run/node';
import { Outlet, redirect } from '@remix-run/react';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  if (new URL(request.url).pathname === '/auth') {
    return redirect('/auth/sign-in');
  }
  return null;
};

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md py-12">
        <Outlet />
      </div>
    </div>
  );
}
