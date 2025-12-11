// =============================================
// EVENT API REQUEST DTOs
// =============================================

/**
 * 이벤트 생성 요청 DTO
 * POST /api/events
 */
export interface CreateEventRequestDto {
  title: string;
  date: string; // ISO string
  time: string;
  type: 'online' | 'offline';  // DB: type (이벤트 진행 방식)
  location?: string;           // offline일 때 필수
  online_link?: string;        // online일 때 필수
  max_attendees: number;
  image_url?: string;
  category: string;
  group_id?: string;
  description?: string;
  street_address?: string;
  detail_address?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
}

/**
 * 이벤트 수정 요청 DTO
 * PUT /api/events/:id
 */
export interface UpdateEventRequestDto {
  title?: string;
  date?: string;
  time?: string;
  type?: 'online' | 'offline';
  location?: string;
  online_link?: string;
  max_attendees?: number;
  image_url?: string;
  category?: string;
  description?: string;
  street_address?: string;
  detail_address?: string;
  latitude?: number;
  longitude?: number;
  tags?: string[];
}

/**
 * 이벤트 필터 요청 쿼리
 * GET /api/events?type=group&category=cafe
 */
export interface GetEventsQueryDto {
  type?: string;
  category?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// =============================================
// EVENT API RESPONSE DTOs
// =============================================

/**
 * 이벤트 응답 DTO (BFF 응답 형식)
 * camelCase 사용 (BFF에서 이미 변환됨)
 * BFF API(/api/events)의 실제 응답 형식과 일치
 */
export interface EventResponseDto {
  id: string;
  title: string;
  date: string;
  time: string;
  datetime?: string;           // DB datetime 원본 (ISO format)
  format: 'ONLINE' | 'OFFLINE'; // BFF에서 type → format으로 변환
  location?: string;           // BFF에서 street_address → location으로 매핑
  streetAddress?: string;      // DB street_address 원본
  attendees: number;
  maxAttendees: number;        // BFF에서 max_attendees → maxAttendees 변환
  image: string;               // BFF에서 thumbnail_image_url → image 변환
  categoryId?: string;         // BFF에서 event_category_id → categoryId 변환
  groupId?: string;            // BFF에서 group_id → groupId 변환
  groupName?: string;          // BFF에서 group_name → groupName 변환
  description?: string;
  hostName?: string;           // BFF에서 host_name → hostName 변환
  hostId: string;              // BFF에서 host_member_id → hostId 변환
  createdAt: string;           // BFF에서 created_at → createdAt 변환
  updatedAt: string;           // BFF에서 updated_at → updatedAt 변환
  detailAddress?: string;      // BFF에서 detail_address → detailAddress 변환
  latitude?: number | null;
  longitude?: number | null;
  tags?: string[];
  isGroupMembersOnly?: boolean; // BFF에서 is_group_members_only → isGroupMembersOnly 변환
  type?: 'group' | 'personal'; // BFF에서 계산된 필드
}

/**
 * 이벤트 목록 응답 DTO
 */
export interface EventListResponseDto {
  events: EventResponseDto[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 이벤트 생성/수정 응답 DTO
 */
export interface EventMutationResponseDto {
  event: EventResponseDto;
  message: string;
}

// =============================================
// ATTENDEE API DTOs
// =============================================

export interface AttendeeResponseDto {
  id: string;
  member_id: string;
  event_id: string;
  name: string;
  avatar_url?: string;
  country: string;
  joined_at: string; // ISO string
  role: 'host' | 'organizer' | 'member';
  guest_count?: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface JoinEventRequestDto {
  event_id: string;
  guest_count?: number;
}
