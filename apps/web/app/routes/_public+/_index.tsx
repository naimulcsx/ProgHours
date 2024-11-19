import { Button, Container, Text, Title } from '@mantine/core';
import { Link } from '@remix-run/react';
import { ArrowDownDoubleIcon, ArrowRight02Icon } from 'hugeicons-react';

export default function Index() {
  return (
    <Container size="xl" className="py-20">
      <div className="flex flex-col items-center justify-center text-center">
        <Title order={1} className="font-play mb-4 text-4xl font-bold">
          Code. Compete. Conquer!
        </Title>
        <Text size="lg" className="mb-8 max-w-2xl" c="dimmed">
          Track your progress with comprehensive analytics on your
          problem-solving journey. Climb the leaderboard with every problem you
          solve.
        </Text>
        <div className="flex items-center gap-4">
          <Button
            size="md"
            component={Link}
            to="#features"
            variant="light"
            rightSection={<ArrowDownDoubleIcon size={20} />}
          >
            Features
          </Button>
          <Button
            size="md"
            component={Link}
            to="/waitlist"
            rightSection={<ArrowRight02Icon size={20} />}
          >
            Join Waitlist
          </Button>
        </div>
      </div>
    </Container>
  );
}
