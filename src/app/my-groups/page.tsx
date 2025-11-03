'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MyGroupsListScreen } from '@/domains/group/components/MyGroupsListScreen';
import { ResponsiveLayout } from '@/shared/layout';

export default function MyGroupsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filter = searchParams.get('filter') as 'created' | 'joined' | null;
  const initialFilter = filter || 'created';

  const handleBack = () => {
    router.back();
  };

  const handleGroupClick = (groupId: string, isOwner?: boolean) => {
    router.push(`/groups/${groupId}`);
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showBottomNav: true,
      }}
      webLayoutProps={{
        maxWidth: 'wide',
      }}
      mobileContent={
        <MyGroupsListScreen
          onBack={handleBack}
          onGroupClick={handleGroupClick}
          initialFilter={initialFilter}
        />
      }
      webContent={
        <MyGroupsListScreen
          onBack={handleBack}
          onGroupClick={handleGroupClick}
          initialFilter={initialFilter}
        />
      }
    />
  );
}
