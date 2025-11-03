'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MyGroupsListScreen } from '@/domains/group/components/MyGroupsListScreen';
import { ResponsiveLayout } from '@/shared/layout';

function MyGroupsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filter = searchParams.get('filter') as 'created' | 'joined' | null;
  const initialFilter = filter || 'created';

  const handleBack = () => {
    router.back();
  };

  const handleGroupClick = (groupId: string) => {
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

export default function MyGroupsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyGroupsContent />
    </Suspense>
  );
}
