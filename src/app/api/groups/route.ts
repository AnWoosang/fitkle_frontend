/**
 * Group API Routes
 *
 * GET /api/groups - 전체 그룹 조회 또는 필터링된 그룹 조회
 * POST /api/groups - 새 그룹 생성
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
 * DB 그룹을 GroupResponseDto 형식으로 변환
 * DB 스키마의 snake_case를 그대로 유지
 */
function transformGroupFromDB(dbGroup: any) {
  return {
    id: dbGroup.id,
    name: dbGroup.name,
    description: dbGroup.description,
    // 카테고리 ID만 반환 (클라이언트에서 조인)
    categoryId: dbGroup.group_category_id,
    total_members: dbGroup.total_members, // DB 필드명 그대로 유지
    thumbnail_image_url: dbGroup.thumbnail_image_url || '/images/placeholder-group.jpg',
    host_name: dbGroup.host_name,
    host_id: dbGroup.host_id, // DB 필드명 그대로 유지
    event_count: dbGroup.event_count,
    location: dbGroup.location,
    requires_approval: dbGroup.requires_approval,
    tags: dbGroup.tags || [],
    created_at: dbGroup.created_at,
    updated_at: dbGroup.updated_at,
  };
}

/**
 * GET /api/groups
 *
 * Query Parameters:
 * - category: string (선택)
 * - location: string (선택, LIKE 검색)
 * - searchQuery: string (선택, name LIKE 검색)
 * - date: 'all' | 'today' | 'thisWeek' | 'thisMonth' (선택) - 생성 날짜 필터
 * - page: number (선택, 기본값: 1) - 페이지 번호
 * - limit: number (선택, 기본값: 20) - 페이지당 아이템 수
 *
 * @example
 * GET /api/groups
 * GET /api/groups?category=맛집
 * GET /api/groups?searchQuery=seoul
 * GET /api/groups?date=thisWeek
 * GET /api/groups?page=2&limit=20
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();
    const searchParams = request.nextUrl.searchParams;

    // 쿼리 파라미터 추출
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const searchQuery = searchParams.get('searchQuery');
    const date = searchParams.get('date');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    console.log('[GET /api/groups] Query Params:', { category, location, searchQuery, date, page, limit });

    // Supabase 쿼리 빌더 시작 (카테고리 JOIN 제거 - 클라이언트 사이드에서 처리)
    // count 옵션 추가하여 전체 개수 가져오기
    // 안정적인 정렬을 위해 created_at + id로 정렬 (같은 시간 생성 시 순서 보장)
    let query = supabase
      .from('group')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .order('id', { ascending: false });

    // Category 필터 적용 (code 기반)
    if (category && category !== 'all') {
      // 먼저 해당 code를 가진 카테고리 ID 조회
      const { data: categoryData } = await supabase
        .from('group_categories')
        .select('id')
        .eq('code', category)
        .single();

      if (categoryData) {
        query = query.eq('group_category_id', categoryData.id);
      }
    }

    // Location 필터 적용 (LIKE 검색)
    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    // Search Query 필터 적용 (name LIKE 검색)
    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`);
    }

    // Date 필터 적용 (created_at 기준)
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
        query = query.gte('created_at', startDate.toISOString());
      }
    }

    // Verified 필터는 DB에 is_verified 컬럼이 없으므로 제거됨
    // TODO: 향후 그룹 인증 기능이 필요하면 DB 스키마에 is_verified 컬럼 추가 필요

    // 페이징 처리
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // 쿼리 실행 (페이징 적용)
    const { data, error, count } = await query.range(from, to);

    if (error) {
      return handleSupabaseError(error, 'Failed to fetch groups');
    }

    // DB 응답을 프론트엔드 형식으로 변환
    const transformedData = data?.map(transformGroupFromDB) || [];

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
    return logAndRespondError(error, 'GET /api/groups', 'Failed to fetch groups');
  }
}

/**
 * POST /api/groups
 *
 * Body:
 * {
 *   "name": string (필수),
 *   "description": string (필수),
 *   "category": string (필수),
 *   "location": string (필수),
 *   "host_member_id": string (필수),
 *   "host_name": string (필수),
 *   "thumbnail_image_url": string (선택),
 *   "tags": string[] (선택)
 * }
 *
 * @example
 * POST /api/groups
 * Content-Type: application/json
 * {
 *   "name": "Seoul Coffee Lovers",
 *   "description": "A group for coffee enthusiasts in Seoul",
 *   "category": "카페",
 *   "location": "Seoul",
 *   "host_member_id": "user-uuid-here",
 *   "host_name": "John Doe"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseClientWithCookie();
    const body = await request.json();

    // 필수 필드 검증
    const validationError = validateRequiredFields(body, [
      'name',
      'description',
      'category',
      'location',
      'host_member_id',
      'host_name',
    ]);

    if (validationError) {
      return validationError;
    }

    // 카테고리 code로 ID 조회
    const { data: categoryData, error: categoryError } = await supabase
      .from('group_categories')
      .select('id')
      .eq('code', body.category)
      .single();

    if (categoryError || !categoryData) {
      return logAndRespondError(
        categoryError || new Error('Category not found'),
        'POST /api/groups',
        `Invalid category code: ${body.category}`
      );
    }

    // 그룹 데이터 준비
    const groupData = {
      name: body.name,
      description: body.description,
      group_category_id: categoryData.id, // 카테고리 UUID
      location: body.location,
      host_id: body.host_member_id, // DB 필드명: host_id
      host_name: body.host_name,
      total_members: 1, // DB 필드명: total_members (호스트 본인으로 시작)
      event_count: 0, // 초기값
      thumbnail_image_url: body.thumbnail_image_url || null,
      tags: body.tags || [],
      requires_approval: false, // 기본값
    };

    // 그룹 생성
    const { data, error } = await supabase
      .from('group')
      .insert([groupData])
      .select()
      .single();

    if (error) {
      return handleSupabaseError(error, 'Failed to create group');
    }

    // TODO: 그룹 생성 후 자동으로 group_member 테이블에 호스트 추가
    // await supabase.from('group_member').insert([
    //   {
    //     group_id: data.id,
    //     member_id: body.host_member_id,
    //     role: 'admin'
    //   }
    // ]);

    return successResponse(data, HTTP_STATUS.CREATED, 'Group created successfully');
  } catch (error) {
    return logAndRespondError(error, 'POST /api/groups', 'Failed to create group');
  }
}
