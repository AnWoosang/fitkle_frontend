/**
 * Interests API Route
 *
 * GET /api/interests - 관심사 목록 조회
 */

import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  handleSupabaseError,
  logAndRespondError,
  HTTP_STATUS,
} from '@/lib/api';

/**
 * 관심사 목록 조회
 *
 * @example
 * GET /api/interests
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();

    // 관심사 조회 (활성화된 것만, 정렬 순서대로)
    const { data, error } = await supabase
      .from('interests')
      .select('id, code, name, emoji, sort_order, category_code, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch interests');
    }

    // 관심사 데이터 변환
    const interests = (data || []).map((interest) => ({
      id: interest.id,
      code: interest.code,
      name_ko: interest.name,
      emoji: interest.emoji || '🎯',
      sort_order: interest.sort_order,
      category_code: interest.category_code,
    }));

    return successResponse(interests, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(error, 'GET /api/interests', 'Failed to fetch interests');
  }
}
