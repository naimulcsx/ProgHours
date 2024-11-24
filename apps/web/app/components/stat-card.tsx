import { Card, Text } from '@mantine/core';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card withBorder={true} className="!bg-white p-4 shadow-none">
      <div className="flex items-center gap-4">
        <div className="bg-primary-50 text-prrimary-500 flex h-12 w-12 items-center justify-center rounded-lg">
          {icon}
        </div>
        <div>
          <Text size="sm" c="dimmed">
            {label}
          </Text>
          <Text size="xl" fw={500}>
            {value}
          </Text>
        </div>
      </div>
    </Card>
  );
}
