/**
 * News Interaction Hooks (Mid-Level Business Logic)
 *
 * 뉴스 상호작용 관련 비즈니스 로직 (좋아요, 북마크)
 * Low-Level Mutation 훅을 조합하여 이벤트 핸들러와 상태 관리 제공
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLikeNews } from './useNewsQueries';

/**
 * 뉴스 좋아요 상태 및 핸들러
 *
 * @param newsId - 뉴스 ID
 * @param initialLikeCount - 초기 좋아요 수
 * @returns 좋아요 상태, 카운트, 핸들러
 *
 * @example
 * const { isLiked, likeCount, handleLike } = useNewsLike(newsId, post.likeCount);
 *
 * <button onClick={handleLike}>
 *   ❤️ {likeCount}
 * </button>
 */
export const useNewsLike = (newsId: string, initialLikeCount: number = 0) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const likeMutation = useLikeNews();

  // 초기 좋아요 카운트 설정
  useEffect(() => {
    setLikeCount(initialLikeCount);
  }, [initialLikeCount]);

  // 좋아요 핸들러
  const handleLike = useCallback(() => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    // Optimistic Update: 로컬 상태도 즉시 업데이트
    setLikeCount((prev) => (newLikedState ? prev + 1 : Math.max(0, prev - 1)));

    // API 호출
    likeMutation.mutate(
      { newsId, isLiked: newLikedState },
      {
        onSuccess: (newCount) => {
          // 서버에서 받은 정확한 값으로 업데이트
          setLikeCount(newCount);
        },
        onError: () => {
          // 에러 시 롤백
          setIsLiked(isLiked);
          setLikeCount((prev) =>
            newLikedState ? Math.max(0, prev - 1) : prev + 1
          );
        },
      }
    );
  }, [newsId, isLiked, likeMutation]);

  return {
    isLiked,
    likeCount,
    handleLike,
    isLoading: likeMutation.isPending,
  };
};
