'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';
import { AppLogo } from '@/shared/components/AppLogo';

interface SignupSuccessScreenProps {
  email: string | null;
}

export function SignupSuccessScreen({ email }: SignupSuccessScreenProps) {
  const router = useRouter();

  useEffect(() => {
    // 이메일이 없으면 홈으로 리다이렉트
    if (!email) {
      router.push('/');
    }
  }, [email, router]);

  const handleGoToHome = () => {
    router.push('/');
  };

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50">
      {/* 로고 */}
      <div className="mb-8">
        <AppLogo />
      </div>

      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* 성공 아이콘 */}
          <div className="text-6xl mb-6">🎉</div>

          {/* 제목 */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            회원가입이 완료되었습니다!
          </h1>

          {/* 설명 */}
          <div className="text-gray-600 mb-8 space-y-3">
            <p className="text-lg">
              <strong className="text-primary">{email}</strong>
            </p>
            <p>
              Fitkle에 오신 것을 환영합니다!
              <br />
              이제 다양한 모임과 이벤트를 즐기실 수 있습니다.
            </p>
          </div>

          {/* 유의사항 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
            <div className="flex items-start gap-2">
              <span className="text-yellow-600 text-sm">⚠️</span>
              <div className="flex-1 text-left">
                <p className="text-xs font-medium text-yellow-800 mb-0.5">유의사항</p>
                <p className="text-xs text-yellow-700 leading-relaxed">
                  이메일 인증과 휴대폰 인증을 모두 완료해야 Fitkle의 모든 서비스를 이용하실 수 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <Button
            onClick={handleGoToHome}
            size="lg"
            className="w-full"
          >
            홈으로 이동
          </Button>
        </div>
      </div>
    </div>
  );
}
