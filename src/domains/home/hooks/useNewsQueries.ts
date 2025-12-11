/**
 * News Queries & Mutations (Low-Level Hooks)
 *
 * React Query를 사용한 뉴스 관련 서버 상태 관리
 * - Query: 데이터 조회
 * - Mutation: 데이터 변경 (좋아요, 북마크, 조회수)
 */

'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { newsApi } from '../api';
import { newsKeys } from '../constants';
import type { News } from '../types/news';

// ==================== Query Hooks ====================

/**
 * 전체 뉴스 조회 Hook
 * @returns React Query result with all news
 */
export const useNews = () => {
  return useQuery({
    queryKey: newsKeys.all,
    queryFn: newsApi.getNews,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

/**
 * 단일 뉴스 조회 Hook
 * @param id - News ID
 * @returns React Query result with single news
 */
export const useNewsById = (id: string) => {
  return useQuery({
    queryKey: newsKeys.detail(id),
    queryFn: () => newsApi.getNewsById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5분
  });
};

// ==================== Mutation Hooks ====================

/**
 * 뉴스 조회수 증가 Mutation
 *
 * @example
 * const incrementViews = useIncrementNewsViews();
 * incrementViews.mutate({ newsId: '123' });
 */
export const useIncrementNewsViews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ newsId }: { newsId: string }) =>
      newsApi.incrementNewsViews(newsId),

    onSuccess: (newViewCount, { newsId }) => {
      // 캐시에서 조회수만 업데이트
      queryClient.setQueryData(newsKeys.detail(newsId), (old: unknown) => {
        if (!old) return old;
        const oldData = old as News;
        return {
          ...oldData,
          viewCount: newViewCount,
        };
      });
    },
  });
};

/**
 * 뉴스 좋아요 Mutation (Optimistic Update)
 *
 * @example
 * const likeMutation = useLikeNews();
 * likeMutation.mutate({ newsId: '123', isLiked: true });
 */
export const useLikeNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ newsId, isLiked }: { newsId: string; isLiked: boolean }) =>
      newsApi.likeNews(newsId, isLiked),

    // ⏰ Optimistic Update: 즉시 UI 반영
    onMutate: async ({ newsId, isLiked }) => {
      // 진행 중인 Query 취소
      await queryClient.cancelQueries({ queryKey: newsKeys.detail(newsId) });

      // 이전 데이터 백업 (롤백용)
      const previousNews = queryClient.getQueryData(newsKeys.detail(newsId));

      // 즉시 UI 업데이트
      queryClient.setQueryData(newsKeys.detail(newsId), (old: unknown) => {
        if (!old) return old;
        const oldData = old as News;
        return {
          ...oldData,
          likeCount: isLiked
            ? (oldData.likeCount || 0) + 1
            : Math.max(0, (oldData.likeCount || 0) - 1),
          isLiked: isLiked,
        };
      });

      return { previousNews };
    },

    // ❌ 에러 시 롤백
    onError: (_err, { newsId }, context) => {
      if (context?.previousNews) {
        queryClient.setQueryData(newsKeys.detail(newsId), context.previousNews);
      }
    },

    // ✅ 성공 시 서버에서 받은 정확한 값으로 업데이트
    onSuccess: (newLikeCount, { newsId }) => {
      queryClient.setQueryData(newsKeys.detail(newsId), (old: unknown) => {
        if (!old) return old;
        const oldData = old as News;
        return {
          ...oldData,
          likeCount: newLikeCount,
        };
      });
    },

    // 최종적으로 서버 데이터와 동기화
    onSettled: (_, __, { newsId }) => {
      queryClient.invalidateQueries({ queryKey: newsKeys.detail(newsId) });
    },
  });
};

/**
 * 뉴스 북마크 Mutation (Optimistic Update)
 *
 * @example
 * const bookmarkMutation = useBookmarkNews();
 * bookmarkMutation.mutate({ newsId: '123', userId: 'user1', isBookmarked: true });
 */
export const useBookmarkNews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      newsId,
      userId,
      isBookmarked,
    }: {
      newsId: string;
      userId: string;
      isBookmarked: boolean;
    }) => newsApi.bookmarkNews(newsId, userId, isBookmarked),

    // ⏰ Optimistic Update
    onMutate: async ({ newsId, isBookmarked }) => {
      await queryClient.cancelQueries({ queryKey: newsKeys.detail(newsId) });

      const previousNews = queryClient.getQueryData(newsKeys.detail(newsId));

      queryClient.setQueryData(newsKeys.detail(newsId), (old: unknown) => {
        if (!old) return old;
        const oldData = old as News;
        return {
          ...oldData,
          isBookmarked: isBookmarked,
        };
      });

      return { previousNews };
    },

    onError: (_err, { newsId }, context) => {
      if (context?.previousNews) {
        queryClient.setQueryData(newsKeys.detail(newsId), context.previousNews);
      }
    },

    onSuccess: (_, { newsId }) => {
      // 북마크 목록 캐시도 무효화 (북마크 페이지가 있다면)
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
      queryClient.invalidateQueries({ queryKey: newsKeys.detail(newsId) });
    },
  });
};
