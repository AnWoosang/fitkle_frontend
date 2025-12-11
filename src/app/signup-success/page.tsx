'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignupSuccessScreen } from '@/domains/user/components/SignupSuccessScreen';

function SignupSuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  return <SignupSuccessScreen email={email} />;
}

export default function SignupSuccess() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      }
    >
      <SignupSuccessContent />
    </Suspense>
  );
}
