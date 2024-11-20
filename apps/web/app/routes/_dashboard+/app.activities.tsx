import { AppBreadcrumbs } from '~/components/app-breadcrumbs';
import { PageHeader } from '~/components/page-header';

export default function Activities() {
  return (
    <PageHeader title="Activities" description={<AppBreadcrumbs />}>
      Activities
    </PageHeader>
  );
}
