import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

/**
 * POST /api/auth/resend-otp
 *
 * 이메일 OTP 코드를 재발송합니다.
 *
 * Body:
 * {
 *   "email": string
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    console.log('[resend-otp] OTP 재발송 시도:', { email });

    if (!email) {
      return errorResponse(
        '이메일을 입력해주세요',
        HTTP_STATUS.BAD_REQUEST,
        'MISSING_EMAIL' as ApiErrorCode
      );
    }

    const supabase = await createSupabaseClientWithCookie();

    // Supabase OTP 재발송
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // 기존 사용자에게만 발송
      },
    });

    if (error) {
      console.error('[resend-otp] OTP 재발송 실패:', error);
      return errorResponse(
        'OTP 재발송에 실패했습니다',
        HTTP_STATUS.BAD_REQUEST,
        'RESEND_OTP_FAILED' as ApiErrorCode
      );
    }

    console.log('[resend-otp] OTP 재발송 성공');

    // 재발송 성공 응답
    return successResponse(
      { email },
      HTTP_STATUS.OK,
      '인증 코드가 재발송되었습니다'
    );
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return errorResponse(
      '서버 오류가 발생했습니다',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
