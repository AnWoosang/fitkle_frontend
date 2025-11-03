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
    console.log('Signup:', name, email, password, country);
    router.push('/');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleBack = () => {
    router.back();
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
          onBack={handleBack}
        />
      }
      webContent={
        <SignupScreen
          onSignup={handleSignup}
          onLoginClick={handleLoginClick}
          onBack={handleBack}
        />
      }
    />
  );
}
