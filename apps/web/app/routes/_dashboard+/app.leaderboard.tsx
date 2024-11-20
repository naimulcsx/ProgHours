import { AppBreadcrumbs } from '~/components/app-breadcrumbs';
import { PageHeader } from '~/components/page-header';

export default function Leaderboard() {
  return (
    <PageHeader title="Leaderboard" description={<AppBreadcrumbs />}>
      Leaderboard
    </PageHeader>
  );
}
