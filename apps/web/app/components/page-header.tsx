import { Title } from '@mantine/core';

interface PageHeaderProps {
  children?: React.ReactNode;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col">
        {description && (
          <div className="text-sm text-gray-500">{description}</div>
        )}
        {title && (
          <Title order={3} className="font-semibold">
            {title}
          </Title>
        )}
      </div>
    </div>
  );
}
