'use client';

import React, { ReactNode } from 'react';
import { useAuthRedirect } from '../hooks/useAuthRedirect';

/**
 * ProtectedRoute 컴포넌트
 *
 * 인증된 사용자만 접근 가능한 페이지를 보호하는 컴포넌트
 * Pickdam 패턴을 따라 구현
 *
 * @example
 * ```tsx
 * export default function ProfilePage() {
 *   return (
 *     <ProtectedRoute>
 *       <ProfileScreen />
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthRedirect();

  // 로딩 중
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  // 미인증 (이미 useAuthRedirect에서 리다이렉트 처리됨)
  if (!isAuthenticated) {
    return null;
  }

  // 인증된 사용자에게만 children 표시
  return <>{children}</>;
}
