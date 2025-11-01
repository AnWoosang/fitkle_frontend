'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ChatScreen } from '@/domains/message';
import { ResponsiveLayout } from '@/shared/layout';

export default function ChatPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const router = useRouter();

  const handleBack = () => {
    router.push('/messages');
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
        <ChatScreen
          userId={userId}
          userName="User"
          onBack={handleBack}
        />
      }
      webContent={
        <ChatScreen
          userId={userId}
          userName="User"
          onBack={handleBack}
        />
      }
    />
  );
}
