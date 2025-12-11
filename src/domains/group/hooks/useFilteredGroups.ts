import { useQuery } from '@tanstack/react-query';
import { groupApi } from '../api/groupApi';
import type { GroupFilters } from '../types/group';

/**
 * 필터링된 그룹 목록 조회 Hook
 * @param filters - Group filter parameters
 * @returns React Query result with filtered groups
 */
export const useFilteredGroups = (filters: GroupFilters) => {
  return useQuery({
    queryKey: ['groups', 'filtered', filters],
    queryFn: () => groupApi.getFilteredGroups(filters),
  });
};
