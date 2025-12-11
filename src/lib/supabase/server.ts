import { createClient } from '@supabase/supabase-js'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// 브라우저용 클라이언트 (기존)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server Component용 클라이언트 (쿠키 기반 인증)
export async function createSupabaseClientWithCookie() {
  const cookieStore = await cookies()

  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, {
              ...options,
              httpOnly: true,      // JavaScript 접근 차단 (XSS 방어)
              secure: true,        // HTTPS에서만 전송
              sameSite: 'lax',     // CSRF 방어
            })
          })
        }
      },
      cookieOptions: {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
      }
    }
  )
}

/**
 * Route Handler용 Supabase 클라이언트 생성
 * @param request - NextRequest 객체
 * @returns client와 cookieStore를 포함한 객체
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *   const { client: supabase, cookieStore } = createSupabaseRouteHandlerClient(request)
 *
 *   const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'kakao' })
 *
 *   const response = NextResponse.json({ url: data.url })
 *   cookieStore.forEach(({ name, value, options }) => {
 *     response.cookies.set(name, value, options)
 *   })
 *   return response
 * }
 * ```
 */
export function createSupabaseRouteHandlerClient(request: NextRequest) {
  const cookieStore: { name: string; value: string; options: CookieOptions }[] = []

  const client = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.push({ name, value, options })
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.push({ name, value: '', options })
        },
      },
    }
  )

  return { client, cookieStore }
}

export default supabase
