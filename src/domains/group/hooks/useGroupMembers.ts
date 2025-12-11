/**
 * useGroupMembers Hook
 * 그룹 멤버 목록을 조회하는 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { groupApi } from '../api/groupApi';
import type { GroupMember } from '../types/group';

export const useGroupMembers = (groupId: string) => {
  return useQuery<GroupMember[], Error>({
    queryKey: ['group', groupId, 'members'],
    queryFn: () => groupApi.getGroupMembers(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
