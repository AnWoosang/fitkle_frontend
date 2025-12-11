/**
 * Event Host API Routes
 *
 * GET /api/events/:id/host - 이벤트 호스트 정보 조회
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
 * GET /api/events/:id/host
 *
 * 이벤트 호스트 정보 조회 (event + member 테이블 JOIN)
 *
 * @example
 * GET /api/events/123e4567-e89b-12d3-a456-426614174000/host
 *
 * Response:
 * {
 *   "id": "member-uuid",
 *   "name": "John Doe",
 *   "avatarUrl": "https://...",
 *   "bio": "Hello! I love meeting new people...",
 *   "isVerified": true,
 *   "hostedEvents": 15,
 *   "attendedEvents": 42
 * }
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    // 1. 이벤트 조회하여 host_member_id 가져오기
    const { data: eventData, error: eventError } = await supabase
      .from('event')
      .select('host_member_id')
      .eq('id', id)
      .single();

    if (eventError) {
      return handleSupabaseError(eventError, 'Failed to fetch event');
    }

    if (!eventData || !eventData.host_member_id) {
      return errorResponse(
        'Event or host not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    // 2. host member 정보 조회
    const { data: hostData, error: hostError } = await supabase
      .from('member')
      .select('id, name, avatar_url, bio, is_email_verified, is_phone_verified, hosted_events, attended_events')
      .eq('id', eventData.host_member_id)
      .single();

    if (hostError) {
      return handleSupabaseError(hostError, 'Failed to fetch host details');
    }

    if (!hostData) {
      return errorResponse(
        'Host not found',
        HTTP_STATUS.NOT_FOUND,
        ApiErrorCode.NOT_FOUND
      );
    }

    // 3. 데이터 변환
    const transformedHost = {
      id: hostData.id,
      name: hostData.name || 'Unknown',
      avatarUrl: hostData.avatar_url || undefined,
      bio: hostData.bio || undefined,
      isVerified: (hostData.is_email_verified && hostData.is_phone_verified) || false,
      hostedEvents: hostData.hosted_events || 0,
      attendedEvents: hostData.attended_events || 0,
    };

    return successResponse(transformedHost, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/events/:id/host',
      'Failed to fetch event host'
    );
  }
}
