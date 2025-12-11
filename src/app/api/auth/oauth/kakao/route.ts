import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server';

/**
 * 카카오 OAuth 로그인 시작
 * - Supabase Auth signInWithOAuth 호출
 * - OAuth URL 반환하여 클라이언트에서 리다이렉트
 */
export async function POST(request: NextRequest) {
  try {
    const { client: supabase, cookieStore } = createSupabaseRouteHandlerClient(request);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || request.headers.get('origin')}/auth/callback`,
      },
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!data.url) {
      return NextResponse.json(
        { error: 'OAuth URL 생성 실패' },
        { status: 500 }
      );
    }

    // OAuth URL 반환
    const response = NextResponse.json({ url: data.url });

    // 쿠키 설정
    cookieStore.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    return response;
  } catch (error: any) {
    console.error('Kakao OAuth 에러:', error);
    return NextResponse.json(
      { error: error.message || '카카오 로그인 처리 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
