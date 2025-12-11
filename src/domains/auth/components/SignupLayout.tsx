'use client';

import { Check } from 'lucide-react';
import { AppLogo } from '@/shared/components/AppLogo';
import type { SignupStep } from '../types/signup';

interface SignupLayoutProps {
  step: SignupStep;
  children: React.ReactNode;
  onBack?: () => void;
  onLogoClick?: () => void;
  showProgress?: boolean;
}

export function SignupLayout({
  step,
  children,
  onLogoClick,
  showProgress = true,
}: SignupLayoutProps) {
  // 단계별 진행 상태 - 4단계로 구성
  const steps = [
    { key: 'form', label: '기본정보', number: 1 },
    { key: 'email-verify', label: '이메일인증', number: 2 },
    { key: 'phone-verify', label: '휴대폰인증', number: 3 },
    { key: 'additional-info', label: '추가정보', number: 4 },
  ];

  // 현재 단계 인덱스 구하기
  const getCurrentStepIndex = () => {
    const index = steps.findIndex((s) => s.key === step);
    return index === -1 ? 0 : index;
  };

  const currentStepIndex = getCurrentStepIndex();
  const shouldShowProgress = showProgress && step !== 'method';

  // 단계 상태 확인 헬퍼 함수
  const isStepActive = (stepKey: string) => {
    const index = steps.findIndex((s) => s.key === stepKey);
    return index === currentStepIndex;
  };

  const isStepComplete = (stepKey: string) => {
    const index = steps.findIndex((s) => s.key === stepKey);
    return index < currentStepIndex;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/5 via-[#e8eddb]/50 to-[#f0e5e0]/50">
      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex items-center justify-center px-6 py-8 overflow-y-auto">
        <div className="w-full max-w-2xl space-y-6">
          {/* 상단 로고 (항상 중앙에 표시) */}
          <div className="flex justify-center">
            <AppLogo onClick={onLogoClick} />
          </div>

          {/* 단계별 인디케이터 */}
          {shouldShowProgress && (
            <div className="flex items-center justify-center mb-2">
              {steps.map((progressStep, index) => {
                const isActive = isStepActive(progressStep.key);
                const isComplete = isStepComplete(progressStep.key);
                const isLast = index === steps.length - 1;

                return (
                  <div key={progressStep.key} className="flex items-center">
                    {/* Step Circle */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          isComplete
                            ? 'bg-primary text-white'
                            : isActive
                              ? 'bg-primary text-white ring-4 ring-primary/20'
                              : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {isComplete ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <span className="font-semibold">{progressStep.number}</span>
                        )}
                      </div>
                      {/* Step Label */}
                      <span
                        className={`text-xs mt-2 whitespace-nowrap transition-colors ${
                          isActive || isComplete ? 'text-primary font-semibold' : 'text-muted-foreground'
                        }`}
                      >
                        {progressStep.label}
                      </span>
                    </div>

                    {/* Connector Line */}
                    {!isLast && (
                      <div className="w-20 h-0.5 mx-3 -mt-6">
                        <div
                          className={`h-full transition-all ${
                            isComplete ? 'bg-primary' : 'bg-gray-200'
                          }`}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 흰색 컨텐츠 박스 */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
