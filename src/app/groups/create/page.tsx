'use client';

import { useRouter } from 'next/navigation';
import { CreateGroupScreen } from '@/domains/group';
import { ResponsiveLayout } from '@/shared/layout';

export default function CreateGroupPage() {
  const router = useRouter();

  const handleCreateGroup = (groupData: any) => {
    console.log('Creating group:', groupData);
    router.push('/groups');
  };

  const handleBack = () => {
    router.back();
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
        <CreateGroupScreen
          onCreate={handleCreateGroup}
          onBack={handleBack}
        />
      }
      webContent={
        <CreateGroupScreen
          onCreate={handleCreateGroup}
          onBack={handleBack}
        />
      }
    />
  );
}
