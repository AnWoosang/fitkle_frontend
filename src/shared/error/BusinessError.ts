// 비즈니스 로직 에러 클래스
export class BusinessError extends Error {
  code: string;
  statusCode?: number;
  details?: Record<string, any>;

  constructor(
    message: string,
    code: string = 'BUSINESS_ERROR',
    statusCode?: number,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'BusinessError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;

    // TypeScript의 Error 클래스 상속 시 필요
    Object.setPrototypeOf(this, BusinessError.prototype);
  }

  // 에러가 BusinessError 인스턴스인지 확인
  static isBusinessError(error: any): error is BusinessError {
    return error instanceof BusinessError;
  }

  // API 에러 응답을 BusinessError로 변환
  static fromApiError(error: any): BusinessError {
    // axios interceptor가 이미 error.response.data를 추출해서 reject한 경우
    if (error.success === false && error.error) {
      return new BusinessError(
        error.error || '오류가 발생했습니다',
        error.code || 'API_ERROR',
        undefined,
        error.details
      );
    }

    // axios interceptor를 거치지 않은 원본 에러인 경우
    if (error.response?.data) {
      const { message, code, statusCode, details } = error.response.data;
      return new BusinessError(
        message || '오류가 발생했습니다',
        code || 'API_ERROR',
        statusCode || error.response.status,
        details
      );
    }

    return new BusinessError(
      error.message || '알 수 없는 오류가 발생했습니다',
      'UNKNOWN_ERROR'
    );
  }
}

// 인증 관련 에러 코드
export const AUTH_ERROR_CODES = {
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  EMAIL_NOT_VERIFIED: 'EMAIL_NOT_VERIFIED',
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS: 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD: 'WEAK_PASSWORD',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  REFRESH_TOKEN_EXPIRED: 'REFRESH_TOKEN_EXPIRED',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;
