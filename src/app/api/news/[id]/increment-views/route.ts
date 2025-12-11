/**
 * News Increment Views API Route
 *
 * POST /api/news/:id/increment-views - 뉴스 조회수 증가
 */

import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  handleSupabaseError,
  logAndRespondError,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * POST /api/news/:id/increment-views
 *
 * 조회수를 1 증가시킵니다.
 *
 * @example
 * POST /api/news/84d9c9f1-c4bb-4147-b6bd-c0166ee1d527/increment-views
 */
export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    // 뉴스 존재 여부 및 현재 조회수 확인
    const { data: existingNews, error: fetchError } = await supabase
      .from('news')
      .select('view_count')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (fetchError || !existingNews) {
      return errorResponse(
        'News not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    const currentViewCount = existingNews.view_count || 0;
    const newViewCount = currentViewCount + 1;

    // 조회수 업데이트
    const { error: updateError } = await supabase
      .from('news')
      .update({ view_count: newViewCount })
      .eq('id', id);

    if (updateError) {
      return handleSupabaseError(updateError, 'Failed to increment view count');
    }

    return successResponse(
      { viewCount: newViewCount },
      HTTP_STATUS.OK,
      'View count incremented successfully'
    );
  } catch (error) {
    return logAndRespondError(
      error,
      'POST /api/news/:id/increment-views',
      'Failed to increment view count'
    );
  }
}
