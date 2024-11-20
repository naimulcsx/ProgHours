import { AppBreadcrumbs } from '~/components/app-breadcrumbs';
import { PageHeader } from '~/components/page-header';

export default function Settings() {
  return (
    <PageHeader title="Settings" description={<AppBreadcrumbs />}>
      Settings
    </PageHeader>
  );
}
