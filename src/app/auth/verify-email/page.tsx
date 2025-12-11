'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EmailVerificationScreen } from '@/domains/auth/components/EmailVerificationScreen';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get('email');

    if (!emailParam) {
      // 이메일이 없으면 회원가입 페이지로 리다이렉트
      router.push('/signup');
      return;
    }

    setEmail(emailParam);
  }, [searchParams, router]);

  if (!email) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-600">로딩 중...</div>
      </div>
    );
  }

  return <EmailVerificationScreen email={email} />;
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-gray-600">로딩 중...</div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
