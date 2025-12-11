/**
 * 사용자 프로필 조회 Hook
 *
 * React Query를 사용하여 프로필 데이터를 관리합니다.
 * - 자동 캐싱 및 리페치
 * - 로딩/에러 상태 관리
 * - 낙관적 업데이트 (Optimistic Updates)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api';
import type { UpdateProfileRequest } from '../types/user';

/**
 * Query Keys
 */
export const profileKeys = {
  all: ['profile'] as const,
  current: () => [...profileKeys.all, 'current'] as const,
};

/**
 * 프로필 조회 Hook
 *
 * @returns React Query result with user profile
 *
 * @example
 * const { data: profile, isLoading, error } = useProfile();
 */
export const useProfile = () => {
  return useQuery({
    queryKey: profileKeys.current(),
    queryFn: () => userApi.getProfile(),
    staleTime: 1000 * 60 * 5, // 5분
    retry: 1, // 실패 시 1번만 재시도
  });
};

/**
 * 프로필 업데이트 Mutation Hook
 *
 * @returns React Query mutation result
 *
 * @example
 * const updateProfileMutation = useUpdateProfile();
 *
 * updateProfileMutation.mutate({
 *   bio: "새로운 자기소개",
 *   location: "Seoul, KR"
 * }, {
 *   onSuccess: (updatedProfile) => {
 *     console.log("프로필 업데이트 성공:", updatedProfile);
 *   },
 *   onError: (error) => {
 *     console.error("프로필 업데이트 실패:", error);
 *   }
 * });
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) => userApi.updateProfile(data),
    onSuccess: (updatedProfile) => {
      // 프로필 캐시 업데이트 (낙관적 업데이트)
      queryClient.setQueryData(profileKeys.current(), updatedProfile);

      // 관련 쿼리들 무효화하여 리페치
      queryClient.invalidateQueries({ queryKey: profileKeys.all });
    },
  });
};
