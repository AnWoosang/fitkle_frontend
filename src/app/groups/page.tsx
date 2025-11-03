'use client';

import { useRouter } from 'next/navigation';
import { GroupsScreen } from '@/domains/group';
import { ResponsiveLayout } from '@/shared/layout';

export default function GroupsPage() {
  const router = useRouter();

  const handleGroupClick = (groupId: string, isOwner: boolean = false) => {
    router.push(`/groups/${groupId}`);
  };

  const handleCreateGroup = () => {
    router.push('/groups/create');
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
          onCreateGroup={handleCreateGroup}
          onBack={() => router.push('/')}
        />
      }
      webContent={
        <GroupsScreen
          onGroupClick={handleGroupClick}
          onCreateGroup={handleCreateGroup}
          onBack={() => router.push('/')}
        />
      }
    />
  );
}
