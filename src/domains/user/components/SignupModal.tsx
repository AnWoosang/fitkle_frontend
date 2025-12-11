'use client';

import { useRouter } from 'next/navigation';
import { BaseModal } from '@/shared/components';
import { SignupMethodStep } from '@/domains/auth';
import { useUIStore } from '@/shared/store';

interface SignupModalProps {
  /** 로그인 클릭 핸들러 */
  onLoginClick?: () => void;
}

/**
 * 회원가입 모달 컴포넌트
 *
 * Zustand를 통해 전역으로 상태가 관리됩니다.
 *
 * @example
 * ```tsx
 * // 모달 열기
 * const { openSignupModal } = useUIStore();
 * openSignupModal();
 *
 * // 레이아웃에 모달 추가
 * <SignupModal onLoginClick={() => { closeSignupModal(); openLoginModal(); }} />
 * ```
 */
export function SignupModal({ onLoginClick }: SignupModalProps) {
  const router = useRouter();
  const { isSignupModalOpen, closeSignupModal } = useUIStore();

  // OAuth 회원가입 처리
  const handleOAuthSignup = async (provider: 'google' | 'kakao' | 'apple') => {
    try {
      // OAuth 로그인 후 complete-profile 페이지로 이동
      if (provider === 'google') {
        window.location.href = '/api/auth/oauth/google';
      } else if (provider === 'kakao') {
        window.location.href = '/api/auth/oauth/kakao';
      } else if (provider === 'apple') {
        window.location.href = '/api/auth/oauth/apple';
      }
      // OAuth 리디렉션 전에 모달 닫기
      closeSignupModal();
    } catch (error) {
      console.error('OAuth 로그인 실패:', error);
    }
  };

  // 회원가입 방법 선택
  const handleSelectMethod = (method: 'email' | 'google' | 'kakao' | 'apple') => {
    if (method === 'email') {
      // 이메일 선택 시 모달 닫고 /signup 페이지로 이동
      closeSignupModal();
      router.push('/signup');
    } else {
      // OAuth의 경우 바로 처리
      handleOAuthSignup(method);
    }
  };

  const handleClose = () => {
    closeSignupModal();
  };

  return (
    <BaseModal
      isOpen={isSignupModalOpen}
      onClose={handleClose}
      size="medium"
      closable
      closeOnBackdrop
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="p-2">
        <SignupMethodStep
          onSelectMethod={handleSelectMethod}
          onLoginClick={() => {
            if (onLoginClick) {
              closeSignupModal();
              onLoginClick();
            }
          }}
        />

        {/* Terms */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our{' '}
            <button className="text-primary underline hover:text-primary/80">Terms of Service</button>
            {' '}and{' '}
            <button className="text-primary underline hover:text-primary/80">Privacy Policy</button>
          </p>
        </div>
      </div>
    </BaseModal>
  );
}
