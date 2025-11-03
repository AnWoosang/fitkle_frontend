'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { UserProfileScreen } from '@/domains/user';
import { ResponsiveLayout } from '@/shared/layout';

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleChatClick = (userId: string) => {
    router.push(`/messages/${userId}`);
  };

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showBackButton: true,
        onBack: handleBack,
      }}
      webLayoutProps={{
        maxWidth: 'default',
      }}
      mobileContent={
        <UserProfileScreen
          userId={id}
          onBack={handleBack}
          onEventClick={handleEventClick}
          onChatClick={handleChatClick}
        />
      }
      webContent={
        <UserProfileScreen
          userId={id}
          onBack={handleBack}
          onEventClick={handleEventClick}
          onChatClick={handleChatClick}
        />
      }
    />
  );
}
