import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
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
        'MISSING_FIELDS' as ApiErrorCode
      );
    }

    const supabase = supabaseAdmin;

    // OTP 토큰 검증
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      if (error.message.includes('expired')) {
        return errorResponse(
          '인증 코드가 만료되었습니다. 새로운 코드를 요청해주세요.',
          HTTP_STATUS.BAD_REQUEST,
          'OTP_EXPIRED' as ApiErrorCode
        );
      }

      if (error.message.includes('invalid')) {
        return errorResponse(
          '잘못된 인증 코드입니다',
          HTTP_STATUS.BAD_REQUEST,
          'INVALID_OTP' as ApiErrorCode
        );
      }

      return errorResponse(
        error.message,
        HTTP_STATUS.BAD_REQUEST,
        'OTP_VERIFICATION_FAILED' as ApiErrorCode
      );
    }

    if (!data.user || !data.session) {
      return errorResponse(
        '인증에 실패했습니다',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'VERIFICATION_FAILED' as ApiErrorCode
      );
    }

    // 인증 성공
    return successResponse(
      {
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_in: data.session.expires_in,
        },
      },
      HTTP_STATUS.OK,
      '이메일 인증이 완료되었습니다'
    );
  } catch (error: any) {
    console.error('OTP verification error:', error);
    return errorResponse(
      '서버 오류가 발생했습니다',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
