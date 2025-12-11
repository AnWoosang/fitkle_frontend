/**
 * My Groups API Route
 *
 * GET /api/groups/my-groups - 현재 사용자가 호스트인 그룹 조회
 */

import { NextRequest } from 'next/server';
import { createSupabaseClientWithCookie } from '@/lib/supabase/server';
import {
  successResponse,
  handleSupabaseError,
  logAndRespondError,
  HTTP_STATUS,
  errorResponse,
} from '@/lib/api';

/**
 * DB 그룹을 GroupResponseDto 형식으로 변환 (snake_case 유지)
 * 실제 도메인 모델 변환은 프론트엔드의 Mapper에서 처리
 * 카테고리는 클라이언트 사이드에서 조인
 */
function transformGroupFromDB(dbGroup: any) {
  return {
    id: dbGroup.id,
    name: dbGroup.name,
    description: dbGroup.description,
    categoryId: dbGroup.group_category_id, // 카테고리 ID만 반환 (클라이언트 사이드 조인)
    total_members: dbGroup.total_members,
    thumbnail_image_url: dbGroup.thumbnail_image_url || '/images/placeholder-group.jpg',
    host_name: dbGroup.host_name,
    host_id: dbGroup.host_id,
    event_count: dbGroup.event_count,
    location: dbGroup.location,
    requires_approval: dbGroup.requires_approval,
    created_at: dbGroup.created_at,
    updated_at: dbGroup.updated_at,
  };
}

/**
 * GET /api/groups/my-groups
 *
 * 현재 로그인한 사용자가 호스트이거나 멤버로 참여 중인 그룹 조회
 * 1. 호스트인 그룹 조회
 * 2. group_member 테이블을 통해 참여 중인 그룹 조회
 * 3. 중복 제거 후 반환
 *
 * @example
 * GET /api/groups/my-groups
 */
export async function GET(_request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();

    // 현재 로그인한 사용자 정보 가져오기
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse(
        'Unauthorized',
        HTTP_STATUS.UNAUTHORIZED,
        'UNAUTHORIZED',
        { authError: authError?.message }
      );
    }

    console.log('🔍 [GET /api/groups/my-groups] Fetching groups for user:', user.id);

    // 1. 호스트인 그룹 조회
    const { data: hostedGroups, error: hostedError } = await supabase
      .from('group')
      .select('*')
      .eq('host_id', user.id)
      .order('created_at', { ascending: false });

    if (hostedError) {
      console.error('❌ [GET /api/groups/my-groups] Error fetching hosted groups:', hostedError);
      return handleSupabaseError(hostedError, 'Failed to fetch hosted groups');
    }

    console.log('✅ [GET /api/groups/my-groups] Hosted groups:', hostedGroups?.length || 0);

    // 2. group_member 테이블을 통해 참여 중인 그룹 조회
    const { data: memberData, error: memberError } = await supabase
      .from('group_member')
      .select(`
        group:group_id (
          id,
          name,
          description,
          group_category_id,
          total_members,
          thumbnail_image_url,
          host_name,
          host_id,
          event_count,
          location,
          requires_approval,
          created_at,
          updated_at
        )
      `)
      .eq('member_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false });

    if (memberError) {
      console.error('❌ [GET /api/groups/my-groups] Error fetching member groups:', memberError);
      return handleSupabaseError(memberError, 'Failed to fetch member groups');
    }

    // group 데이터 추출
    const joinedGroups = memberData
      ?.map((item: any) => item.group)
      .filter((group: any) => group !== null) || [];

    console.log('✅ [GET /api/groups/my-groups] Joined groups:', joinedGroups.length);

    // 3. 중복 제거 (호스트인 그룹과 멤버인 그룹이 겹칠 수 있음)
    const allGroups = [...(hostedGroups || []), ...joinedGroups];
    const uniqueGroups = Array.from(
      new Map(allGroups.map((group) => [group.id, group])).values()
    );

    console.log('✅ [GET /api/groups/my-groups] Total unique groups:', uniqueGroups.length);

    // DB 응답을 프론트엔드 형식으로 변환
    const transformedData = uniqueGroups.map(transformGroupFromDB);

    return successResponse(transformedData, HTTP_STATUS.OK);
  } catch (error) {
    console.error('❌ [GET /api/groups/my-groups] Exception:', error);
    return logAndRespondError(error, 'GET /api/groups/my-groups', 'Failed to fetch my groups');
  }
}
