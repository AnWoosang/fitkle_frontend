import { useQuery } from '@tanstack/react-query';
import { groupApi } from '../api';
import { groupKeys } from '../constants';

/**
 * 전체 그룹 조회 Hook
 * @returns React Query result with all groups
 */
export const useGroups = () => {
  return useQuery({
    queryKey: groupKeys.all,
    queryFn: groupApi.getGroups,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
