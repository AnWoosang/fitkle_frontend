/**
 * Group Members API Routes
 *
 * GET /api/groups/:id/members - 그룹 멤버 목록 조회
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
 * GET /api/groups/:id/members
 *
 * 그룹 멤버 목록 조회 (group_member + member 테이블 JOIN)
 *
 * @example
 * GET /api/groups/123e4567-e89b-12d3-a456-426614174000/members
 *
 * Response:
 * [
 *   {
 *     "id": "member-uuid",
 *     "name": "John Doe",  // member.nickname을 name으로 매핑
 *     "avatarUrl": "https://...",
 *     "role": "admin",
 *     "joinedAt": "2024-01-01T00:00:00Z"
 *   }
 * ]
 */
export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    const supabase = await createSupabaseClientWithCookie();

    // 1. group_member 조회
    const { data: groupMembers, error: groupMembersError } = await supabase
      .from('group_member')
      .select('member_id, role, created_at')
      .eq('group_id', id);

    if (groupMembersError) {
      return handleSupabaseError(
        groupMembersError,
        'Failed to fetch group members'
      );
    }

    if (!groupMembers || groupMembers.length === 0) {
      return successResponse([], HTTP_STATUS.OK);
    }

    // 2. member_id 배열 추출
    const memberIds = groupMembers.map((gm: any) => gm.member_id);

    // 3. member 정보 조회 (name 사용)
    const { data: memberData, error: memberError } = await supabase
      .from('member')
      .select('id, name, avatar_url')
      .in('id', memberIds);

    if (memberError) {
      return handleSupabaseError(memberError, 'Failed to fetch member details');
    }

    // 4. 데이터 병합: group_member + member
    const memberMap = new Map(
      (memberData || []).map((m: any) => [m.id, m])
    );

    const members = groupMembers.map((gm: any) => {
      const member = memberMap.get(gm.member_id);
      return {
        id: gm.member_id,
        name: member?.name || 'Unknown',
        avatarUrl: member?.avatar_url || undefined,
        role: gm.role || 'member',
        joinedAt: gm.created_at,
      };
    });

    return successResponse(members, HTTP_STATUS.OK);
  } catch (error) {
    return logAndRespondError(
      error,
      'GET /api/groups/:id/members',
      'Failed to fetch group members'
    );
  }
}
