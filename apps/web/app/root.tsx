import {
  Button,
  ColorSchemeScript,
  MantineProvider,
  Text,
  Title,
} from '@mantine/core';
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from '@remix-run/react';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

import { useEffect } from 'react';

import './styles/style.css';
import { shadcnCssVariableResolver, shadcnTheme } from './styles/theme';

NProgress.configure({
  showSpinner: false,
});

export function Layout({ children }: { children: React.ReactNode }) {
  const transition = useNavigation();

  useEffect(() => {
    // when the state is idle then we can to complete the progress bar
    if (transition.state === 'idle') NProgress.done();
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    else NProgress.start();
  }, [transition.state]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Play:wght@400;700&family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider
          theme={shadcnTheme}
          cssVariablesResolver={shadcnCssVariableResolver}
        >
          {children}
        </MantineProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  return (
    <Layout>
      <div className="flex min-h-screen flex-col items-center justify-center text-center">
        <Title order={1} className="mb-4">
          Something went wrong
        </Title>
        <Text size="lg" c="dimmed" className="mb-6">
          We apologize for the inconvenience. Please try again later.
        </Text>
        <Button component={Link} to="/" variant="light" size="md">
          Return Home
        </Button>
      </div>
    </Layout>
  );
}
