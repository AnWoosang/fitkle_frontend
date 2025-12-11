import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseRouteHandlerClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const { client: supabase, cookieStore } = createSupabaseRouteHandlerClient(request);

    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        const response = NextResponse.redirect(
          new URL('/?error=oauth_failed', request.url)
        );
        cookieStore.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        return response;
      }

      const user = data.user;

      const { data: member, error: memberError } = await supabase
        .from('member')
        .select()
        .eq('id', user.id)
        .single();

      if (!member && memberError?.code === 'PGRST116') {
        const completeProfileUrl = new URL('/complete-profile', request.url);
        completeProfileUrl.searchParams.set('user_id', user.id);
        completeProfileUrl.searchParams.set('email', user.email || '');
        const response = NextResponse.redirect(completeProfileUrl);
        cookieStore.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        return response;
      }

      if (memberError && memberError.code !== 'PGRST116') {
        const response = NextResponse.redirect(
          new URL('/?error=member_check_failed', request.url)
        );
        cookieStore.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
        return response;
      }

      const response = NextResponse.redirect(new URL(next, request.url));
      cookieStore.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    } catch (error: any) {
      const response = NextResponse.redirect(
        new URL('/?error=callback_error', request.url)
      );
      cookieStore.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    }
  }

  return NextResponse.redirect(
    new URL('/?error=no_auth_code', request.url)
  );
}
