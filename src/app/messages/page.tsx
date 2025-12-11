'use client';

import { useRouter } from 'next/navigation';
import { MessagesScreen } from '@/domains/message';

export default function MessagesPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const handleChatClick = (userId: string) => {
    router.push(`/messages/${userId}`);
  };

  return (
    <MessagesScreen onBack={handleBack} onChatClick={handleChatClick} />
  );
}
