'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { EventDetailScreen } from '@/domains/event';

export default function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleHostClick = (userId: string) => {
    router.push(`/users/${userId}`);
  };

  const handleEditEvent = () => {
    router.push(`/events/${id}/edit`);
  };

  const handleManageAttendees = () => {
    router.push(`/events/${id}/attendees`);
  };

  const handleDeleteEvent = () => {
    if (confirm('정말 이 이벤트를 삭제하시겠습니까?')) {
      console.log('Deleting event:', id);
      router.push('/my-events');
    }
  };

  return (
    <EventDetailScreen
      eventId={id}
      onBack={handleBack}
      onHostClick={handleHostClick}
      isOwner={false}
      onEditEvent={handleEditEvent}
      onManageAttendees={handleManageAttendees}
      onDeleteEvent={handleDeleteEvent}
    />
  );
}
