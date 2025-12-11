/**
 * Event Images API Routes
 *
 * GET /api/events/:id/images - 이벤트 이미지 목록 조회
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
 * GET /api/events/:id/images
 *
 * 이벤트 이미지 목록 조회
 *
 * @example
 * GET /api/events/123e4567-e89b-12d3-a456-426614174000/images
 *
 * Response:
 * [
 *   {
 *     "id": "image-uuid",
 *     "imageUrl": "https://...",
 *     "caption": "Event photo",
 *     "displayOrder": 1,
 *     "createdAt": "2024-01-01T00:00:00Z"
 *   }
 * ]
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    // event_image 조회 (display_order로 정렬)
    const { data: images, error } = await supabase
      .from('event_image')
      .select('*')
      .eq('event_id', id)
      .is('deleted_at', null) // 삭제되지 않은 이미지만
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: true }); // display_order가 없으면 생성일순

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch event images');
    }

    // 데이터 변환
    const transformedImages = (images || []).map((img: any) => ({
      id: img.id,
      imageUrl: img.image_url,
      caption: img.caption || undefined,
      displayOrder: img.display_order,
      createdAt: img.created_at,
    }));

    return successResponse(transformedImages, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/events/:id/images',
      'Failed to fetch event images'
    );
  }
}
