'use client';

import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '../api/categoryApi';
import { homeKeys } from '../constants/homeQueryKeys';

/**
 * 카테고리 목록 조회 Hook
 */
export const useCategories = () => {
  return useQuery({
    queryKey: homeKeys.categories,
    queryFn: categoryApi.getCategories,
    staleTime: 1000 * 60 * 60, // 1시간
    gcTime: 1000 * 60 * 90, // 90분
  });
};
