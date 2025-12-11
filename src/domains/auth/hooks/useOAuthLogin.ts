import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useUIStore } from '@/shared/store';
import { BusinessError } from '@/shared/error/BusinessError';

/**
 * OAuth 로그인을 위한 재사용 가능한 hook
 *
 * @param provider - OAuth 제공자 이름 (Google, Kakao 등)
 * @param loginFn - 실제 로그인 API 함수
 *
 * @example
 * ```tsx
 * const { mutate: login, isPending } = useOAuthLogin(
 *   'Google',
 *   authApi.loginWithGoogle
 * );
 * ```
 */
export function useOAuthLogin(
  provider: string,
  loginFn: () => Promise<{ url: string }>
) {
  const { openLoginModal } = useUIStore();

  return useMutation({
    mutationFn: async () => {
      const { url } = await loginFn();
      return url;
    },
    onSuccess: (url) => {
      // OAuth 페이지로 리다이렉트
      window.location.href = url;
    },
    onError: (error: BusinessError) => {
      // 에러 토스트 표시
      const errorMessage = error.message || `${provider} 로그인에 실패했습니다`;
      toast.error(errorMessage);

      // 로그인 모달 다시 열기
      openLoginModal();
    },
  });
}
