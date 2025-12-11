/**
 * My Events API Route
 *
 * GET /api/events/my-events - 사용자가 RSVP한 이벤트 조회 (status='confirmed')
 */

import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  errorResponse,
  handleSupabaseError,
  logAndRespondError,
  HTTP_STATUS,
} from '@/lib/api';

/**
 * DB 이벤트를 프론트엔드 형식으로 변환
 */
function transformEventFromDB(dbEvent: any) {
  // datetime을 date와 time으로 분리
  const datetime = new Date(dbEvent.datetime);
  const date = datetime.toISOString().split('T')[0]; // YYYY-MM-DD
  const time = datetime.toTimeString().slice(0, 5); // HH:MM

  // event_categories 조인 데이터에서 카테고리명 추출
  const categoryName = dbEvent.event_categories?.name || '';

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    date,
    time,
    datetime: dbEvent.datetime,
    attendees: dbEvent.attendees,
    maxAttendees: dbEvent.max_attendees,
    image: dbEvent.thumbnail_image_url || '/images/placeholder-event.jpg',
    category: categoryName,
    format: dbEvent.type?.toUpperCase() || 'OFFLINE',
    streetAddress: dbEvent.street_address,
    detailAddress: dbEvent.detail_address,
    groupId: dbEvent.group_id,
    groupName: dbEvent.group_name,
    description: dbEvent.description,
    hostName: dbEvent.host_name,
    hostId: dbEvent.host_member_id,
    createdAt: dbEvent.created_at,
    updatedAt: dbEvent.updated_at,
    latitude: dbEvent.latitude,
    longitude: dbEvent.longitude,
    tags: [],
    isGroupMembersOnly: dbEvent.is_group_members_only,
    type: dbEvent.group_id ? 'group' : 'personal',
  };
}

/**
 * GET /api/events/my-events
 *
 * 현재 로그인한 사용자가 RSVP한 이벤트 중 status='confirmed'인 이벤트만 조회
 * event_participant 테이블 JOIN 사용
 *
 * @example
 * GET /api/events/my-events
 */
export async function GET() {
  try {
    const supabase = await createSupabaseClientWithCookie();

    // 현재 사용자 정보 가져오기
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return errorResponse(
        'Authentication required',
        HTTP_STATUS.UNAUTHORIZED
      );
    }

    // event_participant 테이블과 JOIN하여 사용자가 RSVP한 이벤트 조회
    // status='confirmed'인 것만 필터링
    // event_categories와 JOIN하여 카테고리 정보 가져오기
    const { data, error } = await supabase
      .from('event_participant')
      .select(`
        event:event_id (
          id,
          title,
          datetime,
          attendees,
          max_attendees,
          thumbnail_image_url,
          event_category_id,
          event_categories!event_category_id (
            id,
            name,
            code,
            emoji
          ),
          type,
          street_address,
          detail_address,
          group_id,
          group_name,
          description,
          host_name,
          host_member_id,
          created_at,
          updated_at,
          latitude,
          longitude,
          is_group_members_only
        )
      `)
      .eq('member_id', user.id)
      .eq('status', 'confirmed')
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('🔴 [GET /api/events/my-events] Supabase Error:', error);
      return handleSupabaseError(error, 'Failed to fetch my events');
    }

    console.log('✅ [GET /api/events/my-events] Raw data:', {
      count: data?.length || 0,
      userId: user.id,
    });

    // event 데이터 추출 및 변환
    const events = data
      ?.map((item: any) => item.event)
      .filter((event: any) => event !== null) // null 이벤트 제거
      .map(transformEventFromDB) || [];

    console.log('✅ [GET /api/events/my-events] Transformed events:', {
      count: events.length,
      titles: events.map((e: any) => e.title),
    });

    return successResponse(events, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/events/my-events',
      'Failed to fetch my events'
    );
  }
}
