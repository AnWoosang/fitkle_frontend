/**
 * News Detail API Routes
 *
 * GET /api/news/:id - 단일 뉴스 조회
 * PUT /api/news/:id - 뉴스 수정 (관리자 전용)
 * DELETE /api/news/:id - 뉴스 삭제 (관리자 전용)
 */

import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  handleSupabaseError,
  validateEnum,
  logAndRespondError,
  HTTP_STATUS,
  ApiErrorCode,
} from '@/lib/api';

const NEWS_CATEGORIES = ['ANNOUNCEMENT', 'INFORMATION', 'COMMUNICATION'];

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/news/:id
 *
 * @example
 * GET /api/news/84d9c9f1-c4bb-4147-b6bd-c0166ee1d527
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    // deleted_at이 null인 뉴스만 조회
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .is('deleted_at', null)
      .single();

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch news');
    }

    if (!data) {
      return errorResponse(
        'News not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    return successResponse(data, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/news/:id',
      'Failed to fetch news'
    );
  }
}

/**
 * PUT /api/news/:id
 *
 * Body (선택적 필드들):
 * {
 *   "title": string,
 *   "content": string,
 *   "author": string,
 *   "category": 'ANNOUNCEMENT' | 'INFORMATION' | 'COMMUNICATION',
 *   "thumbnail_image_url": string,
 *   "like_count": number
 * }
 *
 * @example
 * PUT /api/news/84d9c9f1-c4bb-4147-b6bd-c0166ee1d527
 * Content-Type: application/json
 * {
 *   "title": "Updated title",
 *   "content": "Updated content..."
 * }
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // TODO: 관리자 권한 체크
    // const isAdmin = await checkAdminPermission(request);
    // if (!isAdmin) {
    //   return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    // }

    const supabase = await createSupabaseClientWithCookie();
    const body = await request.json();

    // 수정 가능한 필드만 추출
    const updateData: any = {};
    const allowedFields = [
      'title',
      'content',
      'author',
      'category',
      'thumbnail_image_url',
      'like_count',
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // 업데이트할 필드가 없는 경우
    if (Object.keys(updateData).length === 0) {
      return errorResponse(
        'No fields to update',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    // Category 검증
    if (updateData.category) {
      const categoryError = validateEnum(
        updateData.category,
        NEWS_CATEGORIES,
        'category'
      );
      if (categoryError) {
        return categoryError;
      }
    }

    // 뉴스 수정
    const { data, error } = await supabase
      .from('news')
      .update(updateData)
      .eq('id', id)
      .is('deleted_at', null)
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, 'Failed to update news');
    }

    if (!data) {
      return errorResponse(
        'News not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    return successResponse(data, HTTP_STATUS.OK, 'News updated successfully');
  } catch (error) {
    return logAndRespondError(
      error,
      'PUT /api/news/:id',
      'Failed to update news'
    );
  }
}

/**
 * DELETE /api/news/:id
 * Soft delete (deleted_at 필드만 업데이트)
 *
 * @example
 * DELETE /api/news/84d9c9f1-c4bb-4147-b6bd-c0166ee1d527
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    // TODO: 관리자 권한 체크
    // const isAdmin = await checkAdminPermission(_request);
    // if (!isAdmin) {
    //   return errorResponse('Unauthorized', HTTP_STATUS.UNAUTHORIZED);
    // }

    const supabase = await createSupabaseClientWithCookie();

    // 뉴스 존재 여부 확인 (이미 삭제되지 않은 것만)
    const { data: existingNews, error: fetchError } = await supabase
      .from('news')
      .select('id')
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

    // Soft delete: deleted_at 필드 업데이트
    const { error: deleteError } = await supabase
      .from('news')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (deleteError) {
      return handleSupabaseError(deleteError, 'Failed to delete news');
    }

    return successResponse(
      { id },
      HTTP_STATUS.OK,
      'News deleted successfully'
    );
  } catch (error) {
    return logAndRespondError(
      error,
      'DELETE /api/news/:id',
      'Failed to delete news'
    );
  }
}
