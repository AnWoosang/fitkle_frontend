'use client';

import { useRouter } from 'next/navigation';
import { CreateGroupScreen } from '@/domains/group';

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
    <CreateGroupScreen
      onCreate={handleCreateGroup}
      onBack={handleBack}
    />
  );
}
