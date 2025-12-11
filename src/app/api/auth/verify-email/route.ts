import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

/**
 * POST /api/auth/verify-email
 *
 * 이메일 인증 코드를 검증하고 사용자를 인증합니다.
 *
 * Body:
 * {
 *   "email": string,
 *   "token": string (6자리 OTP 코드)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const { email, token } = await request.json();

    console.log('[verify-email] 이메일 인증 시도:', { email, token });

    if (!email || !token) {
      return errorResponse(
        '이메일과 인증 코드를 입력해주세요',
        HTTP_STATUS.BAD_REQUEST,
        'MISSING_CREDENTIALS' as ApiErrorCode
      );
    }

    const supabase = await createSupabaseClientWithCookie();

    // Supabase OTP 검증
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      console.error('[verify-email] 인증 실패:', error);
      return errorResponse(
        '인증 코드가 올바르지 않거나 만료되었습니다',
        HTTP_STATUS.BAD_REQUEST,
        'INVALID_OTP' as ApiErrorCode
      );
    }

    if (!data.user) {
      return errorResponse(
        '인증에 실패했습니다',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'VERIFICATION_FAILED' as ApiErrorCode
      );
    }

    console.log('[verify-email] 인증 성공:', data.user.email);

    // 인증 성공 응답
    return successResponse(
      {
        user: {
          id: data.user.id,
          email: data.user.email!,
          nickname: data.user.user_metadata?.nickname,
          role: data.user.user_metadata?.role || 'user',
        },
        session: data.session,
      },
      HTTP_STATUS.OK,
      '이메일 인증이 완료되었습니다'
    );
  } catch (error: any) {
    console.error('Email verification error:', error);
    return errorResponse(
      '서버 오류가 발생했습니다',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
