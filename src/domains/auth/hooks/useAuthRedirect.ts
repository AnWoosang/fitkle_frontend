'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthQueries } from './useAuthQueries';

/**
 * useAuthRedirect Hook
 *
 * 인증 상태 확인 및 리다이렉트 처리를 위한 커스텀 훅
 * Pickdam 패턴을 따라 구현
 *
 * - 미인증 시 자동으로 홈페이지로 리다이렉트
 * - ProtectedRoute 컴포넌트와 함께 사용
 *
 * @example
 * ```tsx
 * function ProtectedRoute({ children }) {
 *   const { isAuthenticated, isLoading } = useAuthRedirect();
 *
 *   if (isLoading) return <LoadingSpinner />;
 *   if (!isAuthenticated) return null;
 *
 *   return <>{children}</>;
 * }
 * ```
 */
export function useAuthRedirect() {
  const { isAuthenticated, isLoading } = useAuthQueries();
  const router = useRouter();

  useEffect(() => {
    // 로딩이 완료되고 미인증 상태면 홈으로 리다이렉트
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}
