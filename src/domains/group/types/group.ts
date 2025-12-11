// ========== DOMAIN MODELS ==========

/**
 * Group Domain Model
 * 프론트엔드에서 사용하는 그룹 모델
 *
 * Note: Supabase DB uses snake_case (thumbnail_image_url, host_name, etc)
 * API layer will handle conversion between camelCase ↔ snake_case
 */
export interface Group {
  // Core DB fields (required)
  id: string; // DB: id (uuid)
  name: string;
  description: string;
  // 카테고리 정보 (클라이언트 사이드 조인)
  categoryId?: string;    // DB: group_category_id (UUID)
  categoryCode?: string;  // 카테고리 코드 (예: 'SOCIAL', 'FITNESS')
  categoryName?: string;  // 카테고리 이름 (예: 'Social & Networking')
  categoryEmoji?: string; // 카테고리 이모지 (예: '🤝')
  members: number; // DB: total_members
  image: string; // DB: thumbnail_image_url
  hostName: string; // DB: host_name
  hostId: string; // DB: host_id (uuid)
  eventCount: number; // DB: event_count
  location: string;
  requiresApproval?: boolean; // DB: requires_approval

  // Optional DB fields
  tags?: string[]; // DB: tags (text[] array)
  createdAt?: Date; // DB: created_at (timestamptz)
  updatedAt?: Date; // DB: updated_at (timestamptz)

  // Computed/Joined fields (not in DB, calculated or joined)
  hostAvatar?: string; // From member table (joined)
  rating?: number; // Mock/future feature: DB에 그룹 리뷰 시스템 없음
}

/**
 * Group Filter Parameters
 * 그룹 필터링에 사용되는 파라미터
 */
export interface GroupFilters {
  category?: string | 'all';
  location?: string;
  searchQuery?: string;
  date?: string; // 'all' | 'today' | 'thisWeek' | 'thisMonth'
}

/**
 * Group Create/Update Form
 * 그룹 생성/수정 폼 데이터
 */
export interface GroupForm {
  name: string;
  description: string;
  category: string;
  location: string;
  image?: string;
  tags?: string[];
}

// ========== EXTENDED MODELS ==========

/**
 * Group Member
 * 그룹 멤버 정보 (group_member + member 조인)
 */
export interface GroupMember {
  id: string; // member.id
  name: string; // member.name
  avatarUrl?: string; // member.avatar_url
  role: 'admin' | 'moderator' | 'member'; // group_member.role
  joinedAt?: Date; // group_member.created_at
}

/**
 * Group Image
 * 그룹 이미지/사진
 */
export interface GroupImage {
  id: string;
  groupId: string;
  imageUrl: string;
  caption?: string;
  displayOrder: number;
  createdAt?: Date;
}

/**
 * Group Review
 * 그룹 리뷰/평점
 */
export interface GroupReview {
  id: string;
  groupId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number; // 1-5
  comment?: string;
  createdAt?: Date;
}

/**
 * Group Statistics
 * 그룹 통계 정보 (집계 데이터)
 */
export interface GroupStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
