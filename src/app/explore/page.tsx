'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ExploreScreen } from '@/domains/home/components/ExploreScreen';
import { ResponsiveLayout } from '@/shared/layout';

function ExploreContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchQuery = searchParams.get('query') || '';
  const location = searchParams.get('location') || '모든 지역';

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleGroupClick = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showBottomNav: true,
      }}
      webLayoutProps={{
        maxWidth: 'wide',
      }}
      mobileContent={
        <ExploreScreen
          onEventClick={handleEventClick}
          onGroupClick={handleGroupClick}
          initialSearchQuery={searchQuery}
          initialLocation={location}
          onBack={handleBack}
        />
      }
      webContent={
        <ExploreScreen
          onEventClick={handleEventClick}
          onGroupClick={handleGroupClick}
          initialSearchQuery={searchQuery}
          initialLocation={location}
          onBack={handleBack}
        />
      }
    />
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExploreContent />
    </Suspense>
  );
}
