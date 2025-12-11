/**
 * News API
 * 뉴스 관련 API 호출 함수
 *
 * BFF Pattern:
 * - Axios를 사용하여 Next.js API Routes (/api/news) 호출
 * - DTO → Mapper를 통해 Domain Model로 변환
 * - 백엔드에서 Supabase와 통신
 */

import { apiClient } from '@/lib/axios';
import type { News, NewsFilters } from '../types/news';
import type {
  CreateNewsRequestDto,
  UpdateNewsRequestDto,
  NewsResponseDto,
} from '../types/dto/newsDto';
import { toNews, toNewsList } from '../types/dto/newsMapper';

export const newsApi = {
  /**
   * 전체 뉴스 조회
   * GET /api/news
   */
  getNews: async (): Promise<News[]> => {
    try {
      const response = (await apiClient.get('/news')) as NewsResponseDto[];
      return toNewsList(response);
    } catch (error) {
      console.error('Error fetching news:', error);
      throw new Error('Failed to fetch news');
    }
  },

  /**
   * 단일 뉴스 조회
   * GET /api/news/:id
   */
  getNewsById: async (id: string): Promise<News | undefined> => {
    try {
      const response = (await apiClient.get(`/news/${id}`)) as NewsResponseDto;
      return toNews(response);
    } catch (error: any) {
      // 404 에러는 undefined 반환
      if (error?.code === 'NOT_FOUND') {
        console.warn('News not found:', id);
        return undefined;
      }
      console.error('Error fetching news by id:', error);
      throw new Error('Failed to fetch news');
    }
  },

  /**
   * 필터링된 뉴스 조회
   * GET /api/news?category=...&pinned=...
   */
  getFilteredNews: async (filters: NewsFilters): Promise<News[]> => {
    try {
      // 쿼리 파라미터 생성
      const params: Record<string, string> = {};

      if (filters.category && filters.category !== 'all') {
        params.category = filters.category;
      }

      if (filters.isPinned !== undefined) {
        params.pinned = String(filters.isPinned);
      }

      if (filters.searchQuery) {
        params.searchQuery = filters.searchQuery;
      }

      const response = (await apiClient.get('/news', {
        params,
      })) as NewsResponseDto[];

      return toNewsList(response);
    } catch (error) {
      console.error('Error fetching filtered news:', error);
      throw new Error('Failed to fetch filtered news');
    }
  },

  /**
   * 뉴스 생성 (관리자 전용)
   * POST /api/news
   */
  createNews: async (_data: CreateNewsRequestDto): Promise<News> => {
    try {
      const requestData = {
        id: 'temp-news-id-' + Date.now(), // TODO: slug 생성 로직
        title_ko: '',
        title_en: '',
        title_zh: '',
        title_vi: '',
        content_ko: '',
        content_en: '',
        content_zh: '',
        content_vi: '',
        category: 'announcement',
        author: 'Admin',
        date: new Date().toISOString().split('T')[0],
        image: null,
        is_pinned: false,
        read_time: null,
        tags: [],
      };

      const response = (await apiClient.post(
        '/news',
        requestData
      )) as NewsResponseDto;
      return toNews(response);
    } catch (error) {
      console.error('Error creating news:', error);
      throw new Error('Failed to create news');
    }
  },

  /**
   * 뉴스 수정 (관리자 전용)
   * PUT /api/news/:id
   */
  updateNews: async (
    id: string,
    data: UpdateNewsRequestDto
  ): Promise<News> => {
    try {
      // TODO: DTO 타입에 맞게 수정 필요
      const updateData = data as any;

      const response = (await apiClient.put(
        `/news/${id}`,
        updateData
      )) as NewsResponseDto;
      return toNews(response);
    } catch (error) {
      console.error('Error updating news:', error);
      throw new Error('Failed to update news');
    }
  },

  /**
   * 뉴스 삭제 (관리자 전용)
   * DELETE /api/news/:id
   */
  deleteNews: async (id: string): Promise<void> => {
    try {
      await apiClient.delete(`/news/${id}`);
    } catch (error) {
      console.error('Error deleting news:', error);
      throw new Error('Failed to delete news');
    }
  },

  /**
   * 뉴스 좋아요 토글
   * POST /api/news/:id/like
   */
  likeNews: async (newsId: string, isLiked: boolean): Promise<number> => {
    try {
      const response = (await apiClient.post(`/news/${newsId}/like`, {
        isLiked,
      })) as { likeCount: number };
      return response.likeCount;
    } catch (error) {
      console.error('Error liking news:', error);
      throw new Error('Failed to like news');
    }
  },

  /**
   * 뉴스 북마크 토글
   * POST /api/news/:id/bookmark
   */
  bookmarkNews: async (
    newsId: string,
    userId: string,
    isBookmarked: boolean
  ): Promise<boolean> => {
    try {
      const response = (await apiClient.post(`/news/${newsId}/bookmark`, {
        userId,
        isBookmarked,
      })) as { isBookmarked: boolean };
      return response.isBookmarked;
    } catch (error) {
      console.error('Error bookmarking news:', error);
      throw new Error('Failed to bookmark news');
    }
  },

  /**
   * 뉴스 조회수 증가
   * POST /api/news/:id/increment-views
   */
  incrementNewsViews: async (newsId: string): Promise<number> => {
    try {
      const response = (await apiClient.post(
        `/news/${newsId}/increment-views`
      )) as { viewCount: number };
      return response.viewCount;
    } catch (error) {
      console.error('Error incrementing news views:', error);
      throw new Error('Failed to increment news views');
    }
  },
};
