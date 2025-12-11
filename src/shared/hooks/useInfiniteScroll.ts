/**
 * 무한 스크롤 훅
 * React Query의 useInfiniteQuery를 사용하여 페이징 데이터를 무한 스크롤로 로드
 */

import { useInfiniteQuery } from '@tanstack/react-query';
import type { Event } from '@/domains/event/types';
import type { Group } from '@/domains/group/types';
import { toGroups } from '@/domains/group/types/dto/groupMapper';
import { toEvents } from '@/domains/event/types/dto/eventMapper';

// 페이징 응답 타입
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

// 이벤트 필터 파라미터
export interface EventFilters {
  type?: 'all' | 'group' | 'personal';
  format?: 'all' | 'online' | 'offline';
  category?: string;
  location?: string;
  searchQuery?: string;
  date?: string; // 'all' | 'today' | 'thisWeek' | 'thisMonth'
}

// 그룹 필터 파라미터
export interface GroupFilters {
  category?: string;
  location?: string;
  searchQuery?: string;
  date?: string; // 'all' | 'today' | 'thisWeek' | 'thisMonth'
}

/**
 * 무한 스크롤 이벤트 목록 훅
 *
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteEvents({
 *   type: 'all',
 *   category: 'SOCIAL'
 * });
 */
export function useInfiniteEvents(filters: EventFilters = {}) {
  return useInfiniteQuery<PaginatedResponse<Event>>({
    // 🔧 FIX: 객체 참조 문제 해결 - 원시 값의 배열로 queryKey 구성
    queryKey: [
      'events',
      'infinite',
      filters.type || 'all',
      filters.format || 'all',
      filters.category || 'all',
      filters.location || 'all',
      filters.searchQuery || '',
      filters.date || 'all',
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: String(pageParam),
        limit: '20',
        ...(filters.type && filters.type !== 'all' && { type: filters.type }),
        ...(filters.format && filters.format !== 'all' && { format: filters.format }),
        ...(filters.category && filters.category !== 'all' && { category: filters.category }),
        ...(filters.location && { location: filters.location }),
        ...(filters.searchQuery && { searchQuery: filters.searchQuery }),
        ...(filters.date && filters.date !== 'all' && { date: filters.date }),
      });

      // 1. API 호출
      const response = await fetch(`/api/events?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      const result = await response.json();

      // 2. 카테고리 조회 (클라이언트 사이드 조인용)
      const categoriesResponse = await fetch('/api/categories?type=event');
      const categoriesResult = await categoriesResponse.json();
      const categories = categoriesResult.data || [];

      // 3. DTO → Domain Model 변환
      const dtos = result.data?.data || [];
      const domainEvents = toEvents(dtos, categories);

      // 4. 페이징 정보와 함께 반환 (API의 페이징 정보를 그대로 사용)
      return {
        data: domainEvents,
        pagination: result.data?.pagination || {
          page: pageParam,
          limit: 20,
          total: 0,
          totalPages: 1,
          hasMore: false,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      // hasMore가 true면 다음 페이지 번호 반환, 아니면 undefined
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5분 캐시
    refetchOnMount: false, // 마운트 시 자동 리페치 방지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 방지
    refetchOnReconnect: false, // 재연결 시 자동 리페치 방지
  });
}

/**
 * 무한 스크롤 그룹 목록 훅
 *
 * @example
 * const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteGroups({
 *   category: 'SOCIAL',
 *   location: 'Seoul'
 * });
 */
export function useInfiniteGroups(filters: GroupFilters = {}) {
  return useInfiniteQuery<PaginatedResponse<Group>>({
    // 🔧 FIX: 객체 참조 문제 해결 - 원시 값의 배열로 queryKey 구성
    queryKey: [
      'groups',
      'infinite',
      filters.category || 'all',
      filters.location || 'all',
      filters.searchQuery || '',
      filters.date || 'all',
    ],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        page: String(pageParam),
        limit: '20',
        ...(filters.category && filters.category !== 'all' && { category: filters.category }),
        ...(filters.location && { location: filters.location }),
        ...(filters.searchQuery && { searchQuery: filters.searchQuery }),
        ...(filters.date && filters.date !== 'all' && { date: filters.date }),
      });

      // 1. API 호출
      const response = await fetch(`/api/groups?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch groups');
      }
      const result = await response.json();

      // 2. 카테고리 조회 (클라이언트 사이드 조인용)
      const categoriesResponse = await fetch('/api/categories?type=group');
      const categoriesResult = await categoriesResponse.json();
      const categories = categoriesResult.data || [];

      // 3. DTO → Domain Model 변환
      const dtos = result.data?.data || [];
      const domainGroups = toGroups(dtos, categories);

      // 4. 페이징 정보와 함께 반환 (API의 페이징 정보를 그대로 사용)
      return {
        data: domainGroups,
        pagination: result.data?.pagination || {
          page: pageParam,
          limit: 20,
          total: 0,
          totalPages: 1,
          hasMore: false,
        },
      };
    },
    getNextPageParam: (lastPage) => {
      // hasMore가 true면 다음 페이지 번호 반환, 아니면 undefined
      return lastPage.pagination.hasMore
        ? lastPage.pagination.page + 1
        : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 60 * 5, // 5분 캐시
    refetchOnMount: false, // 마운트 시 자동 리페치 방지
    refetchOnWindowFocus: false, // 윈도우 포커스 시 자동 리페치 방지
    refetchOnReconnect: false, // 재연결 시 자동 리페치 방지
  });
}

/**
 * Intersection Observer를 사용한 무한 스크롤 트리거 훅
 *
 * @example
 * const { ref } = useInfiniteScrollTrigger({
 *   onIntersect: () => fetchNextPage(),
 *   enabled: hasNextPage && !isFetchingNextPage
 * });
 *
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={ref}>Loading...</div>
 *   </div>
 * );
 */
export function useInfiniteScrollTrigger({
  onIntersect,
  enabled = true,
  threshold = 0.1,
}: {
  onIntersect: () => void;
  enabled?: boolean;
  threshold?: number;
}) {
  const observerRef = React.useRef<IntersectionObserver | null>(null);
  const targetRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!enabled) return;

    // Intersection Observer 생성
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold }
    );

    // 타겟 엘리먼트 관찰 시작
    const currentTarget = targetRef.current;
    if (currentTarget) {
      observerRef.current.observe(currentTarget);
    }

    // 클린업
    return () => {
      if (observerRef.current && currentTarget) {
        observerRef.current.unobserve(currentTarget);
      }
    };
  }, [enabled, onIntersect, threshold]);

  return { ref: targetRef };
}

// React import 추가
import React from 'react';
