import { useQuery } from '@tanstack/react-query';
import { newsApi } from '../api';
import { newsKeys } from '../constants';

/**
 * 단일 뉴스 조회 Hook
 * @param id - News ID
 * @returns React Query result with single news
 */
export const useNewsById = (id: string) => {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => newsApi.getNewsById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
