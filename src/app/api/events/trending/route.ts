/**
 * Trending Events API Route
 *
 * GET /api/events/trending - 이번 주 인기 이벤트 조회
 */

import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
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

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    date,
    time,
    datetime: dbEvent.datetime,
    attendees: dbEvent.attendees,
    maxAttendees: dbEvent.max_attendees,
    image: dbEvent.thumbnail_image_url || '/images/placeholder-event.jpg',
    category: dbEvent.category,
    format: dbEvent.type?.toUpperCase() || 'OFFLINE',
    address: dbEvent.street_address,
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
    tags: dbEvent.tags || [],
    isGroupMembersOnly: dbEvent.is_group_members_only,
    type: dbEvent.group_id ? 'group' : 'personal',
    viewCount: dbEvent.view_count || 0,
  };
}

/**
 * GET /api/events/trending
 *
 * 인기 이벤트 조회 (attendees + view_count 기준 정렬)
 * 최대 8개 반환
 *
 * @example
 * GET /api/events/trending
 */
export async function GET() {
  try {
    const supabase = await createSupabaseClientWithCookie();

    // 이번 주 시작일 (월요일) 계산
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (일요일) ~ 6 (토요일)
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // 월요일로 조정
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diff);
    startOfWeek.setHours(0, 0, 0, 0);

    console.log('📅 [GET /api/events/trending] Week range:', {
      startOfWeek: startOfWeek.toISOString(),
      today: today.toISOString(),
    });

    // 인기 이벤트 조회
    // 정렬 기준: (attendees + view_count) 내림차순
    // 이번 주 이후 이벤트만 조회
    const { data, error } = await supabase
      .from('event')
      .select('*')
      .gte('datetime', startOfWeek.toISOString())
      .is('deleted_at', null)
      .order('attendees', { ascending: false })
      .order('view_count', { ascending: false })
      .limit(8);

    if (error) {
      console.error('🔴 [GET /api/events/trending] Supabase Error:', error);
      return handleSupabaseError(error, 'Failed to fetch trending events');
    }

    console.log('✅ [GET /api/events/trending] Raw data:', {
      count: data?.length || 0,
    });

    // DB 응답을 프론트엔드 형식으로 변환
    const transformedData = data?.map(transformEventFromDB) || [];

    console.log('✅ [GET /api/events/trending] Transformed events:', {
      count: transformedData.length,
      titles: transformedData.map((e: any) => `${e.title} (${e.attendees + e.viewCount})`),
    });

    return successResponse(transformedData, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/events/trending',
      'Failed to fetch trending events'
    );
  }
}
