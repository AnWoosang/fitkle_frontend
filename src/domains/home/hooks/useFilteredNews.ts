import { useQuery } from '@tanstack/react-query';
import { newsApi } from '../api';
import { newsKeys } from '../constants';
import type { NewsFilters } from '../types/news';

/**
 * 필터링된 뉴스 조회 Hook
 * @param filters - News filters
 * @returns React Query result with filtered news
 */
export const useFilteredNews = (filters: NewsFilters) => {
  return useQuery({
    queryKey: newsKeys.filtered(filters),
    queryFn: () => newsApi.getFilteredNews(filters),
    staleTime: 1000 * 60 * 5, // 5분
  });
};
