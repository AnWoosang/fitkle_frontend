'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

interface GoogleLoginButtonProps {
  mode?: 'signin' | 'signup';
}

export default function GoogleLoginButton({ mode = 'signin' }: GoogleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const buttonText = mode === 'signup' ? 'Continue with Google' : 'Sign in with Google';
  const loadingText = mode === 'signup' ? 'Continuing...' : 'Signing in...';

  const handleGoogleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // BFF API 호출하여 OAuth URL 받기
      const response = await fetch('/api/auth/oauth/google', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('OAuth URL 생성 실패');
      }

      const { url, error } = await response.json();

      if (error) {
        throw new Error(error);
      }

      // OAuth URL로 리다이렉트
      // /auth/callback에서 member 테이블 확인 후:
      // - 신규 회원 → /complete-profile
      // - 기존 회원 → /
      window.location.href = url;
    } catch (error: any) {
      console.error('Google 로그인 실패:', error);
      toast.error('Google 로그인에 실패했습니다');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={isLoading}
      className="relative flex items-center w-full h-12 px-4
                 bg-white border-2 border-gray-300 rounded-xl
                 hover:bg-gray-50 hover:border-gray-400
                 cursor-pointer transition-all shadow-sm
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Google 로고 - 왼쪽 고정 위치 */}
      <div className="absolute left-4 flex items-center justify-center w-5 h-5">
        <Image
          src="/google_logo.svg"
          alt="Google"
          width={20}
          height={20}
          className="flex-shrink-0"
        />
      </div>

      <span className="w-full text-center text-gray-700 text-[15px] font-medium">
        {isLoading ? loadingText : buttonText}
      </span>
    </button>
  );
}
