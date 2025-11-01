'use client';

import { useRouter } from 'next/navigation';
import { MessagesScreen } from '@/domains/message';
import { ResponsiveLayout } from '@/shared/layout';

export default function MessagesPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const handleChatClick = (userId: string, userName: string) => {
    router.push(`/messages/${userId}`);
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showBackButton: true,
        onBack: handleBack,
        title: 'Messages',
      }}
      webLayoutProps={{
        maxWidth: 'default',
      }}
      mobileContent={
        <MessagesScreen onBack={handleBack} onChatClick={handleChatClick} />
      }
      webContent={
        <MessagesScreen onBack={handleBack} onChatClick={handleChatClick} />
      }
    />
  );
}
