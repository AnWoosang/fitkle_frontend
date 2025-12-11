import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export interface Preference {
  id: string;
  code: string;
  name: string;
  emoji: string;
  sort_order: number;
}

/**
 * 선호 카테고리 목록 조회 hook
 */
export function usePreferences() {
  return useQuery<Preference[]>({
    queryKey: ['preferences'],
    queryFn: async () => {
      // apiClient 인터셉터가 이미 data 필드를 추출해서 반환하므로
      // response 자체가 Preference[] 타입입니다
      const data = await apiClient.get<Preference[]>('/preferences');
      return data as any as Preference[];
    },
    staleTime: 1000 * 60 * 60, // 1시간 동안 fresh 상태 유지
  });
}
