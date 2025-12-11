'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface EmailVerificationStepProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResendCode: () => Promise<void>;
}

export function EmailVerificationStep({
  email,
  onVerify,
  onResendCode,
}: EmailVerificationStepProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsVerifying(true);
    try {
      await onVerify(code);
    } catch (error) {
      console.error('이메일 인증 실패:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);
    try {
      await onResendCode();
      setResendCooldown(60);

      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      console.error('인증 코드 재발송 실패:', error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">이메일 인증</h2>
        <p className="text-muted-foreground text-sm">
          <span className="font-semibold text-foreground">{email}</span>으로
          <br />
          인증 코드를 발송했습니다
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="emailCode" className="text-sm font-medium">
              인증 코드
            </Label>
            <div className="flex gap-2">
            <Input
              id="emailCode"
              type="text"
              placeholder="6자리 코드"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              className="h-12 bg-white text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
            <Button
              type="button"
              onClick={handleResend}
              variant="outline"
              className="h-12 px-4 whitespace-nowrap min-w-[90px]"
              disabled={isResending || resendCooldown > 0}
            >
              {isResending
                ? '발송 중...'
                : resendCooldown > 0
                  ? `${resendCooldown}초`
                  : '재발송'}
            </Button>
          </div>
            <p className="text-xs text-muted-foreground">
              💡 이메일이 오지 않았다면 스팸함도 확인해보세요
            </p>
          </div>

        <Button
          type="submit"
          className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-md"
          disabled={code.length !== 6 || isVerifying}
        >
          {isVerifying ? '인증 중...' : '인증 완료'}
        </Button>
      </form>
    </div>
  );
}
