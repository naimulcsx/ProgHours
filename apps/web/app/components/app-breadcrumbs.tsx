import { Anchor, Breadcrumbs } from '@mantine/core';
import { useLocation } from '@remix-run/react';

import { Fragment } from 'react';

const unslugify = (slug: string) => slug.replace(/-/g, ' ');

export function AppBreadcrumbs(props: {
  values?: Record<string, string>;
  maxDepth?: number;
}) {
  const pathName = useLocation().pathname;
  const splitPath = pathName.split('/').filter(Boolean);
  const values = props.values ?? {};
  const maxDepth = props.maxDepth ?? 6;

  const showEllipsis = splitPath.length > maxDepth;

  const visiblePaths = showEllipsis
    ? ([splitPath[0], ...splitPath.slice(-maxDepth + 1)] as string[])
    : splitPath;

  const items = visiblePaths.map((path, index) => {
    const label = path in values ? values[path] : unslugify(path);

    return (
      <Fragment key={index}>
        {index < visiblePaths.length - 1 ? (
          <Anchor
            underline="never"
            href={
              '/' + splitPath.slice(0, splitPath.indexOf(path) + 1).join('/')
            }
            className="text-sm capitalize"
          >
            {label}
          </Anchor>
        ) : (
          <span className="text-sm capitalize">{label}</span>
        )}

        {index === 0 && showEllipsis && <span>...</span>}
      </Fragment>
    );
  });

  return (
    <Breadcrumbs
      separator="/"
      separatorMargin="xs"
      classNames={{
        separator: 'text-gray-400',
      }}
    >
      {items}
    </Breadcrumbs>
  );
}
