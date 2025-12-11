/**
 * API 공통 타입 정의
 *
 * BFF API의 공통 응답 형식 및 유틸리티 타입을 정의합니다.
 */

/**
 * API 성공 응답
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * API 에러 응답
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

/**
 * API 응답 (성공 또는 에러)
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * 페이지네이션 메타데이터
 */
export interface PaginationMeta {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * 페이지네이션된 응답
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * API 에러 코드
 */
export enum ApiErrorCode {
  // 인증/권한 관련 (4xx)
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',

  // 서버 에러 (5xx)
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  EXTERNAL_API_ERROR = 'EXTERNAL_API_ERROR',

  // 비즈니스 로직 에러
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  RESOURCE_LIMIT_EXCEEDED = 'RESOURCE_LIMIT_EXCEEDED',
  INVALID_OPERATION = 'INVALID_OPERATION',
}

/**
 * HTTP 상태 코드 매핑
 */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Supabase 에러 코드 매핑
 */
export const SUPABASE_ERROR_CODES = {
  NOT_FOUND: 'PGRST116', // 데이터를 찾을 수 없음
  UNIQUE_VIOLATION: '23505', // 고유 제약 조건 위반
  FOREIGN_KEY_VIOLATION: '23503', // 외래 키 제약 조건 위반
  CHECK_VIOLATION: '23514', // CHECK 제약 조건 위반
} as const;
