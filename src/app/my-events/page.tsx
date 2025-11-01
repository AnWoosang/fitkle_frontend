'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { MyEventsListScreen } from '@/domains/event';
import { ResponsiveLayout } from '@/shared/layout';

export default function MyEventsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = (searchParams.get('filter') as 'created' | 'joined' | 'saved') || 'created';

  const handleBack = () => {
    router.push('/profile');
  };

  const handleEventClick = (eventId: string, isOwner: boolean = false) => {
    router.push(`/events/${eventId}`);
  };

  const handleCreateEvent = () => {
    router.push('/events/create');
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showBackButton: true,
        onBack: handleBack,
        title: 'My Events',
      }}
      webLayoutProps={{
        maxWidth: 'wide',
      }}
      mobileContent={
        <MyEventsListScreen
          filter={filter}
          onBack={handleBack}
          onEventClick={handleEventClick}
          onCreateEvent={handleCreateEvent}
        />
      }
      webContent={
        <MyEventsListScreen
          filter={filter}
          onBack={handleBack}
          onEventClick={handleEventClick}
          onCreateEvent={handleCreateEvent}
        />
      }
    />
  );
}
