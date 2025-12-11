'use client';

import { useRouter } from 'next/navigation';
import { GroupsScreen } from '@/domains/group';

export default function GroupsPage() {
  const router = useRouter();

  const handleGroupClick = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  return (
    <GroupsScreen onGroupClick={handleGroupClick} />
  );
}
