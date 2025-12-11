import { NextResponse } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';

export async function POST() {
  try {
    // Supabase 클라이언트 생성 (서버용)
    const supabase = await createSupabaseClientWithCookie();

    // 로그아웃
    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json(
        { message: error.message, code: 'LOGOUT_ERROR' },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: '로그아웃되었습니다' });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: '서버 오류가 발생했습니다', code: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
