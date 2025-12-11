/**
 * API 유틸리티 함수
 *
 * API Routes에서 공통으로 사용하는 헬퍼 함수들을 정의합니다.
 */

import { NextResponse } from 'next/server';
import type { PostgrestError } from '@supabase/supabase-js';
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  HTTP_STATUS,
  SUPABASE_ERROR_CODES,
  ApiErrorCode,
} from './types';

/**
 * 성공 응답 생성
 *
 * @param data - 응답 데이터
 * @param status - HTTP 상태 코드 (기본값: 200)
 * @param message - 추가 메시지 (선택)
 * @returns Next.js Response
 */
export function successResponse<T>(
  data: T,
  status: number = HTTP_STATUS.OK,
  message?: string
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status }
  );
}

/**
 * 에러 응답 생성
 *
 * @param error - 에러 메시지
 * @param status - HTTP 상태 코드 (기본값: 500)
 * @param code - 에러 코드 (선택)
 * @param details - 추가 상세 정보 (선택)
 * @returns Next.js Response
 */
export function errorResponse(
  error: string,
  status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  code?: string,
  details?: any
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false,
      error,
      code,
      details,
    },
    { status }
  );
}

/**
 * Supabase 에러를 API 에러 응답으로 변환
 *
 * @param error - Supabase PostgrestError
 * @param defaultMessage - 기본 에러 메시지
 * @returns Next.js Response
 */
export function handleSupabaseError(
  error: PostgrestError,
  defaultMessage: string = 'Database error occurred'
): NextResponse<ApiErrorResponse> {
  console.error('Supabase Error:', {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });

  // 데이터를 찾을 수 없음
  if (error.code === SUPABASE_ERROR_CODES.NOT_FOUND) {
    return errorResponse(
      'Resource not found',
      HTTP_STATUS.NOT_FOUND,
      ApiErrorCode.NOT_FOUND
    );
  }

  // 고유 제약 조건 위반 (중복 데이터)
  if (error.code === SUPABASE_ERROR_CODES.UNIQUE_VIOLATION) {
    return errorResponse(
      'Duplicate entry',
      HTTP_STATUS.CONFLICT,
      ApiErrorCode.DUPLICATE_ENTRY,
      { hint: error.hint }
    );
  }

  // 외래 키 제약 조건 위반
  if (error.code === SUPABASE_ERROR_CODES.FOREIGN_KEY_VIOLATION) {
    return errorResponse(
      'Referenced resource does not exist',
      HTTP_STATUS.BAD_REQUEST,
      ApiErrorCode.INVALID_OPERATION,
      { hint: error.hint }
    );
  }

  // CHECK 제약 조건 위반
  if (error.code === SUPABASE_ERROR_CODES.CHECK_VIOLATION) {
    return errorResponse(
      'Invalid value provided',
      HTTP_STATUS.BAD_REQUEST,
      ApiErrorCode.VALIDATION_ERROR,
      { hint: error.hint }
    );
  }

  // 기타 데이터베이스 에러
  return errorResponse(
    defaultMessage,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ApiErrorCode.DATABASE_ERROR,
    { code: error.code, hint: error.hint }
  );
}

/**
 * 요청 body에서 필수 필드 검증
 *
 * @param body - 요청 body
 * @param requiredFields - 필수 필드 목록
 * @returns 검증 결과 (에러 응답 또는 null)
 */
export function validateRequiredFields(
  body: any,
  requiredFields: string[]
): NextResponse<ApiErrorResponse> | null {
  const missingFields = requiredFields.filter((field) => !body[field]);

  if (missingFields.length > 0) {
    return errorResponse(
      `Missing required fields: ${missingFields.join(', ')}`,
      HTTP_STATUS.BAD_REQUEST,
      ApiErrorCode.VALIDATION_ERROR,
      { missingFields }
    );
  }

  return null;
}

/**
 * UUID 형식 검증
 *
 * @param id - 검증할 ID
 * @returns 유효한 UUID이면 true
 */
export function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

/**
 * UUID 검증 및 에러 응답 생성
 *
 * @param id - 검증할 ID
 * @param fieldName - 필드 이름 (에러 메시지용)
 * @returns 유효하지 않으면 에러 응답, 유효하면 null
 */
export function validateUUID(
  id: string,
  fieldName: string = 'ID'
): NextResponse<ApiErrorResponse> | null {
  if (!isValidUUID(id)) {
    return errorResponse(
      `Invalid ${fieldName} format. Expected UUID.`,
      HTTP_STATUS.BAD_REQUEST,
      ApiErrorCode.VALIDATION_ERROR
    );
  }
  return null;
}

/**
 * Enum 값 검증
 *
 * @param value - 검증할 값
 * @param allowedValues - 허용된 값 목록
 * @param fieldName - 필드 이름 (에러 메시지용)
 * @returns 유효하지 않으면 에러 응답, 유효하면 null
 */
export function validateEnum(
  value: string,
  allowedValues: string[],
  fieldName: string
): NextResponse<ApiErrorResponse> | null {
  if (!allowedValues.includes(value)) {
    return errorResponse(
      `Invalid ${fieldName}. Allowed values: ${allowedValues.join(', ')}`,
      HTTP_STATUS.BAD_REQUEST,
      ApiErrorCode.VALIDATION_ERROR,
      { allowedValues }
    );
  }
  return null;
}

/**
 * 에러를 로깅하고 응답 생성 (개발/프로덕션 환경 대응)
 *
 * @param error - 발생한 에러
 * @param context - 에러 발생 컨텍스트 (로깅용)
 * @param message - 사용자에게 보여줄 에러 메시지
 * @returns 에러 응답
 */
export function logAndRespondError(
  error: unknown,
  context: string,
  message: string = 'An error occurred'
): NextResponse<ApiErrorResponse> {
  // 에러 로깅
  console.error(`[${context}] Error:`, error);

  // 개발 환경에서는 상세한 에러 정보 포함
  if (process.env.NODE_ENV === 'development') {
    return errorResponse(
      message,
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR,
      {
        originalError: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      }
    );
  }

  // 프로덕션에서는 일반적인 에러 메시지만
  return errorResponse(
    message,
    HTTP_STATUS.INTERNAL_SERVER_ERROR,
    ApiErrorCode.INTERNAL_SERVER_ERROR
  );
}
