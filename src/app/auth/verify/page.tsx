'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * 카카오 로그인 세션 설정 컴포넌트
 */
function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const tokenHash = searchParams.get('token_hash');
        const type = searchParams.get('type');

        if (!tokenHash || !type) {
          setError('잘못된 인증 링크입니다');
          setTimeout(() => router.push('/?error=invalid_token'), 2000);
          return;
        }

        console.log('세션 생성 중...');

        const supabase = createClient();

        // 일회성 토큰으로 Supabase 세션 생성
        const { data, error: verifyError } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as 'magiclink',
        });

        if (verifyError) {
          console.error('세션 생성 실패:', verifyError);
          setError('로그인에 실패했습니다');
          setTimeout(() => router.push('/?error=auth_failed'), 2000);
          return;
        }

        console.log('✅ 로그인 성공:', data.user?.email);

        if (!data.user) {
          console.error('사용자 정보가 없습니다');
          setError('로그인에 실패했습니다');
          setTimeout(() => router.push('/?error=no_user'), 2000);
          return;
        }

        // member 테이블 확인
        const { data: member, error: memberError } = await supabase
          .from('member')
          .select('profile_completed')
          .eq('id', data.user.id)
          .single();

        if (memberError) {
          console.error('회원 정보 조회 실패:', memberError);
        }

        // 프로필 완성 여부에 따라 리다이렉트
        if (member?.profile_completed) {
          router.push('/');
        } else {
          router.push('/complete-profile');
        }
      } catch (err: any) {
        console.error('인증 처리 오류:', err);
        setError('로그인 처리 중 오류가 발생했습니다');
        setTimeout(() => router.push('/?error=auth_error'), 2000);
      }
    };

    verify();
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        {error ? (
          <>
            <div className="text-destructive text-lg font-semibold">{error}</div>
            <p className="text-sm text-muted-foreground">잠시 후 홈으로 이동합니다...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">로그인 처리 중...</p>
          </>
        )}
      </div>
    </div>
  );
}

/**
 * 카카오 로그인 세션 설정 페이지
 *
 * BFF에서 받은 일회성 토큰(token_hash)으로 Supabase 세션을 생성합니다.
 */
export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
            <p className="text-muted-foreground">로그인 처리 중...</p>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
