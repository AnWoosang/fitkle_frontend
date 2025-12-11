import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

export async function GET() {
  try {
    // Supabase 클라이언트 생성 (서버용 - 쿠키 기반)
    const supabase = await createSupabaseClientWithCookie();

    // 현재 사용자 정보 가져오기
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      return errorResponse(
        '인증되지 않은 사용자입니다',
        HTTP_STATUS.UNAUTHORIZED,
        ApiErrorCode.UNAUTHORIZED
      );
    }

    // member 테이블에서 추가 정보 가져오기
    const { data: member } = await supabase
      .from('member')
      .select('name, avatar_url')
      .eq('id', user.id)
      .single();

    // 사용자 정보 반환 (member 테이블 우선, 없으면 user_metadata 사용)
    const userResponse = {
      id: user.id,
      email: user.email!,
      nickname: member?.name || user.user_metadata?.nickname || '닉네임 없음',
      name: member?.name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
      profileImageUrl: member?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
    };

    return successResponse(userResponse, HTTP_STATUS.OK);
  } catch (error: any) {
    console.error('Get user error:', error);
    return errorResponse(
      '서버 오류가 발생했습니다',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
