'use client';

import { useState, useCallback } from 'react';

/**
 * Like 기능을 관리하는 훅
 *
 * @param itemId - 좋아요할 아이템의 ID
 * @param itemType - 아이템 타입 ('group' | 'event')
 * @returns {object} - isLiked, toggleLike 함수
 */
export function useLike(itemId: string, itemType: 'group' | 'event' = 'group') {
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleLike = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: 서버 API 호출
      // const response = await apiClient.post(`/api/${itemType}s/${itemId}/like`);

      // 임시로 로컬 상태만 토글
      setIsLiked((prev) => !prev);

      // TODO: 성공/실패에 따른 toast 메시지
      // toast.success(isLiked ? '좋아요가 취소되었습니다.' : '좋아요!');
    } catch (error) {
      console.error('Like toggle failed:', error);
      // toast.error('좋아요에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [itemId, itemType]);

  return {
    isLiked,
    isLoading,
    toggleLike,
  };
}
