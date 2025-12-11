/**
 * 카테고리 공통 타입
 */

/**
 * 카테고리 정보
 * DB의 event_categories / group_categories 테이블 구조와 일치
 */
export interface CategoryInfo {
  id: string;          // UUID from DB
  code: string;        // 'SOCIAL', 'FITNESS', 'TECH', etc.
  name: string;        // 'Social & Networking', 'Fitness & Sports', etc.
  emoji: string;       // '🤝', '💪', '💻', etc.
  sort_order?: number; // 정렬 순서
  is_active?: boolean; // 활성화 여부
}

/**
 * API 응답에서 사용하는 카테고리 타입 (기존 호환성)
 */
export interface CategoryResponse {
  id: string;
  code: string;
  name: string;
  icon: string;   // emoji와 동일
  emoji: string;
  color: string;  // UI 표시용 색상
  sort_order: number;
}

/**
 * 카테고리 코드 타입
 */
export type CategoryCode =
  | 'ARTS'
  | 'BUSINESS'
  | 'COMMUNITY'
  | 'DANCE'
  | 'GAMING'
  | 'WELLNESS'
  | 'HOBBIES'
  | 'LANGUAGE'
  | 'LGBTQ'
  | 'EDUCATION'
  | 'FILM'
  | 'MUSIC'
  | 'SPIRITUALITY'
  | 'MYSTICISM'
  | 'FAMILY'
  | 'PETS'
  | 'FAITH'
  | 'SCIFI'
  | 'SOCIAL'
  | 'FITNESS'
  | 'SUPPORT'
  | 'TECH'
  | 'OUTDOOR'
  | 'WRITING'
  | 'FOOD';
