import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Admin Client
 *
 * Service Role Key를 사용하여 RLS(Row Level Security)를 우회하는 관리자 클라이언트
 * - auth.admin.deleteUser() 등 관리자 API 사용 가능
 * - 서버 사이드에서만 사용 (클라이언트 노출 금지)
 * - 회원가입 트랜잭션 롤백 등에 사용
 */
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
