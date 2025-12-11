import { NextRequest } from 'next/server';
import {
  successResponse,
  errorResponse,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    if (!email || !token) {
      return errorResponse(
        '이메일과 인증 코드를 입력해주세요',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    // 인증 코드가 6자리 숫자인지 검증
    if (!/^\d{6}$/.test(token)) {
      return errorResponse(
        '인증 코드는 6자리 숫자여야 합니다',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    // MOCK 구현: 아무 6자리 숫자나 입력하면 인증 성공으로 처리
    console.log(`[MOCK] ${email}의 인증 코드 ${token} 검증 완료 (실제 검증 없음)`);

    // 검증 성공
    return successResponse(
      {
        email,
        verified: true,
      },
      HTTP_STATUS.OK,
      '이메일 인증이 완료되었습니다'
    );
  } catch (error: any) {
    console.error('Verify email OTP error:', error);
    return errorResponse(
      '서버 오류가 발생했습니다',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
