'use client';

import { useRouter } from 'next/navigation';
import { ProfileScreen } from '@/domains/user';
import { ResponsiveLayout } from '@/shared/layout';

export default function ProfilePage() {
  const router = useRouter();

  const handleLogout = () => {
    console.log('Logout');
    router.push('/login');
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showBottomNav: true,
      }}
      webLayoutProps={{
        maxWidth: 'default',
      }}
      mobileContent={
        <ProfileScreen
          onLogout={handleLogout}
        />
      }
      webContent={
        <ProfileScreen
          onLogout={handleLogout}
        />
      }
    />
  );
}
