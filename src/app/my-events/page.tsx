'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MyEventsListScreen } from '@/domains/event';
import { ResponsiveLayout } from '@/shared/layout';

function MyEventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filter = (searchParams.get('filter') as 'created' | 'joined' | 'saved') || 'created';

  const handleBack = () => {
    router.push('/profile');
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
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
          initialFilter={filter}
          onBack={handleBack}
          onEventClick={handleEventClick}
        />
      }
      webContent={
        <MyEventsListScreen
          initialFilter={filter}
          onBack={handleBack}
          onEventClick={handleEventClick}
        />
      }
    />
  );
}

export default function MyEventsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyEventsContent />
    </Suspense>
  );
}
