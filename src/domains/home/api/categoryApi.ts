import { apiClient } from '@/lib/axios/client';
import { Category } from '../types/category';

export const categoryApi = {
  /**
   * 모든 카테고리 조회
   */
  getCategories: async (): Promise<Category[]> => {
    // apiClient 인터셉터가 이미 response.data.data를 반환함
    const response = await apiClient.get<Category[]>('/categories');
    return response.data || [];
  },
};
