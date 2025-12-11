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
    const { email, type } = await request.json();

    if (!email) {
      return errorResponse(
        '이메일 주소가 필요합니다',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.BAD_REQUEST
      );
    }

    const supabase = supabaseAdmin;

    // Supabase Auth의 resend 기능 사용 (OTP 방식)
    // type에 따라 다른 이메일 타입 전송
    const emailType = type === 'signup' ? 'signup' : 'email_change';

    const { error } = await supabase.auth.resend({
      type: emailType,
      email: email,
      options: {
        emailRedirectTo: undefined, // OTP 방식은 리다이렉트 URL 불필요
      },
    });

    if (error) {
      console.error('Resend email error:', error);

      if (error.message.includes('already confirmed')) {
        return errorResponse(
          '이미 인증이 완료된 이메일입니다',
          HTTP_STATUS.BAD_REQUEST,
          'ALREADY_CONFIRMED' as ApiErrorCode
        );
      }

      if (error.message.includes('rate limit')) {
        return errorResponse(
          '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요',
          HTTP_STATUS.TOO_MANY_REQUESTS,
          'RATE_LIMIT' as ApiErrorCode
        );
      }

      return errorResponse(
        '이메일 발송에 실패했습니다',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        ApiErrorCode.INTERNAL_SERVER_ERROR
      );
    }

    return successResponse(
      { email },
      HTTP_STATUS.OK,
      '인증 메일이 다시 발송되었습니다. 이메일을 확인해주세요.'
    );
  } catch (error: any) {
    console.error('Resend email error:', error);
    return errorResponse(
      '서버 오류가 발생했습니다',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
