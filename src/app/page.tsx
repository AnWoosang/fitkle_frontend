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

  const handleFindEventsClick = () => {
    router.push('/events');
  };

  const handleExploreGroupsClick = () => {
    router.push('/groups');
  };

  const handleMyEventsClick = () => {
    router.push('/events');
  };

  const handleNewsClick = (newsId: string) => {
    router.push(`/news/${newsId}`);
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showBottomNav: true,
        showLogo: false,
        contentClassName: 'h-full',
      }}
      webLayoutProps={{
        maxWidth: 'wide',
      }}
      mobileContent={
        <HomeScreen
          onEventClick={handleEventClick}
          onGroupClick={handleGroupClick}
          onExploreGroupsClick={handleExploreGroupsClick}
          onMyEventsClick={handleMyEventsClick}
          onNewsClick={handleNewsClick}
        />
      }
      webContent={
        <WebHomeScreen
          onEventClick={handleEventClick}
          onGroupClick={handleGroupClick}
          onBrowseAllClick={handleBrowseAllClick}
          onFindEventsClick={handleFindEventsClick}
          onExploreGroupsClick={handleExploreGroupsClick}
          onNewsClick={handleNewsClick}
        />
      }
    />
  );
}
