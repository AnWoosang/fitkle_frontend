'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { GroupDetailScreen } from '@/domains/group';

export default function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const handleBack = () => {
    router.push('/groups');
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleUserClick = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  const handleMessageClick = (userId: string) => {
    router.push(`/messages/${userId}`);
  };

  const handleEditGroup = () => {
    router.push(`/groups/${id}/edit`);
  };

  const handleManageMembers = () => {
    router.push(`/groups/${id}/members`);
  };

  const handleDeleteGroup = () => {
    if (confirm('정말 이 그룹을 삭제하시겠습니까?')) {
      console.log('Deleting group:', id);
      router.push('/groups');
    }
  };

  return (
    <GroupDetailScreen
      groupId={id}
      onBack={handleBack}
      onEventClick={handleEventClick}
      onUserClick={handleUserClick}
      onMessageClick={handleMessageClick}
      isOwner={false}
      onEditGroup={handleEditGroup}
      onManageMembers={handleManageMembers}
      onDeleteGroup={handleDeleteGroup}
    />
  );
}
