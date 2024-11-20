import { AppBreadcrumbs } from '~/components/app-breadcrumbs';
import { PageHeader } from '~/components/page-header';

export default function Dashboard() {
  return (
    <PageHeader title="Overview" description={<AppBreadcrumbs />}>
      Overview
    </PageHeader>
  );
}
