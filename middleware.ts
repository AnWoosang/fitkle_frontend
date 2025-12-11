import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 라우트는 middleware에서 제외 (supabase 세션 체크 불필요)
  if (pathname.startsWith('/api/')) {
    console.log('[middleware] API 라우트 요청, 바로 통과:', pathname);
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // 현재 사용자 세션 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { searchParams } = request.nextUrl;

  // 회원가입 페이지인 경우
  if (pathname === '/signup') {
    // 로그인되어 있으면서 회원가입 진행 중인 경우
    if (user) {
      const emailConfirmed = !!user.email_confirmed_at;
      const hasCompletedProfile = user.user_metadata?.has_completed_profile === true;

      // 이미 완전히 가입 완료된 사용자는 홈으로 리다이렉트
      if (emailConfirmed && hasCompletedProfile) {
        return NextResponse.redirect(new URL('/', request.url));
      }

      // 이메일 미인증 사용자 → step=2로 강제 이동
      if (!emailConfirmed) {
        const currentStep = searchParams.get('step');
        if (currentStep !== '2') {
          const url = new URL('/signup', request.url);
          url.searchParams.set('step', '2');
          return NextResponse.redirect(url);
        }
      }

      // 이메일 인증됨 + 프로필 미완성 → step=3으로 강제 이동
      if (emailConfirmed && !hasCompletedProfile) {
        const currentStep = searchParams.get('step');
        if (currentStep !== '3') {
          const url = new URL('/signup', request.url);
          url.searchParams.set('step', '3');
          return NextResponse.redirect(url);
        }
      }
    }
  }

  // 보호된 라우트 (로그인 필요)
  const protectedRoutes = [
    '/profile',
    '/settings',
    '/my-events',
    '/my-groups',
    '/messages',
    '/events/create',
    '/groups/create',
  ];

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute) {
    // 로그인 안되어 있으면 홈으로 리다이렉트 (로그인 모달 표시)
    if (!user) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    // 로그인은 되어 있지만 이메일 미인증 → 이메일 인증 단계로 리다이렉트
    if (!user.email_confirmed_at) {
      const url = new URL('/signup', request.url);
      url.searchParams.set('step', '2');
      return NextResponse.redirect(url);
    }

    // 이메일 인증은 되었지만 프로필 미완성 → 추가 정보 입력 단계로 리다이렉트
    if (user.user_metadata?.has_completed_profile !== true) {
      const url = new URL('/signup', request.url);
      url.searchParams.set('step', '3');
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 대해 실행:
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘)
     * - public 폴더의 파일들
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
