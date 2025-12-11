'use client';

import { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { LoginModal, SignupModal } from '@/domains/user';
import { useUIStore } from '@/shared/store';
import { ScrollToTop } from '@/shared/components';

interface ClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Client Component 레이아웃
 *
 * Server Component인 RootLayout에서 분리하여
 * 모든 클라이언트 로직을 여기에서 관리합니다.
 */
export function ClientLayout({ children }: ClientLayoutProps) {
  const [isMounted, setIsMounted] = useState(false);

  const {
    isLoginModalOpen,
    isSignupModalOpen,
    closeLoginModal,
    openLoginModal,
    closeSignupModal,
    openSignupModal,
  } = useUIStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 로그인 모달에서 회원가입 클릭 시
  const handleSignupClick = () => {
    closeLoginModal();
    openSignupModal();
  };

  // 회원가입 모달에서 로그인 클릭 시
  const handleLoginClick = () => {
    closeSignupModal();
    openLoginModal();
  };

  // Google OAuth Client ID (환경변수에서 가져오기)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryProvider>
        <ScrollToTop />
        {children}
        <Toaster
          position="top-center"
          richColors
          toastOptions={{
            style: {
              zIndex: 9999, // 모달보다 위에 표시
            },
          }}
        />
        {/* 전역 로그인 모달 */}
        {isMounted && isLoginModalOpen && <LoginModal onSignupClick={handleSignupClick} />}
        {/* 전역 회원가입 모달 */}
        {isMounted && isSignupModalOpen && <SignupModal onLoginClick={handleLoginClick} />}
      </QueryProvider>
    </GoogleOAuthProvider>
  );
}
