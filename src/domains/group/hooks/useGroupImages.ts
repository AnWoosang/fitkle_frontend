/**
 * useGroupImages Hook
 * 그룹 이미지 목록을 조회하는 React Query 훅
 */

import { useQuery } from '@tanstack/react-query';
import { groupApi } from '../api/groupApi';
import type { GroupImage } from '../types/group';

export const useGroupImages = (groupId: string) => {
  return useQuery<GroupImage[], Error>({
    queryKey: ['group', groupId, 'images'],
    queryFn: () => groupApi.getGroupImages(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5, // 5분
  });
};
