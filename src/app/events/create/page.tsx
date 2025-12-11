'use client';

import { useRouter } from 'next/navigation';
import { CreateEventScreen } from '@/domains/event';

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
    <CreateEventScreen
      onCreate={handleCreateEvent}
      onBack={handleBack}
    />
  );
}
