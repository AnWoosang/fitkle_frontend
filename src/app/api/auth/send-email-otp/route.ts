import { NextRequest } from 'next/server';
import {
  successResponse,
  errorResponse,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return errorResponse(
        '이메일을 입력해주세요',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(
        '올바른 이메일 형식이 아닙니다',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    // MOCK 구현: 실제로 이메일을 전송하지 않고 성공 응답만 반환
    console.log(`[MOCK] OTP 코드가 ${email}로 전송되었습니다 (실제 전송 없음)`);

    return successResponse(
      { email },
      HTTP_STATUS.OK,
      '인증 코드가 이메일로 전송되었습니다'
    );
  } catch (error: any) {
    console.error('Send email OTP error:', error);
    return errorResponse(
      '서버 오류가 발생했습니다',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
