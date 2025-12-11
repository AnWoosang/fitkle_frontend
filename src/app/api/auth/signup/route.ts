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
    const { email, password, nickname } = await request.json();

    console.log('[signup] 요청 데이터:', {
      email,
      nickname,
      passwordLength: password?.length
    });

    // Supabase Admin 클라이언트 사용 (Service Role Key)
    const supabase = supabaseAdmin;

    // 1단계: 회원가입 (이메일 확인 필요 상태로 생성)
    console.log('[signup] createUser 호출 시작');

    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false, // 이메일 인증 필요
      user_metadata: {
        nickname,
        role: 'user',
        display_name: nickname,
        has_completed_profile: false,
      },
    });

    console.log('[signup] createUser 완료:', {
      success: !!signUpData,
      hasError: !!signUpError,
      userId: signUpData?.user?.id
    });

    if (signUpError) {
      console.error('[signup] signUpError 발생!');
      console.error('[signup] 에러 메시지:', signUpError.message);
      console.error('[signup] 에러 상태:', signUpError.status);
      console.error('[signup] 전체 에러:', JSON.stringify(signUpError, null, 2));

      // 회원가입 실패 시 에러 코드에 따라 다른 메시지 반환
      if (signUpError.message.includes('already registered')) {
        return errorResponse(
          '이미 가입된 이메일입니다',
          HTTP_STATUS.CONFLICT,
          'EMAIL_ALREADY_EXISTS' as ApiErrorCode
        );
      }

      return errorResponse(
        signUpError.message,
        HTTP_STATUS.BAD_REQUEST,
        'SIGNUP_ERROR' as ApiErrorCode
      );
    }

    const user = signUpData.user;

    if (!user) {
      return errorResponse(
        '회원가입에 실패했습니다',
        HTTP_STATUS.INTERNAL_SERVER_ERROR,
        'SIGNUP_FAILED' as ApiErrorCode
      );
    }

    // 2단계: 이메일 OTP 발송
    console.log('[signup] OTP 발송 시작');
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      },
    });
    if (otpError) {
      console.error('[signup] OTP 발송 실패:', otpError);
    } else {
      console.log('[signup] OTP 발송 성공');
    }

    // member 테이블에는 나중에 추가 정보 입력 완료 후 저장
    // 지금은 Auth 사용자만 생성하고 이메일 인증 진행

    // 사용자 정보 반환
    const userResponse = {
      id: user.id,
      email: user.email!,
      nickname: nickname,
      role: user.user_metadata?.role || 'user',
      createdAt: user.created_at,
    };

    console.log('[signup] 응답 데이터 준비 완료:', userResponse);

    // 회원가입 성공 응답 (이메일 인증 안내)
    return successResponse(
      { user: userResponse },
      HTTP_STATUS.CREATED,
      '회원가입이 완료되었습니다. 이메일을 확인하여 인증을 완료해주세요.'
    );
  } catch (error: any) {
    console.error('============================================');
    console.error('[signup] CATCH 블록 진입!');
    console.error('[signup] 에러 타입:', error?.constructor?.name);
    console.error('[signup] 에러 메시지:', error?.message);
    console.error('[signup] 에러 코드:', error?.code);
    console.error('[signup] 에러 상태:', error?.status);
    console.error('[signup] 전체 에러 객체:', JSON.stringify(error, null, 2));
    console.error('[signup] 스택 트레이스:', error?.stack);
    console.error('============================================');

    return errorResponse(
      error?.message || '서버 오류가 발생했습니다',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
