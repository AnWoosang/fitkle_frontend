import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Supabase 클라이언트 생성 (서버용)
    const supabase = await createSupabaseClientWithCookie();

    // Supabase Auth로 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // 로그인 실패 시 에러 코드에 따라 다른 메시지 반환
      if (error.message.includes('Invalid login credentials')) {
        return errorResponse(
          '이메일 또는 비밀번호가 올바르지 않습니다',
          HTTP_STATUS.UNAUTHORIZED,
          'INVALID_CREDENTIALS' as ApiErrorCode
        );
      }

      if (error.message.includes('Email not confirmed')) {
        return errorResponse(
          '이메일 인증이 필요합니다',
          HTTP_STATUS.FORBIDDEN,
          'EMAIL_NOT_VERIFIED' as ApiErrorCode
        );
      }

      return errorResponse(
        error.message,
        HTTP_STATUS.BAD_REQUEST,
        'LOGIN_ERROR' as ApiErrorCode
      );
    }

    // 사용자 정보 추출
    const user = data.user;
    const session = data.session;

    if (!user || !session) {
      return errorResponse(
        '로그인에 실패했습니다',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'LOGIN_FAILED' as ApiErrorCode
      );
    }

    // 사용자 정보 반환 (user_metadata에서 추가 정보 가져오기)
    const userResponse = {
      id: user.id,
      email: user.email!,
      nickname: user.user_metadata?.nickname,
      name: user.user_metadata?.name,
      profileImageUrl: user.user_metadata?.profile_image_url,
      role: user.user_metadata?.role || 'user',
      country: user.user_metadata?.country,
      createdAt: user.created_at,
    };

    return successResponse(
      {
        user: userResponse,
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_in: session.expires_in,
          expires_at: session.expires_at,
        },
      },
      HTTP_STATUS.OK,
      '로그인되었습니다'
    );
  } catch (error: any) {
    console.error('Login error:', error);
    return errorResponse(
      '서버 오류가 발생했습니다',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
