'use client';

import { useRouter } from 'next/navigation';
import { ExploreScreen } from '@/domains/home';

export default function EventsPage() {
  const router = useRouter();

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleGroupClick = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <ExploreScreen
      onEventClick={handleEventClick}
      onGroupClick={handleGroupClick}
      onBack={handleBack}
    />
  );
}
