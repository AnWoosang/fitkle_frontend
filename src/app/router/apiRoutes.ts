// API 엔드포인트 상수 정의
// baseURL이 /api로 설정되어 있으므로 /api를 제외한 경로만 정의
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
    FIND_PASSWORD: '/auth/find-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_EMAIL: '/auth/resend-email',
    CHECK_EMAIL: '/auth/check-email',
    CHECK_NICKNAME: '/auth/check-nickname',
    SEND_EMAIL_OTP: '/auth/send-email-otp',
    VERIFY_EMAIL_OTP: '/auth/verify-email-otp',
    OAUTH_GOOGLE: '/auth/oauth/google',
    OAUTH_KAKAO: '/auth/oauth/kakao',
  },
  EVENTS: {
    LIST: '/events',
    DETAIL: (id: string) => `/events/${id}`,
    CREATE: '/events',
    UPDATE: (id: string) => `/events/${id}`,
    DELETE: (id: string) => `/events/${id}`,
  },
  GROUPS: {
    LIST: '/groups',
    DETAIL: (id: string) => `/groups/${id}`,
    CREATE: '/groups',
    UPDATE: (id: string) => `/groups/${id}`,
    DELETE: (id: string) => `/groups/${id}`,
  },
  NEWS: {
    LIST: '/news',
    DETAIL: (id: string) => `/news/${id}`,
  },
} as const;
