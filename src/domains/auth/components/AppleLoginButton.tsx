'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

interface AppleLoginButtonProps {
  mode?: 'signin' | 'signup';
}

export default function AppleLoginButton({ mode = 'signin' }: AppleLoginButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const buttonText = mode === 'signup' ? 'Continue with Apple' : 'Sign in with Apple';
  const loadingText = mode === 'signup' ? 'Continuing...' : 'Signing in...';

  const handleAppleLogin = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      // BFF API 호출하여 OAuth URL 받기
      const response = await fetch('/api/auth/oauth/apple', {
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
      console.error('Apple 로그인 실패:', error);
      toast.error('Apple 로그인에 실패했습니다');
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleAppleLogin}
      disabled={isLoading}
      className="relative flex items-center w-full h-12 px-4
                 bg-black text-white rounded-xl hover:bg-gray-900
                 cursor-pointer transition-all shadow-sm
                 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {/* Apple 로고 - 왼쪽 고정 위치 */}
      <div className="absolute left-4 flex items-center justify-center w-5 h-5">
        <Image
          src="/apple_logo.svg"
          alt="Apple"
          width={20}
          height={20}
          className="flex-shrink-0"
        />
      </div>

      <span className="w-full text-center text-white text-[15px] font-medium">
        {isLoading ? loadingText : buttonText}
      </span>
    </button>
  );
}
