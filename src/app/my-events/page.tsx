'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MyEventsListScreen } from '@/domains/event';

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
    <MyEventsListScreen
      initialFilter={filter}
      onBack={handleBack}
      onEventClick={handleEventClick}
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
