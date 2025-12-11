/**
 * useGroupEvents Hook
 * 특정 그룹의 이벤트 목록을 조회하는 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { groupApi } from '../api/groupApi';

export const useGroupEvents = (groupId: string) => {
  return useQuery<any[], Error>({
    queryKey: ['group', groupId, 'events'],
    queryFn: () => groupApi.getGroupEvents(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
