import { useQuery } from '@tanstack/react-query';
import { newsApi } from '../api';
import { newsKeys } from '../constants';

/**
 * 전체 뉴스 조회 Hook
 * @returns React Query result with all news
 */
export const useNews = () => {
  return useQuery({
    queryKey: newsKeys.all,
    queryFn: newsApi.getNews,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
