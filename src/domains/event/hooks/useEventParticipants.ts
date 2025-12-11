/**
 * useEventParticipants Hook
 * 이벤트 참가자 목록 조회 Hook
 */

import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../api/eventApi';

/**
 * 특정 이벤트의 참가자 목록 조회
 * @param eventId 이벤트 ID
 */
export const useEventParticipants = (eventId: string) => {
  return useQuery<any[], Error>({
    queryKey: ['event', eventId, 'participants'],
    queryFn: () => eventApi.getEventParticipants(eventId),
    enabled: !!eventId,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
