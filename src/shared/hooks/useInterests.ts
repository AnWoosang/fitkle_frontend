import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/axios';

export interface Interest {
  id: string;
  code: string;
  name_ko: string;
  emoji: string;
  sort_order: number;
  category_code: string;
}

/**
 * 관심사 목록 조회 hook
 */
export function useInterests() {
  return useQuery<Interest[]>({
    queryKey: ['interests'],
    queryFn: async () => {
      // apiClient 인터셉터가 이미 data 필드를 추출해서 반환하므로
      // response 자체가 Interest[] 타입입니다
      const data = await apiClient.get<Interest[]>('/interests');
      return data as any as Interest[];
    },
    staleTime: 1000 * 60 * 60, // 1시간 동안 fresh 상태 유지
  });
}
