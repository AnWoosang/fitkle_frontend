/**
 * 공통 검증 함수 모음
 * Pickdam의 검증 로직을 참고하여 구현
 */

// Email validation
export const validateEmail = (email: string): string | null => {
  if (!email || !email.trim()) {
    return 'Please enter your email';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }

  return null;
};

// Password validation
export const validatePassword = (
  password: string
): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (!password || password.length === 0) {
    return {
      isValid: false,
      errors: ['Please enter your password'],
    };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!/[A-Za-z]/.test(password)) {
    errors.push('Must include letters');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Must include numbers');
  }

  if (!/[!@#$%^&*(),.?":{}|<>~]/.test(password)) {
    errors.push('Must include special characters');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Password confirmation validation
export const validatePasswordConfirm = (
  password: string,
  confirmPassword: string
): string | null => {
  if (!confirmPassword || confirmPassword.length === 0) {
    return 'Please confirm your password';
  }

  if (password !== confirmPassword) {
    return 'Passwords do not match';
  }

  return null;
};

// 비밀번호 강도 측정
export type PasswordStrength = 'very-weak' | 'weak' | 'medium' | 'strong' | 'very-strong';

export interface PasswordStrengthResult {
  strength: PasswordStrength;
  score: number;
  label: string;
  color: string;
}

export const checkPasswordStrength = (password: string): PasswordStrengthResult => {
  let score = 0;

  // 길이 점수
  if (password.length >= 8) {
    score += 25;
  } else if (password.length >= 6) {
    score += 15;
  }

  // 소문자 포함
  if (/[a-z]/.test(password)) {
    score += 15;
  }

  // 대문자 포함
  if (/[A-Z]/.test(password)) {
    score += 15;
  }

  // 숫자 포함
  if (/[0-9]/.test(password)) {
    score += 20;
  }

  // 특수문자 포함
  if (/[!@#$%^&*(),.?":{}|<>~]/.test(password)) {
    score += 25;
  }

  // Strength evaluation
  let strength: PasswordStrength;
  let label: string;
  let color: string;

  if (score >= 80) {
    strength = 'very-strong';
    label = 'Very Strong';
    color = 'text-green-600';
  } else if (score >= 60) {
    strength = 'strong';
    label = 'Strong';
    color = 'text-blue-600';
  } else if (score >= 40) {
    strength = 'medium';
    label = 'Medium';
    color = 'text-yellow-600';
  } else if (score >= 20) {
    strength = 'weak';
    label = 'Weak';
    color = 'text-orange-600';
  } else {
    strength = 'very-weak';
    label = 'Very Weak';
    color = 'text-red-600';
  }

  return { strength, score, label, color };
};

// 이름 검증
export const validateName = (name: string): string | null => {
  if (!name || !name.trim()) {
    return '이름을 입력해주세요';
  }

  if (/\s/.test(name)) {
    return '이름에 공백을 포함할 수 없어요';
  }

  if (name.length < 2) {
    return '이름은 최소 2자 이상이어야 해요';
  }

  if (name.length > 20) {
    return '이름은 최대 20자까지 가능해요';
  }

  // 한글만 입력한 경우
  const isKorean = /^[가-힣]+$/.test(name);
  // 영문만 입력한 경우
  const isEnglish = /^[a-zA-Z]+$/.test(name);

  if (!isKorean && !isEnglish) {
    return '이름은 한글 또는 영문으로만 입력해주세요';
  }

  return null;
};

// 국가/도시 검증
export const validateLocation = (country: string, city: string): {
  countryError: string | null;
  cityError: string | null;
} => {
  const countryError = !country || !country.trim() ? '국가를 선택해주세요' : null;
  const cityError = !city || !city.trim() ? '도시를 선택해주세요' : null;

  return { countryError, cityError };
};

// Nickname validation
export const validateNickname = (nickname: string): string | null => {
  if (!nickname || !nickname.trim()) {
    return 'Please enter your nickname';
  }

  if (nickname.length < 2) {
    return 'Nickname must be at least 2 characters';
  }

  if (nickname.length > 20) {
    return 'Nickname must be at most 20 characters';
  }

  // Allow English, Korean, numbers, and underscores
  const nicknameRegex = /^[a-zA-Z0-9가-힣_]+$/;
  if (!nicknameRegex.test(nickname)) {
    return 'Nickname can only contain letters, numbers, and underscores';
  }

  return null;
};
