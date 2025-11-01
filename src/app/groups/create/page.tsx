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
        showBackButton: true,
        onBack: handleBack,
        title: 'Create Group',
      }}
      webLayoutProps={{
        maxWidth: 'default',
        title: 'Create Group',
      }}
      mobileContent={
        <CreateGroupScreen
          onSubmit={handleCreateGroup}
          onBack={handleBack}
        />
      }
      webContent={
        <CreateGroupScreen
          onSubmit={handleCreateGroup}
          onBack={handleBack}
        />
      }
    />
  );
}
