import { useQuery } from '@tanstack/react-query';
import type { CategoryResponse } from '@/shared/types';

/**
 * 카테고리 조회 API 호출
 */
async function fetchCategories(type: 'event' | 'group'): Promise<CategoryResponse[]> {
  const response = await fetch(`/api/categories?type=${type}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${type} categories`);
  }

  const result = await response.json();
  return result.data || [];
}

/**
 * 이벤트 카테고리 조회 훅
 */
export function useEventCategories() {
  return useQuery({
    queryKey: ['categories', 'event'],
    queryFn: () => fetchCategories('event'),
    staleTime: 1000 * 60 * 60, // 1시간 (카테고리는 자주 변경되지 않음)
    gcTime: 1000 * 60 * 60 * 24, // 24시간 캐시 유지
  });
}

/**
 * 그룹 카테고리 조회 훅
 */
export function useGroupCategories() {
  return useQuery({
    queryKey: ['categories', 'group'],
    queryFn: () => fetchCategories('group'),
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: 1000 * 60 * 60 * 24, // 24시간 캐시 유지
  });
}

/**
 * 카테고리 코드로 카테고리 정보 찾기
 */
export function useCategoryByCode(
  categories: CategoryResponse[] | undefined,
  code: string | undefined | null
): CategoryResponse | undefined {
  if (!categories || !code) return undefined;
  return categories.find((cat) => cat.code === code);
}

/**
 * 카테고리 ID로 카테고리 정보 찾기
 */
export function useCategoryById(
  categories: CategoryResponse[] | undefined,
  id: string | undefined | null
): CategoryResponse | undefined {
  if (!categories || !id) return undefined;
  return categories.find((cat) => cat.id === id);
}
