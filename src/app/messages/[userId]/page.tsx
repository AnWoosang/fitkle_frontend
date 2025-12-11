'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ChatScreen } from '@/domains/message';

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
    <ChatScreen
      userId={userId}
      userName="User"
      onBack={handleBack}
    />
  );
}
