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
        showBackButton: true,
        onBack: handleBack,
        title: 'Create Event',
      }}
      webLayoutProps={{
        maxWidth: 'default',
        title: 'Create Event',
      }}
      mobileContent={
        <CreateEventScreen
          onSubmit={handleCreateEvent}
          onBack={handleBack}
        />
      }
      webContent={
        <CreateEventScreen
          onSubmit={handleCreateEvent}
          onBack={handleBack}
        />
      }
    />
  );
}
