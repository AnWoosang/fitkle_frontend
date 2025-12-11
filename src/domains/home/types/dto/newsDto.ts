import { NewsCategory } from '../news';

// =============================================
// NEWS API REQUEST DTOs
// =============================================

/**
 * 뉴스 생성 요청 DTO
 * POST /api/news
 */
export interface CreateNewsRequestDto {
  title: string;
  content: string;
  category: NewsCategory;
  author: string;
  thumbnail_image_url?: string;
  like_count?: number;
}

/**
 * 뉴스 수정 요청 DTO
 * PUT /api/news/:id
 */
export interface UpdateNewsRequestDto {
  title?: string;
  content?: string;
  category?: NewsCategory;
  author?: string;
  thumbnail_image_url?: string;
  like_count?: number;
}

/**
 * 뉴스 필터 요청 쿼리
 * GET /api/news?category=ANNOUNCEMENT
 */
export interface GetNewsQueryDto {
  category?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

// =============================================
// NEWS API RESPONSE DTOs
// =============================================

/**
 * 뉴스 응답 DTO (백엔드 스키마)
 * snake_case 사용 (Supabase/PostgreSQL 컨벤션)
 * 실제 DB 스키마와 정확히 일치
 */
export interface NewsResponseDto {
  id: string;
  title: string;
  content: string;
  category: NewsCategory;
  author: string;
  thumbnail_image_url: string | null;
  like_count: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

/**
 * 뉴스 목록 응답 DTO
 */
export interface NewsListResponseDto {
  news: NewsResponseDto[];
  total: number;
  page: number;
  limit: number;
}

/**
 * 뉴스 생성/수정 응답 DTO
 */
export interface NewsMutationResponseDto {
  news: NewsResponseDto;
  message: string;
}
