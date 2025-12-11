import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../api';
import { eventKeys } from '../constants';

/**
 * 전체 이벤트 조회 Hook
 * @returns React Query result with all events
 */
export const useEvents = () => {
  return useQuery({
    queryKey: eventKeys.all,
    queryFn: eventApi.getEvents,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
