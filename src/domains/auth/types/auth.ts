// 사용자 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  nickname?: string; // 닉네임 (선택)
  profileImageUrl?: string;
  role?: 'user' | 'admin';
  country?: string; // 국가 (선택)
  city?: string; // 도시 (선택)
  createdAt?: string;
}

// 로그인 폼 데이터
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

// 회원가입 폼 데이터 (기본 정보만)
export interface SignupForm {
  nickname: string; // 이름/닉네임 (필수) - member.name에 저장됨
  email: string;
  password: string;
  confirmPassword: string; // 비밀번호 확인 (필수)
}

// 프로필 업데이트 폼 데이터 (추가 정보)
export interface UpdateProfileForm {
  nationality: string; // 국적 (필수)
  languages: string[]; // 사용 언어 (필수)
  interests: string[]; // 관심사 ID 목록 (필수)
  location: string; // 지역 (필수) - "구/군, 시/도" 형식
}

// 세션 정보
export interface AuthSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  user: User;
}

// 비밀번호 찾기 폼
export interface FindPasswordForm {
  email: string;
}

// 비밀번호 재설정 폼
export interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}
