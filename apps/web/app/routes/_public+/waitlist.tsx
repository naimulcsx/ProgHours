import { Anchor, Button, Select, Text, TextInput, Title } from '@mantine/core';
import type { MetaFunction } from '@remix-run/node';
import { Form } from '@remix-run/react';
import { Briefcase04Icon, Mail01Icon, UserIcon } from 'hugeicons-react';

export const meta: MetaFunction = () => {
  return [
    { title: 'Join the Waitlist' },
    {
      name: 'description',
      content: 'Join the waitlist for early access to our platform',
    },
  ];
};

export default function Waitlist() {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md py-12">
        <div className="mb-8">
          <Title order={2}>Be the First to Experience</Title>
          <Text c="dimmed" size="lg" className="mt-2">
            Join our exclusive waitlist and get early access to the platform
          </Text>
        </div>

        <Form method="post" className="space-y-4">
          <TextInput
            name="name"
            placeholder="Enter your full name"
            leftSection={<UserIcon size={16} />}
          />

          <TextInput
            name="email"
            type="email"
            placeholder="Enter your email"
            leftSection={<Mail01Icon size={16} />}
          />

          <Select
            name="occupation"
            placeholder="What best describes you?"
            leftSection={<Briefcase04Icon size={16} />}
            data={[
              { value: 'developer', label: 'Software Developer' },
              { value: 'student', label: 'Student' },
              { value: 'designer', label: 'Designer' },
              { value: 'product_manager', label: 'Product Manager' },
              { value: 'other', label: 'Other' },
            ]}
          />

          <Text size="sm" c="dimmed">
            By joining the waitlist, you agree to our{' '}
            <Anchor href="/terms" size="sm">
              Terms and Conditions
            </Anchor>{' '}
            and{' '}
            <Anchor href="/privacy" size="sm">
              Privacy Policy
            </Anchor>
          </Text>

          <Button fullWidth type="submit" size="md">
            Join the Waitlist
          </Button>
        </Form>
      </div>
    </div>
  );
}
