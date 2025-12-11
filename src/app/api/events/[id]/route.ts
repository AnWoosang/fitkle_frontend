/**
 * Event Detail API Routes
 *
 * GET /api/events/:id - 단일 이벤트 조회
 * PUT /api/events/:id - 이벤트 수정
 * DELETE /api/events/:id - 이벤트 삭제
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
    format: dbEvent.type?.toUpperCase() || 'OFFLINE', // 'ONLINE' | 'OFFLINE'
    location: dbEvent.street_address, // address를 location으로 매핑
    address: dbEvent.street_address,
    groupId: dbEvent.group_id,
    groupName: dbEvent.group_name,
    description: dbEvent.description,
    hostName: dbEvent.host_name,
    hostId: dbEvent.host_member_id,
    createdAt: dbEvent.created_at,
    updatedAt: dbEvent.updated_at,
    detailAddress: dbEvent.detail_address,
    latitude: dbEvent.latitude,
    longitude: dbEvent.longitude,
    tags: dbEvent.tags || [],
    isGroupMembersOnly: dbEvent.is_group_members_only,
    // Computed fields
    type: dbEvent.group_id ? 'group' : 'personal',
  };
}

/**
 * GET /api/events/:id
 *
 * @example
 * GET /api/events/123e4567-e89b-12d3-a456-426614174000
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    const { data, error } = await supabase
      .from('event')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch event');
    }

    if (!data) {
      return errorResponse(
        'Event not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    // DB 응답을 프론트엔드 형식으로 변환
    const transformedData = transformEventFromDB(data);

    return successResponse(transformedData, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/events/:id',
      'Failed to fetch event'
    );
  }
}

/**
 * PUT /api/events/:id
 *
 * Body (선택적 필드들):
 * {
 *   "title": string,
 *   "date": string,
 *   "time": string,
 *   "type": 'online' | 'offline',
 *   "location": string (offline일 때 필수),
 *   "online_link": string (online일 때 필수),
 *   "max_attendees": number,
 *   "category": string,
 *   "image_url": string,
 *   "description": string,
 *   "address": string,
 *   "latitude": number,
 *   "longitude": number,
 *   "tags": string[]
 * }
 *
 * @example
 * PUT /api/events/123e4567-e89b-12d3-a456-426614174000
 * Content-Type: application/json
 * {
 *   "title": "Updated Event Title",
 *   "max_attendees": 20
 * }
 */
export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();
    const body = await request.json();

    // type 값 검증 (제공된 경우)
    if (body.type !== undefined && body.type !== 'online' && body.type !== 'offline') {
      return errorResponse(
        'type must be either "online" or "offline"',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    // type별 필수 필드 검증
    if (body.type === 'offline' && !body.location) {
      return errorResponse(
        'location is required for offline events',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    if (body.type === 'online' && !body.online_link) {
      return errorResponse(
        'online_link is required for online events',
        HTTP_STATUS.BAD_REQUEST,
        ApiErrorCode.VALIDATION_ERROR
      );
    }

    // 수정 가능한 필드만 추출
    const updateData: any = {};
    const allowedFields = [
      'title',
      'date',
      'time',
      'type',
      'location',
      'online_link',
      'max_attendees',
      'category',
      'description',
      'street_address',
      'latitude',
      'longitude',
      'tags',
      'host_name',
    ];

    allowedFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // image_url을 thumbnail_image_url로 매핑
    if (body.image_url !== undefined) {
      updateData.thumbnail_image_url = body.image_url;
    }

    // date와 time이 둘 다 제공된 경우 datetime으로 변환
    if (body.date !== undefined && body.time !== undefined) {
      updateData.datetime = `${body.date}T${body.time}:00+09:00`;
      // date, time 필드 제거 (DB에는 datetime만 있음)
      delete updateData.date;
      delete updateData.time;
    }

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

    // 이벤트 수정
    const { data, error } = await supabase
      .from('event')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, 'Failed to update event');
    }

    if (!data) {
      return errorResponse(
        'Event not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    return successResponse(data, HTTP_STATUS.OK, 'Event updated successfully');
  } catch (error) {
    return logAndRespondError(
      error,
      'PUT /api/events/:id',
      'Failed to update event'
    );
  }
}

/**
 * DELETE /api/events/:id
 *
 * @example
 * DELETE /api/events/123e4567-e89b-12d3-a456-426614174000
 */
export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    // 이벤트 존재 여부 확인
    const { data: existingEvent, error: fetchError } = await supabase
      .from('event')
      .select('id')
      .eq('id', id)
      .single();

    if (fetchError || !existingEvent) {
      return errorResponse(
        'Event not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    // 이벤트 삭제
    const { error: deleteError } = await supabase
      .from('event')
      .delete()
      .eq('id', id);

    if (deleteError) {
      return handleSupabaseError(deleteError, 'Failed to delete event');
    }

    return successResponse(
      { id },
      HTTP_STATUS.OK,
      'Event deleted successfully'
    );
  } catch (error) {
    return logAndRespondError(
      error,
      'DELETE /api/events/:id',
      'Failed to delete event'
    );
  }
}
