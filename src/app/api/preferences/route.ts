/**
 * Preferences API Route
 *
 * GET /api/preferences - 선호 카테고리 목록 조회
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
 * 선호 카테고리 목록 조회
 *
 * @example
 * GET /api/preferences
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();

    // 선호 카테고리 조회 (활성화된 것만, 정렬 순서대로)
    const { data, error } = await supabase
      .from('preference')
      .select('id, code, name, emoji, sort_order, is_active')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch preferences');
    }

    // 선호 카테고리 데이터 변환
    const preferences = (data || []).map((pref) => ({
      id: pref.id,
      code: pref.code,
      name: pref.name,
      emoji: pref.emoji || '📌',
      sort_order: pref.sort_order,
    }));

    return successResponse(preferences, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(error, 'GET /api/preferences', 'Failed to fetch preferences');
  }
}
