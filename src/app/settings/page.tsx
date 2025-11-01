'use client';

import { useRouter } from 'next/navigation';
import { SettingsScreen } from '@/domains/user';
import { ResponsiveLayout } from '@/shared/layout';

export default function SettingsPage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/profile');
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showBackButton: true,
        onBack: handleBack,
        title: 'Settings',
      }}
      webLayoutProps={{
        maxWidth: 'default',
      }}
      mobileContent={<SettingsScreen onBack={handleBack} />}
      webContent={<SettingsScreen onBack={handleBack} />}
    />
  );
}
