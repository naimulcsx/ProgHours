import { AppBreadcrumbs } from '~/components/app-breadcrumbs';
import { PageHeader } from '~/components/page-header';

export default function Submissions() {
  return (
    <PageHeader title="My Submissions" description={<AppBreadcrumbs />}>
      Submissions
    </PageHeader>
  );
}
