'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/domains/auth/store/authStore';
import { useAuth } from '@/domains/auth';

/**
 * React Query와 authStore를 동기화하는 Provider
 * - React Query가 단일 진실 공급원(Single Source of Truth)
 * - authStore는 로컬 스토리지 persist 및 UI 상태 관리용
 */
export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { setUser, logout } = useAuthStore();
  const { data: user, isSuccess } = useAuth();

  useEffect(() => {
    if (isSuccess) {
      if (user) {
        // React Query에 user 데이터가 있으면 authStore 업데이트
        setUser(user);
      } else {
        // React Query에 user가 null이면 authStore 초기화
        logout();
      }
    }
  }, [user, isSuccess, setUser, logout]);

  return <>{children}</>;
}
