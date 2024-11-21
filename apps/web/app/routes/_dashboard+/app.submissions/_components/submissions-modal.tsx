import { Badge, Button, Table, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { LinkSquare01Icon } from 'hugeicons-react';

import { loader } from '../route';

export function SubmissionsModal({
  submission,
}: {
  submission: Awaited<ReturnType<typeof loader>>['submissions'][number];
}) {
  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>Submitted At</Table.Th>
          <Table.Th>Verdict</Table.Th>
          <Table.Th>Action</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {submission.metadata?.submissions?.map((sub) => (
          <Table.Tr key={sub.id}>
            <Table.Td>
              <Text fw={500} size="sm">
                #{sub.id}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" c="dimmed">
                {dayjs(sub.createdAt).format('MMM D, YYYY h:mm A')}
              </Text>
            </Table.Td>
            <Table.Td>
              <Badge size="sm" variant="light">
                {sub.verdict}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Button
                component="a"
                href={sub.url}
                target="_blank"
                rel="noopener noreferrer"
                size="xs"
                variant="transparent"
                rightSection={<LinkSquare01Icon size={14} />}
                c="gray"
              >
                View Submission
              </Button>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
