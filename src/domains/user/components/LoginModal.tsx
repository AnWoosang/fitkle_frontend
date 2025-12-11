'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/shared/components/ui/button';
import { BaseModal } from '@/shared/components';
import { useLogin, GoogleLoginButton, KakaoLoginButton, AppleLoginButton } from '@/domains/auth';
import { useUIStore } from '@/shared/store';

interface LoginModalProps {
  /** 회원가입 클릭 핸들러 */
  onSignupClick?: () => void;
}

/**
 * 로그인 모달 컴포넌트
 *
 * Zustand를 통해 전역으로 상태가 관리됩니다.
 *
 * @example
 * ```tsx
 * // 모달 열기
 * const { openLoginModal } = useUIStore();
 * openLoginModal();
 *
 * // 레이아웃에 모달 추가
 * <LoginModal onSignupClick={() => router.push('/signup')} />
 * ```
 */
export function LoginModal({ onSignupClick }: LoginModalProps) {
  const { isLoginModalOpen, closeLoginModal } = useUIStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // React Query Mutation 사용
  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password, rememberMe },
      {
        onSuccess: () => {
          // 로그인 성공 시 모달 닫기
          closeLoginModal();
          // 폼 초기화
          setEmail('');
          setPassword('');
          setRememberMe(false);
        },
      }
    );
  };

  const handleClose = () => {
    closeLoginModal();
    // 폼 초기화
    setEmail('');
    setPassword('');
    setRememberMe(false);
  };

  return (
    <BaseModal
      isOpen={isLoginModalOpen}
      onClose={handleClose}
      size="medium"
      closable
      closeOnBackdrop
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="p-2">
        {/* Logo & Welcome */}
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
          <h1 className="text-xl font-bold mb-1">Welcome!</h1>
          <p className="text-sm text-gray-600">
            Meet new friends at Fitkle
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <GoogleLoginButton />
          <KakaoLoginButton />
          <AppleLoginButton />
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

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <input
              id="login-email"
              type="email"
              name="login-email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-lg
                border-0 focus:outline-none focus:ring-2 focus:ring-primary/20
                hover:bg-gray-200 transition-colors
                placeholder:text-gray-500"
              autoComplete="email"
              required
            />

            <input
              id="login-password"
              type="password"
              name="login-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-100 rounded-lg
                border-0 focus:outline-none focus:ring-2 focus:ring-primary/20
                hover:bg-gray-200 transition-colors
                placeholder:text-gray-500"
              autoComplete="current-password"
              required
            />

            {/* Remember Me 체크박스 */}
            <div className="flex items-center space-x-2">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 border-gray-300 rounded
                  text-primary focus:ring-primary cursor-pointer"
              />
              <label
                htmlFor="rememberMe"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me
              </label>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-lg"
              disabled={isPending}
            >
              {isPending ? 'Logging in...' : 'Log in'}
            </Button>

            <div className="text-center">
              <button
                type="button"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>
        </form>

        {/* Signup Link */}
        {onSignupClick && (
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <button
                onClick={onSignupClick}
                className="text-primary hover:underline font-semibold"
              >
                Sign up
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Terms */}
      <div className="mt-8 text-center">
        <p className="text-xs text-muted-foreground">
          By logging in, you agree to our{' '}
          <button className="text-primary underline hover:text-primary/80">Terms of Service</button>
          {' '}and{' '}
          <button className="text-primary underline hover:text-primary/80">Privacy Policy</button>
        </p>
      </div>
    </BaseModal>
  );
}
