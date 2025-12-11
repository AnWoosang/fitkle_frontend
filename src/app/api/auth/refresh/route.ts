import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

export async function POST() {
  try {
    // Supabase 클라이언트 생성 (서버용)
    const supabase = await createSupabaseClientWithCookie();

    // 세션 갱신 (Supabase가 자동으로 쿠키에서 refresh_token을 읽어서 갱신)
    const { data, error } = await supabase.auth.refreshSession();

    if (error || !data.session) {
      return errorResponse(
        '세션 갱신에 실패했습니다',
        HTTP_STATUS.UNAUTHORIZED,
        'REFRESH_TOKEN_EXPIRED' as ApiErrorCode
      );
    }

    const user = data.user;
    const session = data.session;

    if (!user) {
      return errorResponse(
        '사용자 정보를 가져올 수 없습니다',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    // member 테이블에서 사용자 상세 정보 가져오기
    const { data: member, error: memberError } = await supabase
      .from('member')
      .select('name, avatar_url, country')
      .eq('id', user.id)
      .single();

    if (memberError) {
      console.error('Failed to fetch member data:', memberError);
    }

    // 사용자 정보 반환 (member 테이블 우선, 없으면 user_metadata fallback)
    const userResponse = {
      id: user.id,
      email: user.email!,
      nickname: member?.name || user.user_metadata?.nickname || '닉네임 없음',
      name: member?.name || user.user_metadata?.name || user.email?.split('@')[0] || '사용자',
      profileImageUrl: member?.avatar_url || user.user_metadata?.avatar_url || user.user_metadata?.picture,
      role: user.user_metadata?.role || 'user',
      country: member?.country || user.user_metadata?.country,
      createdAt: user.created_at,
    };

    return successResponse(
      {
        user: userResponse,
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_in: session.expires_in,
        },
      },
      HTTP_STATUS.OK,
      '세션이 갱신되었습니다'
    );
  } catch (error: any) {
    console.error('Refresh token error:', error);
    return errorResponse(
      '서버 오류가 발생했습니다',
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      ApiErrorCode.INTERNAL_SERVER_ERROR
    );
  }
}
