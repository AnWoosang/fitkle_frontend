'use client';

import { useRouter } from 'next/navigation';
import { ExploreScreen } from '@/domains/home';
import { ResponsiveLayout } from '@/shared/layout';

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
    <ResponsiveLayout
      mobileLayoutProps={{
        showLogo: true,
        stickyHeader: true,
      }}
      webLayoutProps={{
        maxWidth: 'wide',
      }}
      mobileContent={
        <ExploreScreen
          onEventClick={handleEventClick}
          onGroupClick={handleGroupClick}
          onBack={handleBack}
        />
      }
      webContent={
        <ExploreScreen
          onEventClick={handleEventClick}
          onGroupClick={handleGroupClick}
          onBack={handleBack}
        />
      }
    />
  );
}
