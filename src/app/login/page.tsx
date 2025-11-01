'use client';

import { useRouter } from 'next/navigation';
import { LoginScreen } from '@/domains/user';
import { ResponsiveLayout } from '@/shared/layout';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (email: string, password: string) => {
    console.log('Login:', email);
    router.push('/');
  };

  const handleSignupClick = () => {
    router.push('/signup');
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showLogo: true,
        stickyHeader: false,
      }}
      webLayoutProps={{
        maxWidth: 'default',
      }}
      mobileContent={
        <LoginScreen
          onLogin={handleLogin}
          onSignupClick={handleSignupClick}
        />
      }
      webContent={
        <LoginScreen
          onLogin={handleLogin}
          onSignupClick={handleSignupClick}
        />
      }
    />
  );
}
