import { AppBreadcrumbs } from '~/components/app-breadcrumbs';
import { PageHeader } from '~/components/page-header';

export default function Groups() {
  return (
    <PageHeader title="Groups" description={<AppBreadcrumbs />}>
      Groups
    </PageHeader>
  );
}
