'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { validateName } from '@/shared/validation/common';
import { Mail } from 'lucide-react';
import { SignupLayout, PhoneVerificationStep } from '@/domains/auth';

type CompleteProfileStep = 'form' | 'phone-verify';

function OnboardingContent() {
  const router = useRouter();

  const [step, setStep] = useState<CompleteProfileStep>('form');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [profileData, setProfileData] = useState<any>(null);

  // Supabase 세션에서 가져올 사용자 정보
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);

  // 이름 검증 상태
  const [nameError, setNameError] = useState('');

  useEffect(() => {
    // 사용자 정보 가져오기
    const getUserInfo = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        // 로그인되지 않은 경우 로그인 페이지로
        alert('로그인이 필요합니다.');
        router.push('/signup');
        return;
      }

      // userId와 email 설정
      setUserId(user.id);
      setEmail(user.email || '');

      // OAuth 제공자로부터 받은 이름 필드 자동 채우기
      const oauthName =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.user_metadata?.kakao_account?.profile?.nickname ||
        '';

      if (oauthName) {
        setName(oauthName);
        setUserName(oauthName);
      }
    };
    getUserInfo();
  }, [router]);

  const handleNameBlur = () => {
    const error = validateName(name);
    setNameError(error || '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userId) {
      alert('사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.');
      router.push('/signup');
      return;
    }

    // 이름 검증
    const nameValidationError = validateName(name);
    if (nameValidationError) {
      setNameError(nameValidationError);
      alert(nameValidationError);
      return;
    }

    setLoading(true);

    try {
      // Supabase 세션에서 사용자 정보 가져오기
      const { data: { user } } = await supabase.auth.getUser();

      // user_metadata에서 정보 추출
      const userMetadata = user?.user_metadata || {};
      const avatarUrl = userMetadata.avatar_url || userMetadata.picture || null;
      const fullName = userName || userMetadata.full_name || userMetadata.name || email?.split('@')[0] || '사용자';

      // auth_provider 결정 (Google, Kakao, 또는 Email)
      const authProvider =
        user?.app_metadata?.provider ||
        user?.app_metadata?.providers?.[0] ||
        (user?.identities?.[0]?.provider) ||
        'email';

      const memberData = {
        id: userId,
        email: email || user?.email || '',
        name: name || fullName,
        nationality: country,
        location: `${city}, ${country}`,
        avatar_url: avatarUrl,
        auth_provider: authProvider,
      };

      // 프로필 데이터 저장하고 휴대폰 인증 단계로 이동
      setProfileData(memberData);
      setStep('phone-verify');
    } catch (error: any) {
      console.error('❌ Onboarding 오류:', error);
      alert('오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 휴대폰 인증 코드 발송 핸들러
  const handleSendPhoneCode = async (phoneNumber: string) => {
    console.log('📱 휴대폰 인증 코드 발송:', phoneNumber);
    // TODO: 실제 SMS 발송 API 호출
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('✅ 인증 코드 발송 완료 (Mock)');
  };

  // 휴대폰 인증 완료 핸들러
  const handlePhoneVerified = async (phoneNumber?: string, code?: string) => {
    if (!profileData || !phoneNumber || !code) return;

    console.log('📱 휴대폰 인증 확인:', { phoneNumber, code });

    setLoading(true);
    try {
      // 휴대폰 번호 추가
      const memberDataWithPhone = {
        ...profileData,
        phone: phoneNumber,
      };

      // member 테이블에 추가 정보 저장
      const { data: insertedData, error } = await supabase
        .from('member')
        .insert(memberDataWithPhone)
        .select();

      if (error) {
        console.error('❌ Member 생성 실패:', error);
        console.error('에러 코드:', error.code);
        console.error('에러 메시지:', error.message);
        console.error('에러 상세:', error.details);

        if (error.code === '23505') {
          // Unique constraint violation
          alert('이미 등록된 정보입니다. 로그인 페이지로 이동합니다.');
          router.push('/login');
        } else {
          alert(`회원가입 중 오류가 발생했습니다: ${error.message}`);
        }
        return;
      }

      console.log('✅ Member 생성 성공:', insertedData);

      // 성공 시 홈으로 이동
      alert('환영합니다! 회원가입이 완료되었습니다.');
      router.push('/');
    } catch (error: any) {
      console.error('❌ Onboarding 오류:', error);
      alert('오류가 발생했습니다: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 'phone-verify') {
      setStep('form');
    } else {
      router.push('/signup');
    }
  };

  const handleLogoClick = () => {
    // 로고 클릭 시 회원가입 프로세스 취소하고 홈으로
    if (confirm('회원가입을 취소하고 홈으로 돌아가시겠습니까?')) {
      router.push('/');
    }
  };

  // 단계에 따른 SignupStep 타입 매핑
  const getSignupStep = () => {
    if (step === 'phone-verify') return 'phone-verify';
    return 'complete';
  };

  return (
    <SignupLayout
      step={getSignupStep() as any}
      onBack={handleBack}
      onLogoClick={handleLogoClick}
      showProgress={true}
    >
      {step === 'form' ? (
        <div className="w-full">
          {/* 타이틀 */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold mb-2">추가 정보 입력</h1>
            <p className="text-muted-foreground text-sm">
              환영합니다! 서비스 이용을 위해 추가 정보를 입력해주세요
            </p>
          </div>

          {/* Onboarding Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* 이메일 표시 */}
              {email && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">계정 이메일</Label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-lg border border-border">
                    <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm font-medium">{email}</span>
                  </div>
                </div>
              )}

              {/* 이름 */}
              <div className="space-y-2">
                <Label htmlFor="name">이름 *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="이름을 입력하세요"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setNameError('');
                  }}
                  onBlur={handleNameBlur}
                  className={nameError ? 'border-red-500' : ''}
                  required
                  maxLength={20}
                />
                {nameError && <p className="text-sm text-red-600">{nameError}</p>}
              </div>

              {/* 국가 */}
              <div className="space-y-2">
                <Label htmlFor="country">국가 *</Label>
                <select
                  id="country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                  required
                >
                  <option value="">국가를 선택하세요</option>
                  <option value="KR">한국 (South Korea)</option>
                  <option value="US">미국 (United States)</option>
                  <option value="JP">일본 (Japan)</option>
                  <option value="CN">중국 (China)</option>
                  <option value="VN">베트남 (Vietnam)</option>
                  <option value="TH">태국 (Thailand)</option>
                  <option value="SG">싱가포르 (Singapore)</option>
                  <option value="GB">영국 (United Kingdom)</option>
                  <option value="CA">캐나다 (Canada)</option>
                  <option value="AU">호주 (Australia)</option>
                </select>
              </div>

              {/* 도시 */}
              <div className="space-y-2">
                <Label htmlFor="city">도시 *</Label>
                <Input
                  id="city"
                  type="text"
                  placeholder="예: Seoul, New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-11"
                disabled={loading}
              >
                {loading ? '처리 중...' : '다음'}
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <PhoneVerificationStep
          onVerify={handlePhoneVerified}
          onSendCode={handleSendPhoneCode}
        />
      )}
    </SignupLayout>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <p>로딩 중...</p>
      </div>
    }>
      <OnboardingContent />
    </Suspense>
  );
}
