/**
 * Group Events API Routes
 *
 * GET /api/groups/:id/events - 특정 그룹의 이벤트 목록 조회
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
 * DB 이벤트를 프론트엔드 형식으로 변환
 */
function transformEventFromDB(dbEvent: any) {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    description: dbEvent.description,
    datetime: dbEvent.datetime,
    street_address: dbEvent.street_address,
    detail_address: dbEvent.detail_address,
    latitude: dbEvent.latitude,
    longitude: dbEvent.longitude,
    attendees: dbEvent.attendees || 0,
    max_attendees: dbEvent.max_attendees,
    thumbnail_image_url: dbEvent.thumbnail_image_url || '/images/placeholder-event.jpg',
    group_id: dbEvent.group_id,
    group_name: dbEvent.group_name,
    host_member_id: dbEvent.host_member_id,
    host_name: dbEvent.host_name,
    type: dbEvent.type,
    is_group_members_only: dbEvent.is_group_members_only,
    event_category_id: dbEvent.event_category_id,
    created_at: dbEvent.created_at,
    updated_at: dbEvent.updated_at,
  };
}

/**
 * GET /api/groups/:id/events
 *
 * 특정 그룹의 이벤트 목록 조회
 *
 * @example
 * GET /api/groups/123e4567-e89b-12d3-a456-426614174000/events
 *
 * Response:
 * [
 *   {
 *     "id": "event-uuid",
 *     "title": "Weekend Climbing Session",
 *     "datetime": "2024-01-15T10:00:00Z",
 *     "address": "Seoul Climbing Center",
 *     ...
 *   }
 * ]
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    // 그룹의 이벤트 조회 (group_id로 필터링)
    const { data: events, error } = await supabase
      .from('event')
      .select('*')
      .eq('group_id', id)
      .order('datetime', { ascending: true }); // 날짜 순으로 정렬

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch group events');
    }

    // 데이터 변환
    const transformedEvents = (events || []).map(transformEventFromDB);

    return successResponse(transformedEvents, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/groups/:id/events',
      'Failed to fetch group events'
    );
  }
}
