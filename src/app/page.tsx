'use client';

import { useRouter } from 'next/navigation';
import { HomeScreen, WebHomeScreen } from '@/domains/home';
import { ResponsiveLayout } from '@/shared/layout';

export default function HomePage() {
  const router = useRouter();

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleGroupClick = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  const handleBrowseAllClick = () => {
    router.push('/events');
  };

  const handleNewsClick = (newsId: string) => {
    console.log('News clicked:', newsId);
    // TODO: Create news detail page
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
        <HomeScreen
          onEventClick={handleEventClick}
          onGroupClick={handleGroupClick}
          onNewsClick={handleNewsClick}
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
