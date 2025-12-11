// React Query 키 정의
export const authKeys = {
  all: ['auth'] as const,
  user: () => [...authKeys.all, 'user'] as const,
  login: () => [...authKeys.all, 'login'] as const,
  signup: () => [...authKeys.all, 'signup'] as const,
  logout: () => [...authKeys.all, 'logout'] as const,
  refresh: () => [...authKeys.all, 'refresh'] as const,
  findPassword: () => [...authKeys.all, 'findPassword'] as const,
  resetPassword: () => [...authKeys.all, 'resetPassword'] as const,
  googleLogin: () => [...authKeys.all, 'googleLogin'] as const,
  kakaoLogin: () => [...authKeys.all, 'kakaoLogin'] as const,
} as const;
