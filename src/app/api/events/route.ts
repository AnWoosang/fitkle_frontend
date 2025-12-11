/**
 * Event API Routes
 *
 * GET /api/events - 전체 이벤트 조회 또는 필터링된 이벤트 조회
 * POST /api/events - 새 이벤트 생성
 */

import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  handleSupabaseError,
  validateRequiredFields,
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
    // 카테고리 ID만 반환 (클라이언트에서 조인)
    categoryId: dbEvent.event_category_id,
    format: dbEvent.type?.toUpperCase() || 'OFFLINE', // 'ONLINE' | 'OFFLINE'
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
    tags: dbEvent.tags || [],
    isGroupMembersOnly: dbEvent.is_group_members_only,
    // Computed fields
    type: dbEvent.group_id ? 'group' : 'personal',
  };
}

/**
 * GET /api/events
 *
 * Query Parameters:
 * - type: 'all' | 'group' | 'personal' (선택) - 그룹/개인 구분
 * - format: 'all' | 'online' | 'offline' (선택) - 온라인/오프라인 구분
 * - category: string (선택)
 * - location: string (선택, LIKE 검색)
 * - searchQuery: string (선택, title LIKE 검색)
 * - date: 'all' | 'today' | 'thisWeek' | 'thisMonth' (선택) - 날짜 필터
 * - page: number (선택, 기본값: 1) - 페이지 번호
 * - limit: number (선택, 기본값: 20) - 페이지당 아이템 수
 *
 * @example
 * GET /api/events
 * GET /api/events?type=group&category=cafe
 * GET /api/events?format=online
 * GET /api/events?format=offline&searchQuery=seoul&location=gangnam
 * GET /api/events?date=today
 * GET /api/events?date=thisWeek&category=FITNESS
 * GET /api/events?page=2&limit=20
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 추출
    const type = searchParams.get('type') || 'all';
    const format = searchParams.get('format') || 'all';
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const searchQuery = searchParams.get('searchQuery');
    const date = searchParams.get('date');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log('[GET /api/events] Query Params:', { type, format, category, location, searchQuery, date, page, limit });

    // Supabase 쿼리 빌더 시작 (카테고리 JOIN 제거 - 클라이언트 사이드에서 처리)
    // count 옵션 추가하여 전체 개수 가져오기
    // 안정적인 정렬을 위해 created_at + id로 정렬 (같은 시간 생성 시 순서 보장)
    let query = supabase
      .from('event')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    // Type 필터 적용 (그룹/개인)
    if (type !== 'all') {
      if (type === 'group') {
        query = query.not('group_id', 'is', null);
      } else if (type === 'personal') {
        query = query.is('group_id', null);
      }
    }

    // Format 필터 적용 (온라인/오프라인)
    if (format !== 'all') {
      if (format === 'online' || format === 'offline') {
        query = query.eq('type', format);
      }
    }

    // Category 필터 적용 (code 기반)
    if (category && category !== 'all') {
      // 먼저 해당 code를 가진 카테고리 ID 조회
      const { data: categoryData } = await supabase
        .from('event_categories')
        .select('id')
        .eq('code', category)
        .single();

      if (categoryData) {
        query = query.eq('event_category_id', categoryData.id);
      }
    }

    // Location 필터 적용 (LIKE 검색) - address 필드 사용
    if (location) {
      query = query.ilike('street_address', `%${location}%`);
    }

    // Search Query 필터 적용 (title LIKE 검색)
    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    // Date 필터 적용 (today, thisWeek, thisMonth)
    if (date && date !== 'all') {
      const now = new Date();
      let startDate: Date | null = null;

      if (date === 'today') {
        // 오늘 0시부터
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      } else if (date === 'thisWeek') {
        // 이번 주 일요일부터 (0 = Sunday)
        const dayOfWeek = now.getDay();
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek, 0, 0, 0, 0);
      } else if (date === 'thisMonth') {
        // 이번 달 1일부터
        startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
      }

      if (startDate) {
        query = query.gte('datetime', startDate.toISOString());
      }
    }

    // 페이징 처리
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 쿼리 실행 (페이징 적용)
    const { data, error, count } = await query.range(from, to);

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch events');
    }

    // DB 응답을 프론트엔드 형식으로 변환
    const transformedData = data?.map(transformEventFromDB) || [];

    // 페이징 정보 포함하여 응답
    return successResponse({
      data: transformedData,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: (page * limit) < (count || 0), // 현재까지 로드한 개수 < 총 개수
      },
    }, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(error, 'GET /api/events', 'Failed to fetch events');
  }
}

/**
 * POST /api/events
 *
 * Body:
 * {
 *   "title": string (필수),
 *   "date": string (필수),
 *   "time": string (필수),
 *   "type": 'online' | 'offline' (필수),
 *   "online_link": string (online일 때 필수),
 *   "max_attendees": number (필수),
 *   "category": string (필수),
 *   "host_member_id": string (필수),
 *   "image_url": string (선택),
 *   "description": string (선택),
 *   "group_id": string (선택),
 *   "address": string (offline일 때 필수 - 주소),
 *   "detail_address": string (선택 - 상세 주소),
 *   "latitude": number (선택),
 *   "longitude": number (선택),
 *   "tags": string[] (선택)
 * }
 *
 * @example
 * POST /api/events (Offline)
 * Content-Type: application/json
 * {
 *   "title": "Coffee Chat in Gangnam",
 *   "date": "2025-11-15",
 *   "time": "14:00",
 *   "type": "offline",
 *   "address": "서울 강남구",
 *   "detail_address": "테헤란로 123",
 *   "max_attendees": 10,
 *   "category": "cafe",
 *   "host_member_id": "user-uuid-here"
 * }
 *
 * @example
 * POST /api/events (Online)
 * Content-Type: application/json
 * {
 *   "title": "Online Coding Workshop",
 *   "date": "2025-11-20",
 *   "time": "19:00",
 *   "type": "online",
 *   "online_link": "https://zoom.us/j/123456789",
 *   "max_attendees": 50,
 *   "category": "culture",
 *   "host_member_id": "user-uuid-here"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();
    const body = await request.json();

    // 기본 필수 필드 검증
    const basicValidationError = validateRequiredFields(body, [
      'title',
      'date',
      'time',
      'type',
      'max_attendees',
      'category',
      'host_member_id',
    ]);

    if (basicValidationError) {
      return basicValidationError;
    }

    // type 값 검증
    if (body.type !== 'online' && body.type !== 'offline') {
      return logAndRespondError(
        new Error('Invalid type'),
        'POST /api/events',
        'type must be either "online" or "offline"'
      );
    }

    // type별 필수 필드 검증
    if (body.type === 'offline' && !body.street_address) {
      return logAndRespondError(
        new Error('Missing address'),
        'POST /api/events',
        'address is required for offline events'
      );
    }

    if (body.type === 'online' && !body.online_link) {
      return logAndRespondError(
        new Error('Missing online_link'),
        'POST /api/events',
        'online_link is required for online events'
      );
    }

    // 카테고리 code로 ID 조회
    const { data: categoryData, error: categoryError } = await supabase
      .from('event_categories')
      .select('id')
      .eq('code', body.category)
      .single();

    if (categoryError || !categoryData) {
      return logAndRespondError(
        categoryError || new Error('Category not found'),
        'POST /api/events',
        `Invalid category code: ${body.category}`
      );
    }

    // date와 time을 datetime으로 결합
    const datetimeStr = `${body.date}T${body.time}:00+09:00`; // KST timezone

    // 이벤트 데이터 준비
    const eventData = {
      title: body.title,
      datetime: datetimeStr, // DB: datetime (timestamptz)
      type: body.type,
      online_link: body.online_link || null,
      max_attendees: body.max_attendees,
      event_category_id: categoryData.id, // 카테고리 UUID
      host_member_id: body.host_member_id,
      attendees: 0, // 초기값
      thumbnail_image_url: body.image_url || null, // DB: thumbnail_image_url
      description: body.description || null,
      group_id: body.group_id || null,
      address: body.street_address || null,
      detail_address: body.detail_address || null,
      latitude: body.latitude || null,
      longitude: body.longitude || null,
      tags: body.tags || [],
      host_name: body.host_name || null,
    };

    // 이벤트 생성
    const { data, error } = await supabase
      .from('event')
      .insert([eventData])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, 'Failed to create event');
    }

    return successResponse(data, HTTP_STATUS.CREATED, 'Event created successfully');
  } catch (error) {
    return logAndRespondError(error, 'POST /api/events', 'Failed to create event');
  }
}
