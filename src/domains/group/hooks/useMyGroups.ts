import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { groupApi } from '../api';
import { groupKeys } from '../constants';
import { GroupResponseDto } from '../types/dto/groupDto';
import { useGroupCategories } from '@/shared/hooks/useCategories';
import { toGroups } from '../types/dto/groupMapper';
import { useMemo } from 'react';

/**
 * 사용자가 호스트인 그룹 조회 Hook
 * 카테고리는 React Query 캐시에서 가져와서 조인
 * @returns React Query result with user's groups (where user is host)
 */
export const useMyGroups = (options?: Omit<UseQueryOptions<GroupResponseDto[]>, 'queryKey' | 'queryFn'>) => {
  // 1. 그룹 데이터 조회 (DTO만)
  const { data: groupsData = [], ...queryResult } = useQuery<GroupResponseDto[]>({
    queryKey: groupKeys.myGroups,
    queryFn: groupApi.getMyGroupsRaw,
    staleTime: 1000 * 60 * 5, // 5분
    ...options,
  });

  // 2. 카테고리 데이터 조회 (React Query 캐시 활용)
  const { data: categoriesData = [] } = useGroupCategories();

  // 3. 클라이언트 사이드 조인 (메모이제이션)
  const groups = useMemo(
    () => toGroups(groupsData, categoriesData),
    [groupsData, categoriesData]
  );

  return {
    ...queryResult,
    data: groups,
  };
};
