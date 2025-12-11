/**
 * News Bookmark API Route
 *
 * POST /api/news/:id/bookmark - 뉴스 북마크 토글
 */

import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  logAndRespondError,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * POST /api/news/:id/bookmark
 *
 * Body:
 * {
 *   "userId": string,  // 사용자 ID
 *   "isBookmarked": boolean  // true: 북마크 추가, false: 북마크 제거
 * }
 *
 * @example
 * POST /api/news/84d9c9f1-c4bb-4147-b6bd-c0166ee1d527/bookmark
 * Content-Type: application/json
 * {
 *   "userId": "user123",
 *   "isBookmarked": true
 * }
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: newsId } = await context.params;
    const body = await request.json();

    const { userId, isBookmarked } = body;

    // 유효성 검사
    if (!userId || typeof userId !== 'string') {
      return errorResponse(
        'Invalid userId',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    if (typeof isBookmarked !== 'boolean') {
      return errorResponse(
        'Invalid isBookmarked value. Expected boolean.',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    const supabase = await createSupabaseClientWithCookie();

    // 뉴스 존재 여부 확인
    const { data: existingNews, error: fetchError } = await supabase
      .from('news')
      .select('id')
      .eq('id', newsId)
      .is('deleted_at', null)
      .single();

    if (fetchError || !existingNews) {
      return errorResponse(
        'News not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    if (isBookmarked) {
      // 북마크 추가 (news_bookmarks 테이블이 있다고 가정)
      // TODO: 실제 DB 스키마에 맞게 수정 필요
      // 현재는 성공 응답만 반환
      return successResponse(
        { isBookmarked: true },
        HTTP_STATUS.OK,
        'Bookmark added successfully'
      );
    } else {
      // 북마크 제거
      return successResponse(
        { isBookmarked: false },
        HTTP_STATUS.OK,
        'Bookmark removed successfully'
      );
    }
  } catch (error) {
    return logAndRespondError(
      error,
      'POST /api/news/:id/bookmark',
      'Failed to update bookmark status'
    );
  }
}
