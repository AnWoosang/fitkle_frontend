/**
 * useEventHost Hook
 * 이벤트 호스트 정보 조회 Hook
 */

import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../api/eventApi';

/**
 * 특정 이벤트의 호스트 정보 조회
 * @param eventId 이벤트 ID
 */
export const useEventHost = (eventId: string) => {
  return useQuery<any, Error>({
    queryKey: ['event', eventId, 'host'],
    queryFn: () => eventApi.getEventHost(eventId),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 10, // 10분 (호스트 정보는 자주 변하지 않음)
  });
};
