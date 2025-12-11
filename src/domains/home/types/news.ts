// ========== ENUMS ==========

export enum NewsCategory {
  ANNOUNCEMENT = 'ANNOUNCEMENT',
  INFORMATION = 'INFORMATION',
  COMMUNICATION = 'COMMUNICATION',
}

export enum NewsStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  ARCHIVED = 'archived',
}

// ========== DOMAIN MODELS ==========

/**
 * News Domain Model
 * 프론트엔드에서 사용하는 뉴스 모델
 *
 * Note: Supabase DB uses snake_case (thumbnail_image_url, created_at, etc)
 * API layer will handle conversion between camelCase ↔ snake_case
 */
export interface News {
  // Core DB fields (required)
  id: string;
  title: string;
  content: string;
  category: NewsCategory;
  author: string;

  // Optional DB fields
  thumbnailImageUrl?: string;
  likeCount?: number;
  viewCount?: number;
  createdAt?: Date;
  updatedAt?: Date;

  // Client-side computed fields
  status?: NewsStatus;
  isNew?: boolean;  // < 7일 이내
  isLiked?: boolean;  // 클라이언트 좋아요 상태
  isBookmarked?: boolean;  // 클라이언트 북마크 상태
}

/**
 * News Filter Parameters
 * 뉴스 필터링에 사용되는 파라미터
 */
export interface NewsFilters {
  category?: NewsCategory | 'all';
  searchQuery?: string;
  isPinned?: boolean;
}

/**
 * News Create/Update Form
 * 뉴스 생성/수정 폼 데이터
 */
export interface NewsForm {
  title: string;
  content: string;
  category: NewsCategory;
  author: string;
  thumbnailImageUrl?: string;
  likeCount?: number;
}
