/**
 * News Like API Route
 *
 * POST /api/news/:id/like - 뉴스 좋아요 토글
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
 * POST /api/news/:id/like
 *
 * Body:
 * {
 *   "isLiked": boolean  // true: 좋아요 추가, false: 좋아요 취소
 * }
 *
 * @example
 * POST /api/news/84d9c9f1-c4bb-4147-b6bd-c0166ee1d527/like
 * Content-Type: application/json
 * {
 *   "isLiked": true
 * }
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();

    const { isLiked } = body;

    if (typeof isLiked !== 'boolean') {
      return errorResponse(
        'Invalid isLiked value. Expected boolean.',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    const supabase = await createSupabaseClientWithCookie();

    // 뉴스 존재 여부 및 현재 좋아요 수 확인
    const { data: existingNews, error: fetchError } = await supabase
      .from('news')
      .select('like_count')
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

    const currentLikeCount = existingNews.like_count || 0;
    const newLikeCount = isLiked
      ? currentLikeCount + 1
      : Math.max(0, currentLikeCount - 1); // 음수 방지

    // 좋아요 수 업데이트
    const { error: updateError } = await supabase
      .from('news')
      .update({ like_count: newLikeCount })
      .eq('id', id);

    if (updateError) {
      return handleSupabaseError(updateError, 'Failed to update like count');
    }

    return successResponse(
      { likeCount: newLikeCount },
      HTTP_STATUS.OK,
      'Like status updated successfully'
    );
  } catch (error) {
    return logAndRespondError(
      error,
      'POST /api/news/:id/like',
      'Failed to update like status'
    );
  }
}
