'use client';

import { useRouter } from 'next/navigation';
import { CreateEventScreen } from '@/domains/event';
import { ResponsiveLayout } from '@/shared/layout';

export default function CreateEventPage() {
  const router = useRouter();

  const handleCreateEvent = (eventData: any) => {
    console.log('Creating event:', eventData);
    router.push('/events');
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
        <CreateEventScreen
          onCreate={handleCreateEvent}
          onBack={handleBack}
        />
      }
      webContent={
        <CreateEventScreen
          onCreate={handleCreateEvent}
          onBack={handleBack}
        />
      }
    />
  );
}
