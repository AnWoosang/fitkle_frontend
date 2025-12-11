'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/shared/components/ui/button';

interface EmailVerificationScreenProps {
  email: string;
}

export function EmailVerificationScreen({ email }: EmailVerificationScreenProps) {
  const router = useRouter();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // OTP 입력 처리 (6자리)
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(value);
    setError('');
  };

  // OTP 인증
  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('6자리 인증 코드를 입력해주세요');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token: otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '인증에 실패했습니다');
      }

      // 인증 성공 - 로그인 상태로 전환
      setSuccessMessage('이메일 인증이 완료되었습니다!');

      // 프로필 완성 페이지로 이동 또는 홈으로 이동
      setTimeout(() => {
        router.push('/complete-profile');
      }, 1500);
    } catch (err: any) {
      setError(err.message || '인증에 실패했습니다');
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 코드 재전송
  const handleResend = async () => {
    setIsResending(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/auth/resend-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: 'signup' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || '재전송에 실패했습니다');
      }

      setSuccessMessage('인증 코드가 재전송되었습니다');
    } catch (err: any) {
      setError(err.message || '재전송에 실패했습니다');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            이메일 인증
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-medium text-blue-600">{email}</span>
            <br />
            으로 발송된 6자리 인증 코드를 입력해주세요
          </p>
        </div>

        {/* OTP 입력 폼 */}
        <div className="space-y-6">
          {/* 인증 코드 입력 */}
          <div>
            <label htmlFor="otp" className="sr-only">
              인증 코드
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={otp}
              onChange={handleOtpChange}
              placeholder="000000"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-2xl font-mono tracking-widest focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 성공 메시지 */}
          {successMessage && (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-600">
              {successMessage}
            </div>
          )}

          {/* 인증 버튼 */}
          <Button
            onClick={handleVerify}
            disabled={isLoading || otp.length !== 6}
            className="w-full"
          >
            {isLoading ? '인증 중...' : '인증하기'}
          </Button>

          {/* 재전송 버튼 */}
          <div className="text-center">
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
            >
              {isResending ? '재전송 중...' : '인증 코드를 받지 못하셨나요?'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
