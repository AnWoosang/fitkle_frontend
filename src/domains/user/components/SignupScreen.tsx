'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSignupStep } from '@/domains/auth';
import {
  SignupLayout,
  SignupFormStep,
  EmailVerificationStep,
  PhoneVerificationStep,
  AdditionalInfoStep,
} from '@/domains/auth';
import type { SignupStep, SignupFormData, AdditionalInfoFormData } from '@/domains/auth';

interface SignupScreenProps {
  onBack: () => void;
}

export function SignupScreen({ onBack }: SignupScreenProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<SignupStep>('form');
  const [formData, setFormData] = useState<Partial<SignupFormData>>({});

  const { mutate: signup } = useSignupStep();

  // URL query parameter에서 step 읽기
  useEffect(() => {
    const stepParam = searchParams.get('step');

    if (stepParam === '2') {
      setStep('email-verify');
    } else if (stepParam === '3') {
      setStep('phone-verify');
    } else if (stepParam === '4') {
      setStep('additional-info');
    } else {
      setStep('form');
    }
  }, [searchParams]);

  // 폼 제출 (이메일 회원가입)
  const handleFormSubmit = (data: SignupFormData) => {
    console.log('[SignupScreen] 폼 제출 시작:', data);

    // 회원가입 API 호출 (이메일, 비밀번호, 닉네임만 전송)
    console.log('[SignupScreen] signup mutation 호출 직전');
    signup(
      {
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        nickname: data.nickname,
      },
      {
        onSuccess: (user) => {
          console.log('[SignupScreen] ✅ onSuccess 콜백 실행됨!');
          console.log('[SignupScreen] 회원가입 성공:', user);

          // 회원가입 성공 후 formData에 저장 (이메일 포함)
          setFormData(data);

          console.log('[SignupScreen] 다음 단계로 이동 시도: /signup?step=2');
          // 회원가입 성공 시 이메일 인증 단계로 이동 (이메일은 상태로 관리)
          router.push('/signup?step=2');
          console.log('[SignupScreen] router.push 호출 완료');
        },
        onError: (error) => {
          console.error('[SignupScreen] ❌ onError 콜백 실행됨!');
          console.error('[SignupScreen] 회원가입 실패:', error);
          alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
    console.log('[SignupScreen] signup mutation 호출 완료 (비동기 작업 진행 중)');
  };

  // 이메일 인증 완료 후 휴대폰 인증 단계로 이동
  const handleVerifyEmail = async (code: string) => {
    try {
      console.log('[SignupScreen] 이메일 인증 시도:', { email: formData.email, code });

      const url = '/api/auth/verify-email';
      const requestBody = {
        email: formData.email,
        token: code,
      };

      console.log('[SignupScreen] 요청 URL:', url);
      console.log('[SignupScreen] 요청 Body:', requestBody);
      console.log('[SignupScreen] 현재 브라우저 URL:', window.location.href);

      // 이메일 인증 API 호출
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('[SignupScreen] 응답 상태:', response.status, response.statusText);
      console.log('[SignupScreen] 응답 헤더:', Object.fromEntries(response.headers.entries()));

      const result = await response.json();
      console.log('[SignupScreen] 응답 데이터:', result);

      if (!response.ok) {
        throw new Error(result.error || '인증에 실패했습니다');
      }

      console.log('[SignupScreen] 이메일 인증 성공:', result);

      // 인증 성공 시 휴대폰 인증 단계로 이동 (URL 변경)
      router.push('/signup?step=3');
    } catch (error: any) {
      console.error('[SignupScreen] 이메일 인증 실패:', error);
      console.error('[SignupScreen] 에러 타입:', error.constructor.name);
      console.error('[SignupScreen] 에러 메시지:', error.message);
      console.error('[SignupScreen] 에러 스택:', error.stack);
      throw error;
    }
  };

  // 이메일 인증 코드 재발송
  const handleSendEmailCode = async () => {
    try {
      console.log('[SignupScreen] 이메일 인증 코드 재발송:', formData.email);

      const response = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'OTP 재발송에 실패했습니다');
      }

      console.log('[SignupScreen] OTP 재발송 성공:', result);
    } catch (error: any) {
      console.error('[SignupScreen] OTP 재발송 실패:', error);
      throw error;
    }
  };

  // 전화번호 인증 코드 발송
  const handleSendPhoneCode = async (phoneNumber: string) => {
    // TODO: API 연동
    console.log('전화번호 인증 코드 발송:', phoneNumber);
    return Promise.resolve();
  };

  // 휴대폰 인증 완료 또는 건너뛰기 후 추가 정보 입력 단계로 이동
  const handleVerifyPhone = async (phoneNumber?: string, code?: string) => {
    try {
      if (phoneNumber && code) {
        // TODO: 실제 휴대폰 인증 API 연동
        console.log('[SignupScreen] 전화번호 인증:', phoneNumber, code);
        // 인증 성공 시 전화번호를 formData에 저장
        setFormData((prev) => ({ ...prev, phone: phoneNumber }));
      } else {
        console.log('[SignupScreen] 전화번호 인증 건너뛰기');
      }

      // 휴대폰 인증 완료 후 추가 정보 입력 단계로 이동 (URL 변경)
      router.push('/signup?step=4');
    } catch (error) {
      console.error('[SignupScreen] 전화번호 인증 실패:', error);
      throw error;
    }
  };

  // 추가 정보 제출 후 회원가입 성공 페이지로 이동
  const handleAdditionalInfoSubmit = async (additionalData: AdditionalInfoFormData) => {
    console.log('[SignupScreen] 추가 정보 입력 완료:', additionalData);

    // 추가 정보를 formData에 저장
    setFormData((prev) => ({ ...prev, ...additionalData }));

    // 프로필 완성 API 호출
    await handleCompleteProfile(additionalData);
  };

  // 프로필 완성 (회원가입 최종 단계)
  const handleCompleteProfile = async (additionalData: AdditionalInfoFormData) => {
    try {
      console.log('[SignupScreen] 프로필 완성 시도:', additionalData);
      console.log('[SignupScreen] 현재 formData:', formData);

      // complete-profile API 호출
      const response = await fetch('/api/auth/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone: formData.phone, // 휴대폰 인증 단계에서 저장된 번호
          nationality: additionalData.nationality,
          gender: additionalData.gender,
          bio: additionalData.bio,
          languages: additionalData.languages,
          interests: additionalData.interests,
          preferences: additionalData.preferences,
          region: additionalData.region,
          district: additionalData.district,
          // account_settings 필드
          language: additionalData.language,
          contactPermission: additionalData.contactPermission,
          emailNotifications: additionalData.emailNotifications,
          pushNotifications: additionalData.pushNotifications,
          eventReminders: additionalData.eventReminders,
          groupUpdates: additionalData.groupUpdates,
          newsletterSubscription: additionalData.newsletterSubscription,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || '프로필 완성에 실패했습니다');
      }

      console.log('[SignupScreen] 프로필 완성 성공:', result);

      // 프로필 완성 성공 시 회원가입 성공 페이지로 이동 (이메일 정보 전달)
      router.push(`/signup-success?email=${encodeURIComponent(formData.email || '')}`);
    } catch (error: any) {
      console.error('[SignupScreen] 프로필 완성 실패:', error);
      alert('프로필 완성에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 뒤로 가기 처리
  const handleBackStep = () => {
    if (step === 'form') {
      // form 단계에서 뒤로가기 시 모달 닫기
      onBack();
    } else if (step === 'email-verify') {
      // 이메일 인증 단계에서 뒤로가기 시 기본 정보 입력으로
      router.push('/signup?step=1');
    } else if (step === 'phone-verify') {
      // 휴대폰 인증 단계에서 뒤로가기 시 이메일 인증으로
      router.push('/signup?step=2');
    } else if (step === 'additional-info') {
      // 추가 정보 입력 단계에서 뒤로가기 시 휴대폰 인증으로
      router.push('/signup?step=3');
    } else {
      onBack();
    }
  };

  // 로고 클릭 시 홈으로 이동 (상태 초기화)
  const handleLogoClick = () => {
    setStep('form');
    setFormData({});
    // setEmailForVerification(''); // 이메일 인증 주석 처리
    router.push('/');
  };

  return (
    <SignupLayout
      step={step}
      onBack={handleBackStep}
      onLogoClick={handleLogoClick}
      showProgress={true}
    >
      {step === 'form' && <SignupFormStep onSubmit={handleFormSubmit} />}

      {step === 'email-verify' && (
        <EmailVerificationStep
          email={formData.email || ''}
          onVerify={handleVerifyEmail}
          onResendCode={handleSendEmailCode}
        />
      )}

      {step === 'phone-verify' && (
        <PhoneVerificationStep onVerify={handleVerifyPhone} onSendCode={handleSendPhoneCode} />
      )}

      {step === 'additional-info' && <AdditionalInfoStep onSubmit={handleAdditionalInfoSubmit} />}
    </SignupLayout>
  );
}
