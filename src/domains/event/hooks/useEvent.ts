import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../api';
import { eventKeys } from '../constants';

/**
 * 단일 이벤트 조회 Hook
 * @param id - Event ID
 * @returns React Query result with single event
 */
export const useEvent = (id: string) => {
  return useQuery({
    queryKey: eventKeys.detail(id),
    queryFn: () => eventApi.getEventById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
