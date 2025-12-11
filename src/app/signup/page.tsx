'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { SignupScreen } from '@/domains/user';
import { Suspense } from 'react';

function SignupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL 쿼리 파라미터를 key로 사용하여 강제 리마운트
  // 매번 랜덤 쿼리가 없어도 페이지 경로가 바뀔 때마다 리마운트됨
  const resetKey = searchParams.get('reset') || 'default';

  const handleBack = () => {
    router.push('/');
  };

  return <SignupScreen key={resetKey} onBack={handleBack} />;
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
