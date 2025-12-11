export type SignupMethod = 'email' | 'google' | 'kakao' | 'apple';
export type SignupStep = 'method' | 'form' | 'email-verify' | 'phone-verify' | 'additional-info' | 'complete';

export interface SignupFormData {
  nickname: string; // 이름/닉네임 (member.name에 저장됨)
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string; // 휴대폰 번호 (PhoneVerificationStep에서 입력)
  nationality?: string;
  gender?: 'MALE' | 'FEMALE' | 'PREFER_NOT_TO_SAY';
  bio?: string; // 자기소개 (최대 2000자)
  languages?: string[];
  interests?: string[];
  region?: string; // 지역 (시/도)
  district?: string; // 구/군
}

export interface AdditionalInfoFormData {
  nationality: string;
  gender: 'MALE' | 'FEMALE' | 'PREFER_NOT_TO_SAY';
  bio?: string; // 자기소개 (선택, 최대 2000자)
  languages: string[];
  interests: string[]; // 관심사 (내부 데이터 관리용)
  preferences: string[]; // 선호 카테고리 (그룹/이벤트 추천용)
  region: string; // 지역 (시/도)
  district: string; // 구/군
  // account_settings 관련
  language: string; // UI 언어 (국가 코드: KR, US, JP 등)
  contactPermission: 'ANYONE' | 'EVENT_OR_GROUP_MEMBERS' | 'EVENT_MEMBERS_ONLY' | 'GROUP_MEMBERS_ONLY' | 'NONE';
  emailNotifications: boolean;
  pushNotifications: boolean;
  eventReminders: boolean;
  groupUpdates: boolean;
  newsletterSubscription: boolean;
}

export interface SignupState {
  method: SignupMethod | null;
  step: SignupStep;
  formData: Partial<SignupFormData>;
  emailVerified: boolean;
  phoneVerified: boolean;
  phoneNumber: string;
}
