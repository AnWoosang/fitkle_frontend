'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import type { User } from '../types/auth';

interface UseAuthGuardOptions {
  /** 미로그인 시 리다이렉트할 경로 (기본: '/') */
  redirectTo?: string;
  /** 리다이렉트를 비활성화 (기본: false) */
  disableRedirect?: boolean;
}

interface UseAuthGuardReturn {
  /** 하이드레이션이 완료되었는지 여부 */
  isReady: boolean;
  /** 로그인 상태 */
  isAuthenticated: boolean;
  /** 사용자 정보 */
  user: User | null;
}

export const useAuthGuard = (
  options: UseAuthGuardOptions = {}
): UseAuthGuardReturn => {
  const { redirectTo = '/', disableRedirect = false } = options;
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const { isLoggedIn, user } = useAuthStore();

  // 하이드레이션 완료 체크
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // 로그인 체크 및 리다이렉트
  useEffect(() => {
    if (isHydrated && !isLoggedIn && !disableRedirect) {
      router.push(redirectTo);
    }
  }, [isHydrated, isLoggedIn, router, redirectTo, disableRedirect]);

  return {
    isReady: isHydrated,
    isAuthenticated: isLoggedIn,
    user,
  };
};
