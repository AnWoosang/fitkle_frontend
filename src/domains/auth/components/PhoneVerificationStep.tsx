'use client';

import { useState } from 'react';
import { Phone } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

interface PhoneVerificationStepProps {
  onVerify: (phoneNumber?: string, code?: string) => Promise<void>;
  onSendCode: (phoneNumber: string) => Promise<void>;
}

export function PhoneVerificationStep({
  onVerify,
  onSendCode,
}: PhoneVerificationStepProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const handleSendCode = async () => {
    if (!phoneNumber || resendCooldown > 0) return;

    setIsSending(true);
    try {
      await onSendCode(phoneNumber);
      setIsCodeSent(true);
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
      console.error('인증 코드 발송 실패:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) return;

    setIsVerifying(true);
    try {
      await onVerify(phoneNumber, code);
    } catch (error) {
      console.error('전화번호 인증 실패:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">휴대폰 인증</h2>
        <p className="text-muted-foreground text-sm">
          본인 확인을 위한 휴대폰 인증이 필요합니다
        </p>
      </div>

      <form onSubmit={handleVerify} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="phoneNumber" className="text-sm font-medium">
            휴대폰 번호
          </Label>
          <div className="flex gap-2">
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="010-1234-5678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="h-12 bg-white"
              required
              disabled={isCodeSent}
            />
            <Button
              type="button"
              onClick={handleSendCode}
              variant="outline"
              className="h-12 px-4 whitespace-nowrap min-w-[90px]"
              disabled={!phoneNumber || isCodeSent || isSending || resendCooldown > 0}
            >
              {isSending ? '발송 중...' : isCodeSent ? '발송됨' : '인증'}
            </Button>
          </div>
        </div>

        {isCodeSent && (
          <>
            <div className="space-y-2">
              <Label htmlFor="phoneCode" className="text-sm font-medium">
                인증 코드
              </Label>
              <div className="flex gap-2">
                <Input
                  id="phoneCode"
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
                  onClick={handleSendCode}
                  variant="outline"
                  className="h-12 px-4 whitespace-nowrap min-w-[90px]"
                  disabled={isSending || resendCooldown > 0}
                >
                  {isSending
                    ? '발송 중...'
                    : resendCooldown > 0
                      ? `${resendCooldown}초`
                      : '재발송'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                SMS로 발송된 6자리 코드를 입력해주세요
              </p>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white shadow-md"
              disabled={code.length !== 6 || isVerifying}
            >
              {isVerifying ? '인증 중...' : '인증 완료'}
            </Button>
          </>
        )}

        {/* 건너뛰기 버튼 */}
        <Button
          type="button"
          onClick={() => onVerify()}
          variant="outline"
          className="w-full h-12 mt-4"
        >
          나중에 인증하기
        </Button>
      </form>
    </div>
  );
}
