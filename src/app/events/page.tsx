'use client';

import { useRouter } from 'next/navigation';
import { WebHomeScreen } from '@/domains/home';
import { HomeScreen } from '@/domains/home';
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

  const handleNewsClick = (newsId: string) => {
    console.log('News clicked:', newsId);
    // TODO: Create news detail page
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showBackButton: true,
        onBack: handleBack,
        title: 'Events',
      }}
      webLayoutProps={{
        maxWidth: 'wide',
      }}
      mobileContent={
        <HomeScreen
          onEventClick={handleEventClick}
          onGroupClick={handleGroupClick}
          onNewsClick={handleNewsClick}
          onBack={handleBack}
        />
      }
      webContent={
        <WebHomeScreen
          onEventClick={handleEventClick}
          onGroupClick={handleGroupClick}
        />
      }
    />
  );
}
