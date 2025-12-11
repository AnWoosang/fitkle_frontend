'use client';

import { useRouter } from 'next/navigation';
import { SettingsScreen } from '@/domains/user';

export default function SettingsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/profile');
  };

  return <SettingsScreen onBack={handleBack} />;
}
