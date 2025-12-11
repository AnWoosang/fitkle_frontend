/**
 * News Detail Hook (High-Level Page Logic)
 *
 * NewsDetailScreen 페이지 전용 로직
 * - Low-Level Query/Mutation 조합
 * - Mid-Level 상호작용 훅 통합
 * - 조회수 자동 증가 (중복 방지)
 * - 관련 뉴스 계산
 */

'use client';

import { useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNewsById } from './useNewsQueries';
import { useNewsLike } from './useNewsInteraction';
import { newsKeys } from '../constants';
import type { News } from '../types/news';

/**
 * 뉴스 상세 페이지 훅
 *
 * @param newsId - 뉴스 ID
 * @returns 뉴스 데이터, 상태, 핸들러
 *
 * @example
 * function NewsDetailScreen({ newsId }) {
 *   const {
 *     post,
 *     relatedNews,
 *     isLoading,
 *     isLiked,
 *     likeCount,
 *     viewCount,
 *     handleLike,
 *   } = useNewsDetail(newsId);
 *
 *   if (isLoading) return <LoadingScreen />;
 *   if (!post) return <NotFoundScreen />;
 *
 *   return <div>...</div>;
 * }
 */
export const useNewsDetail = (newsId: string) => {
  const queryClient = useQueryClient();

  // ==================== Low-Level Query ====================
  const { data: post, isLoading, error } = useNewsById(newsId);

  // ✅ React Query 캐시에서 직접 읽기 (추가 요청 없음)
  const allNews = queryClient.getQueryData<News[]>(newsKeys.all) || [];

  // ==================== Low-Level Mutation ====================
  // TODO: view_count 컬럼 추가 후 활성화
  // const incrementViews = useIncrementNewsViews();

  // ==================== Mid-Level Interaction ====================
  const {
    isLiked,
    likeCount,
    handleLike,
    isLoading: isLiking,
  } = useNewsLike(newsId, post?.likeCount || 0);

  // ==================== Side Effect: 조회수 증가 ====================
  // TODO: view_count 컬럼 추가 후 활성화
  // useEffect(() => {
  //   if (!post) return;

  //   // 세션 스토리지로 중복 조회 방지
  //   const viewKey = `news_view_${newsId}`;
  //   const hasViewed = sessionStorage.getItem(viewKey);

  //   if (!hasViewed) {
  //     incrementViews.mutate({ newsId });
  //     sessionStorage.setItem(viewKey, 'true');
  //   }
  // }, [newsId, post, incrementViews]);

  // ==================== 파생 데이터: 관련 뉴스 ====================
  const relatedNews = useMemo(() => {
    if (!post || !allNews.length) return [];
    return allNews
      .filter((news: News) => news.id !== newsId && news.category === post.category)
      .slice(0, 3); // 최대 3개
  }, [allNews, newsId, post]);

  // ==================== Return ====================
  return {
    // 데이터
    post: post || null,
    relatedNews,

    // 상태
    isLoading,
    error: !!error,
    isLiked,
    likeCount,
    // TODO: view_count 컬럼 추가 후 활성화
    // viewCount: post?.viewCount || 0,

    // 액션
    handleLike,

    // 로딩 상태
    isLiking,
  };
};
