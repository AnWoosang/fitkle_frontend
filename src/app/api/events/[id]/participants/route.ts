/**
 * Event Participants API Routes
 *
 * GET /api/events/:id/participants - 이벤트 참가자 목록 조회
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
 * GET /api/events/:id/participants
 *
 * 이벤트 참가자 목록 조회 (event_participant + member 테이블 JOIN)
 *
 * @example
 * GET /api/events/123e4567-e89b-12d3-a456-426614174000/participants
 *
 * Response:
 * [
 *   {
 *     "id": "member-uuid",
 *     "name": "John Doe",  // member.nickname을 name으로 매핑
 *     "avatarUrl": "https://...",
 *     "status": "confirmed",
 *     "joinedAt": "2024-01-01T00:00:00Z"
 *   }
 * ]
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    // 1. event_participant 조회
    const { data: eventParticipants, error: participantsError } = await supabase
      .from('event_participant')
      .select('member_id, status, created_at')
      .eq('event_id', id)
      .is('deleted_at', null); // 삭제되지 않은 참가자만

    if (participantsError) {
      return handleSupabaseError(
        participantsError,
        'Failed to fetch event participants'
      );
    }

    if (!eventParticipants || eventParticipants.length === 0) {
      return successResponse([], HTTP_STATUS.OK);
    }

    // 2. member_id 배열 추출
    const memberIds = eventParticipants.map((ep: any) => ep.member_id);

    // 3. member 정보 조회 (name 사용)
    const { data: memberData, error: memberError } = await supabase
      .from('member')
      .select('id, name, avatar_url')
      .in('id', memberIds);

    if (memberError) {
      return handleSupabaseError(memberError, 'Failed to fetch member details');
    }

    // 4. 데이터 병합: event_participant + member
    const memberMap = new Map(
      (memberData || []).map((m: any) => [m.id, m])
    );

    const participants = eventParticipants.map((ep: any) => {
      const member = memberMap.get(ep.member_id);
      return {
        id: ep.member_id,
        name: member?.name || 'Unknown',
        avatarUrl: member?.avatar_url || undefined,
        status: ep.status || 'confirmed',
        joinedAt: ep.created_at,
      };
    });

    return successResponse(participants, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/events/:id/participants',
      'Failed to fetch event participants'
    );
  }
}
