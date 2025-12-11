import { useQuery } from '@tanstack/react-query';
import { groupApi } from '../api';
import { groupKeys } from '../constants';

/**
 * 특정 그룹 조회 Hook
 * @param id - Group ID
 * @returns React Query result with group data
 */
export const useGroup = (id: string) => {
  return useQuery({
    queryKey: groupKeys.detail(id),
    queryFn: () => groupApi.getGroupById(id),
    staleTime: 1000 * 60 * 5, // 5분
    enabled: !!id, // ID가 있을 때만 쿼리 실행
  });
};
