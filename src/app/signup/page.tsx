'use client';

import { useRouter } from 'next/navigation';
import { SignupScreen } from '@/domains/user';
import { ResponsiveLayout } from '@/shared/layout';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = (
    name: string,
    email: string,
    password: string,
    country: string
  ) => {
    console.log('Signup:', name, email, country);
    router.push('/');
  };

  const handleLoginClick = () => {
    router.push('/login');
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
        <SignupScreen
          onSignup={handleSignup}
          onLoginClick={handleLoginClick}
        />
      }
      webContent={
        <SignupScreen
          onSignup={handleSignup}
          onLoginClick={handleLoginClick}
        />
      }
    />
  );
}
