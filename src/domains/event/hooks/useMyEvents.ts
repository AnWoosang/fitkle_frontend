import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { eventApi } from '../api';
import { eventKeys } from '../constants';
import { Event } from '../types/event';

/**
 * 내 이벤트 조회 Hook (RSVP한 이벤트)
 * status='confirmed'인 이벤트만 조회
 * @returns React Query result with my events
 */
export const useMyEvents = (options?: Omit<UseQueryOptions<Event[]>, 'queryKey' | 'queryFn'>) => {
  return useQuery({
    queryKey: eventKeys.myEvents,
    queryFn: eventApi.getMyEvents,
    staleTime: 1000 * 60 * 5, // 5분
    ...options,
  });
};
