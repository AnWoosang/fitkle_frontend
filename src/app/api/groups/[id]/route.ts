/**
 * Group Detail API Routes
 *
 * GET /api/groups/:id - 단일 그룹 조회
 * PUT /api/groups/:id - 그룹 수정
 * DELETE /api/groups/:id - 그룹 삭제
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
 * DB 그룹을 GroupResponseDto 형식으로 변환
 * DB 스키마의 snake_case를 그대로 유지 (route.ts와 동일)
 */
function transformGroupFromDB(dbGroup: any) {
  return {
    id: dbGroup.id,
    name: dbGroup.name,
    description: dbGroup.description,
    category: dbGroup.category,
    total_members: dbGroup.total_members, // DB 필드명 그대로 유지
    thumbnail_image_url: dbGroup.thumbnail_image_url || '/images/placeholder-group.jpg',
    host_name: dbGroup.host_name,
    host_id: dbGroup.host_id, // DB 필드명 그대로 유지
    event_count: dbGroup.event_count,
    location: dbGroup.location,
    requires_approval: dbGroup.requires_approval,
    tags: dbGroup.tags || [],
    created_at: dbGroup.created_at,
    updated_at: dbGroup.updated_at,
  };
}

/**
 * GET /api/groups/:id
 *
 * @example
 * GET /api/groups/123e4567-e89b-12d3-a456-426614174000
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    // 1. 그룹 기본 정보 조회
    const { data, error } = await supabase
      .from('group')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch group');
    }

    if (!data) {
      return errorResponse(
        'Group not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    // 2. 그룹 tags 조회 (group_tags + tags 테이블 JOIN)
    const { data: groupTags } = await supabase
      .from('group_tags')
      .select('tag_id, tags(name)')
      .eq('group_id', id);

    // tags 배열 생성
    const tags = groupTags?.map((gt: any) => gt.tags?.name).filter(Boolean) || [];

    // DB 응답을 프론트엔드 형식으로 변환 (tags 포함)
    const transformedData = {
      ...transformGroupFromDB(data),
      tags,
    };

    return successResponse(transformedData, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/groups/:id',
      'Failed to fetch group'
    );
  }
}

/**
 * PUT /api/groups/:id
 *
 * Body (선택적 필드들):
 * {
 *   "name": string,
 *   "description": string,
 *   "category": string,
 *   "location": string,
 *   "thumbnail_image_url": string,
 *   "tags": string[]
 * }
 *
 * @example
 * PUT /api/groups/123e4567-e89b-12d3-a456-426614174000
 * Content-Type: application/json
 * {
 *   "name": "Updated Group Name",
 *   "description": "Updated description"
 * }
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();
    const body = await request.json();

    // 수정 가능한 필드만 추출
    const updateData: any = {};
    const allowedFields = [
      'name',
      'description',
      'category',
      'location',
      'thumbnail_image_url',
      'tags',
      'host_name',
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

    // updated_at 자동 갱신
    updateData.updated_at = new Date().toISOString();

    // 그룹 수정
    const { data, error } = await supabase
      .from('group')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, 'Failed to update group');
    }

    if (!data) {
      return errorResponse(
        'Group not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    return successResponse(data, HTTP_STATUS.OK, 'Group updated successfully');
  } catch (error) {
    return logAndRespondError(
      error,
      'PUT /api/groups/:id',
      'Failed to update group'
    );
  }
}

/**
 * DELETE /api/groups/:id
 *
 * @example
 * DELETE /api/groups/123e4567-e89b-12d3-a456-426614174000
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    // 그룹 존재 여부 확인
    const { data: existingGroup, error: fetchError } = await supabase
      .from('group')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingGroup) {
      return errorResponse(
        'Group not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    // 그룹 삭제
    const { error: deleteError } = await supabase
      .from('group')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return handleSupabaseError(deleteError, 'Failed to delete group');
    }

    return successResponse(
      { id },
      HTTP_STATUS.OK,
      'Group deleted successfully'
    );
  } catch (error) {
    return logAndRespondError(
      error,
      'DELETE /api/groups/:id',
      'Failed to delete group'
    );
  }
}
