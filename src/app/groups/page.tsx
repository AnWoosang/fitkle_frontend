'use client';

import { useRouter } from 'next/navigation';
import { GroupsScreen } from '@/domains/group';
import { ResponsiveLayout } from '@/shared/layout';

export default function GroupsPage() {
  const router = useRouter();

  const handleGroupClick = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showLogo: true,
        stickyHeader: true,
      }}
      webLayoutProps={{
        maxWidth: 'wide',
      }}
      mobileContent={
        <GroupsScreen
          onGroupClick={handleGroupClick}
        />
      }
      webContent={
        <GroupsScreen
          onGroupClick={handleGroupClick}
        />
      }
    />
  );
}
