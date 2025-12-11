'use client';

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export function useUserVerification() {
  return useQuery({
    queryKey: ['user-verification'],
    queryFn: async () => {
      const supabase = createClient();

      // 현재 로그인한 사용자 확인
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return { isLoggedIn: false, isVerified: true }; // 로그인하지 않은 경우 배너 표시 안 함
      }

      // member 테이블에서 is_email_verified, is_phone_verified 확인
      const { data: member, error } = await supabase
        .from('member')
        .select('is_email_verified, is_phone_verified')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('[useUserVerification] member 조회 실패:', error);
        return { isLoggedIn: true, isVerified: true }; // 에러 시 배너 표시 안 함
      }

      // 이메일과 전화번호 모두 인증되어야 완전히 인증된 것으로 간주
      const isFullyVerified = (member?.is_email_verified && member?.is_phone_verified) ?? true;

      return {
        isLoggedIn: true,
        isVerified: isFullyVerified,
      };
    },
    staleTime: 5 * 60 * 1000, // 5분
    refetchOnWindowFocus: true,
  });
}
