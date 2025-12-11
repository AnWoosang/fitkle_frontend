import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../api';
import { eventKeys } from '../constants';

/**
 * 인기 이벤트 조회 Hook
 * attendees + view_count 기준 정렬
 * @returns React Query result with trending events
 */
export const useTrendingEvents = () => {
  return useQuery({
    queryKey: eventKeys.trending,
    queryFn: eventApi.getTrendingEvents,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
