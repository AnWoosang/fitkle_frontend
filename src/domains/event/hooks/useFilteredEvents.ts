import { useQuery } from '@tanstack/react-query';
import { eventApi } from '../api/eventApi';
import type { EventFilters } from '../types/event';

/**
 * 필터링된 이벤트 조회 Hook
 * @param filters - Event filter parameters
 * @returns React Query result with filtered events
 */
export const useFilteredEvents = (filters: EventFilters) => {
  return useQuery({
    queryKey: ['events', 'filtered', filters],
    queryFn: () => eventApi.getFilteredEvents(filters),
  });
};
