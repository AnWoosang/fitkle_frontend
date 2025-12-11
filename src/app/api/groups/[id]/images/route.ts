/**
 * Group Images API Routes
 *
 * GET /api/groups/:id/images - 그룹 이미지 목록 조회
 */

import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  handleSupabaseError,
  logAndRespondError,
  HTTP_STATUS,
} from '@/lib/api';

type RouteContext = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/groups/:id/images
 *
 * 그룹 이미지 목록 조회 (display_order 순서대로 정렬)
 *
 * @example
 * GET /api/groups/123e4567-e89b-12d3-a456-426614174000/images
 *
 * Response:
 * [
 *   {
 *     "id": "image-uuid",
 *     "groupId": "group-uuid",
 *     "imageUrl": "https://...",
 *     "caption": "Group photo",
 *     "displayOrder": 0,
 *     "createdAt": "2024-01-01T00:00:00Z"
 *   }
 * ]
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    const { data, error } = await supabase
      .from('group_image')
      .select('*')
      .eq('group_id', id)
      .order('display_order', { ascending: true });

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch group images');
    }

    // 데이터 변환: snake_case → camelCase
    const images = (data || []).map((item: any) => ({
      id: item.id,
      groupId: item.group_id,
      imageUrl: item.image_url,
      caption: item.caption || undefined,
      displayOrder: item.display_order || 0,
      createdAt: item.created_at,
    }));

    return successResponse(images, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/groups/:id/images',
      'Failed to fetch group images'
    );
  }
}
