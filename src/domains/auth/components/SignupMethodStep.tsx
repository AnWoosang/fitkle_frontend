'use client';

import Image from 'next/image';
import { Mail } from 'lucide-react';
import { GoogleLoginButton, KakaoLoginButton, AppleLoginButton } from '@/domains/auth';
import type { SignupMethod } from '../types/signup';

interface SignupMethodStepProps {
  onSelectMethod: (method: SignupMethod) => void;
  onLoginClick: () => void;
}

export function SignupMethodStep({ onSelectMethod, onLoginClick }: SignupMethodStepProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <Image
            src="/logo.png"
            alt="Fitkle"
            width={160}
            height={48}
            className="h-auto w-auto"
          />
        </div>
        <p className="text-sm text-gray-600">
          Join the Fitkle community
        </p>
      </div>

      {/* OAuth 가입 버튼들 */}
      <div className="space-y-3 mb-6">
        <GoogleLoginButton mode="signup" />
        <KakaoLoginButton mode="signup" />
        <AppleLoginButton mode="signup" />
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-background text-muted-foreground">
            or
          </span>
        </div>
      </div>

      {/* 이메일 가입 버튼 */}
      <button
        onClick={() => onSelectMethod('email')}
        className="relative flex items-center w-full h-12 px-4
                   bg-white border-2 border-gray-300 rounded-xl
                   hover:bg-gray-50 hover:border-gray-400
                   cursor-pointer transition-all shadow-sm"
      >
        <div className="absolute left-4 flex items-center justify-center w-5 h-5">
          <Mail className="w-5 h-5 text-gray-700" />
        </div>
        <span className="w-full text-center text-gray-700 text-[15px] font-medium">
          Continue with Email
        </span>
      </button>

      {/* 로그인 링크 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <button onClick={onLoginClick} className="text-primary hover:underline font-semibold">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
}
