// ========== ENUMS ==========

export enum EventType {
  GROUP = 'group',
  PERSONAL = 'personal',
}

export enum EventFormat {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
}

export enum EventCategory {
  CAFE = 'cafe',
  FOOD = 'food',
  OUTDOOR = 'outdoor',
  CULTURE = 'culture',  // DB: culture (문화/예술)
  SPORTS = 'sports',    // DB: sports (운동/스포츠)
  LANGUAGE = 'language',
}

export enum EventStatus {
  UPCOMING = 'upcoming',
  ONGOING = 'ongoing',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

// ========== DOMAIN MODELS ==========

/**
 * Event Domain Model
 * 프론트엔드에서 사용하는 이벤트 모델
 *
 * Note: Supabase DB uses snake_case (thumbnail_image_url, max_attendees, etc)
 * API layer will handle conversion between camelCase ↔ snake_case
 */
export interface Event {
  // Core DB fields (required)
  id: string;
  title: string;
  date: string;           // Formatted from DB: datetime
  time: string;           // Formatted from DB: datetime
  datetime?: string;      // DB: datetime (timestamptz) - ISO 8601 format
  attendees: number;
  maxAttendees: number;   // DB: max_attendees
  image: string;          // DB: thumbnail_image_url
  // 카테고리 정보 (클라이언트 사이드 조인)
  categoryId?: string;    // DB: event_category_id (UUID)
  categoryCode?: string;  // 카테고리 코드 (예: 'SOCIAL', 'FITNESS')
  categoryName?: string;  // 카테고리 이름 (예: 'Social & Networking')
  categoryEmoji?: string; // 카테고리 이모지 (예: '🤝')
  format: EventFormat;    // DB: type (online/offline) - 이벤트 진행 방식

  // Format-specific fields
  streetAddress?: string; // DB: street_address (주소 - ONLINE: URL, OFFLINE: 실제 주소)
  detailAddress?: string; // DB: detail_address (상세 주소)

  // Optional DB fields
  groupId?: string;       // DB: group_id (uuid, FK to group table)
  groupName?: string;     // DB: group_name
  description?: string;
  hostName?: string;      // DB: host_name
  hostId?: string;        // DB: host_member_id (uuid, FK to member table)
  createdAt?: Date;       // DB: created_at (timestamptz)
  updatedAt?: Date;       // DB: updated_at (timestamptz)
  latitude?: number | null;
  longitude?: number | null;
  tags?: string[];        // DB: tags (jsonb array)
  isGroupMembersOnly?: boolean; // DB: is_group_members_only

  // Computed fields (calculated in frontend, not stored in DB)
  type?: EventType;       // Computed from groupId (null = PERSONAL, uuid = GROUP)
  isHot?: boolean;        // Computed from attendees/max_attendees ratio or tags
  isNew?: boolean;        // Computed from createdAt (< 7 days)
  rating?: number;        // Computed/aggregated from review table
  status?: EventStatus;   // Computed from datetime vs current time
}

/**
 * Event Filter Parameters
 * 이벤트 필터링에 사용되는 파라미터
 */
export interface EventFilters {
  type?: EventType | 'all';
  category?: EventCategory | 'all';
  location?: string;
  searchQuery?: string;
  date?: 'all' | 'today' | 'thisWeek' | 'thisMonth';
  status?: EventStatus;
}

/**
 * Event Create/Update Form
 * 이벤트 생성/수정 폼 데이터
 */
export interface EventForm {
  title: string;
  date: string;
  time: string;
  format: EventFormat;    // online or offline
  onlineLink?: string;    // online일 때 필수
  maxAttendees: number;
  image?: string;
  category: string;
  type: EventType;        // group or personal
  groupId?: string;
  description?: string;
  streetAddress?: string; // offline일 때 필수 (주소)
  detailAddress?: string; // 상세 주소
  latitude?: number;
  longitude?: number;
}
