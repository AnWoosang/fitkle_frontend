// =============================================
// GROUP API REQUEST DTOs
// =============================================

/**
 * 그룹 생성 요청 DTO
 * POST /api/groups
 */
export interface CreateGroupRequestDto {
  name: string;
  description: string;
  category: string;
  location: string;
  thumbnail_image_url?: string;
  tags?: string[];
}

/**
 * 그룹 수정 요청 DTO
 * PUT /api/groups/:id
 */
export interface UpdateGroupRequestDto {
  name?: string;
  description?: string;
  category?: string;
  location?: string;
  thumbnail_image_url?: string;
  tags?: string[];
}

/**
 * 그룹 필터 요청 쿼리
 * GET /api/groups?category=cafe&location=서울
 */
export interface GetGroupsQueryDto {
  category?: string;
  location?: string;
  search?: string;
  min_members?: number;
  max_members?: number;
  page?: number;
  limit?: number;
}

// =============================================
// GROUP API RESPONSE DTOs
// =============================================

/**
 * 그룹 응답 DTO (백엔드 스키마)
 * snake_case 사용 (Supabase/PostgreSQL 컨벤션)
 * 실제 DB 스키마와 정확히 일치
 */
export interface GroupResponseDto {
  id: string; // uuid
  name: string;
  description: string;
  categoryId: string; // API Route에서 categoryId로 반환
  total_members: number; // DB 필드명: total_members
  thumbnail_image_url: string;
  host_name: string;
  host_id: string; // DB 필드명: host_id (host_member_id 아님)
  event_count: number;
  tags: string[];
  location: string;
  created_at: string; // timestamptz
  updated_at: string; // timestamptz
  requires_approval?: boolean; // optional (가입 승인 필요 여부)
}

/**
 * 그룹 목록 응답 DTO
 */
export interface GroupListResponseDto {
  groups: GroupResponseDto[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 그룹 생성/수정 응답 DTO
 */
export interface GroupMutationResponseDto {
  group: GroupResponseDto;
  message: string;
}

// =============================================
// GROUP MEMBER API DTOs
// =============================================

export interface GroupMemberResponseDto {
  id: string;
  group_id: string;
  member_id: string;
  role: 'admin' | 'moderator' | 'member';
  created_at: string;
  updated_at: string;
}

export interface JoinGroupRequestDto {
  group_id: string;
}
