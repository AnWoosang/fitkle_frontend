'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authKeys } from '../constants/authQueryKeys';
import { User, LoginForm, SignupForm } from '../types/auth';
import { useAuthStore } from '../store/authStore';
import { BusinessError } from '@/shared/error/BusinessError';
import { authApi } from '../api/authApi';

/**
 * 현재 로그인한 사용자 정보 조회
 * - BFF를 통해 사용자 정보 가져오기
 * - React Query가 단일 진실 공급원(Single Source of Truth)
 * - authStore와 자동 동기화 (로컬 스토리지 persist)
 */
export const useAuth = () => {
  const { setUser, logout } = useAuthStore();

  return useQuery<User | null>({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        const user = await authApi.getCurrentUser();

        // authStore 동기화
        if (user) {
          setUser(user);
        } else {
          logout();
        }

        return user;
      } catch (error: any) {
        // 401 에러는 로그인되지 않은 상태
        if (error?.response?.status === 401) {
          logout(); // authStore 초기화
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 30, // 30분간 fresh
    gcTime: 1000 * 60 * 45,    // 45분간 캐시 유지
    retry: false,
  });
};

/**
 * 인증 유틸리티 훅
 * - 인증 여부, 사용자 정보, 로딩 상태 등 제공
 */
export const useAuthUtils = () => {
  const { data: user, isLoading, error } = useAuth();

  return {
    user: user as User | null,
    isAuthenticated: !!user,
    isLoading,
    error,
    hasRole: (role: 'user' | 'admin') => user?.role === role,
  };
};

/**
 * useAuthQueries
 * - useAuthUtils의 별칭 (Pickdam 패턴 호환)
 */
export const useAuthQueries = useAuthUtils;

/**
 * Supabase Auth 상태 변경 감지 훅 (deprecated)
 * - BFF 패턴으로 전환하면서 더 이상 필요하지 않음
 * - 각 mutation의 onSuccess에서 캐시를 직접 업데이트
 */
export const useAuthStateSync = () => {
  // BFF로 전환하면서 더 이상 사용하지 않음
  // 하위 호환성을 위해 빈 함수로 유지
};

/**
 * 로그인 Mutation
 * - Supabase Auth signInWithPassword 직접 호출
 * - React Query 캐시 자동 업데이트 (useAuthStateSync가 처리)
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, showToast, closeLoginModal } = useAuthStore();

  return useMutation({
    mutationKey: authKeys.login(),
    mutationFn: async (form: LoginForm) => {
      const user = await authApi.loginWithEmail(form);
      return user;
    },
    onSuccess: (user) => {
      // React Query 캐시 업데이트
      queryClient.setQueryData(authKeys.user(), user);

      // authStore 업데이트 (로컬 스토리지 persist)
      setUser(user);

      // 성공 토스트 - nickname 표시
      showToast(`환영합니다, ${user.nickname}님!`, 'success');

      // 로그인 모달 닫기 (모달 사용 시)
      closeLoginModal();

      // 홈으로 리다이렉트
      router.push('/');
      router.refresh(); // 서버 컴포넌트 새로고침
    },
    onError: (error: BusinessError) => {
      // 에러 토스트
      showToast(error.message || '로그인에 실패했습니다', 'error');
    },
  });
};

/**
 * 회원가입 Mutation (단계별 플로우용)
 * - BFF를 통해 회원가입 처리
 * - SignupScreen에서 단계별로 사용할 때는 이 훅 사용
 * - onSuccess/onError를 호출 측에서 완전히 제어 가능
 */
export const useSignupStep = () => {
  return useMutation({
    mutationKey: authKeys.signup(),
    mutationFn: async (form: SignupForm) => {
      console.log('[useSignupStep] mutationFn 시작:', form);
      try {
        const user = await authApi.signupWithEmail(form);
        console.log('[useSignupStep] mutationFn 성공:', user);
        console.log('[useSignupStep] user 타입:', typeof user);
        console.log('[useSignupStep] user 내용:', JSON.stringify(user, null, 2));
        return user;
      } catch (error) {
        console.error('[useSignupStep] mutationFn 에러:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('[useSignupStep] ✅ 훅 레벨 onSuccess 실행됨');
      console.log('[useSignupStep] onSuccess data:', data);
    },
    onError: (error) => {
      console.error('[useSignupStep] ❌ 훅 레벨 onError 실행됨');
      console.error('[useSignupStep] onError error:', error);
    },
  });
};

/**
 * 회원가입 Mutation (일반 회원가입용)
 * - BFF를 통해 회원가입 처리
 * - React Query 캐시 자동 업데이트
 * - 회원가입 완료 후 바로 완료 페이지로 이동
 */
export const useSignup = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setUser, showToast } = useAuthStore();

  return useMutation({
    mutationKey: authKeys.signup(),
    mutationFn: async (form: SignupForm) => {
      console.log('[useSignup] mutationFn 시작:', form);
      const user = await authApi.signupWithEmail(form);
      console.log('[useSignup] mutationFn 성공:', user);
      return user;
    },
    onSuccess: (user) => {
      console.log('[useSignup] onSuccess 호출됨', user);
      // React Query 캐시 업데이트
      queryClient.setQueryData(authKeys.user(), user);

      // authStore 업데이트 (로컬 스토리지 persist)
      setUser(user);

      // 회원가입 완료 페이지로 리다이렉트 (이메일 인증 안내)
      router.push(`/signup-success?email=${encodeURIComponent(user.email)}`);
    },
    onError: (error: BusinessError) => {
      console.error('[useSignup] onError 호출됨:', error);
      // 에러 토스트
      showToast(error.message || '회원가입에 실패했습니다', 'error');
    },
  });
};

/**
 * 로그아웃 Mutation
 * - BFF를 통해 로그아웃 처리
 * - React Query 캐시 초기화
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout, showToast } = useAuthStore();

  return useMutation({
    mutationKey: authKeys.logout(),
    mutationFn: async () => {
      await authApi.logout();
    },
    onSuccess: () => {
      // React Query 캐시 초기화
      queryClient.setQueryData(authKeys.user(), null);
      queryClient.removeQueries({ queryKey: authKeys.all });

      // authStore 초기화 (로컬 스토리지 persist)
      logout();

      // 성공 토스트
      showToast('로그아웃되었습니다', 'success');

      // 홈으로 리다이렉트
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
    },
    onError: (error: any) => {
      showToast(error?.message || '로그아웃에 실패했습니다', 'error');
    },
  });
};

/**
 * 세션 갱신 Mutation
 * - BFF를 통해 세션 갱신 처리
 * - React Query 캐시 자동 업데이트
 */
export const useRefreshSession = () => {
  const queryClient = useQueryClient();
  const { setUser, logout } = useAuthStore();

  return useMutation({
    mutationKey: authKeys.refresh(),
    mutationFn: async () => {
      // BFF를 통해 세션 갱신
      const user = await authApi.refreshSession();
      return user;
    },
    onSuccess: (user) => {
      // React Query 캐시 업데이트
      queryClient.setQueryData(authKeys.user(), user);

      // authStore 업데이트 (로컬 스토리지 persist)
      setUser(user);
    },
    onError: () => {
      // 세션 갱신 실패 시 캐시 초기화 (로그아웃 처리)
      queryClient.setQueryData(authKeys.user(), null);

      // authStore 초기화 (로컬 스토리지 persist)
      logout();
    },
  });
};

/**
 * Google OAuth 로그인 Mutation
 * - BFF를 통해 OAuth URL 생성
 * - OAuth 페이지로 리다이렉트
 */
export const useGoogleLogin = () => {
  const { showToast } = useAuthStore();

  return useMutation({
    mutationKey: authKeys.googleLogin(),
    mutationFn: async () => {
      const { url } = await authApi.loginWithGoogle();
      return url;
    },
    onSuccess: (url) => {
      // OAuth 페이지로 리다이렉트
      window.location.href = url;
    },
    onError: (error: BusinessError) => {
      showToast(error.message || 'Google 로그인에 실패했습니다', 'error');
    },
  });
};

/**
 * Kakao OAuth 로그인 Mutation
 * - BFF를 통해 OAuth URL 생성
 * - OAuth 페이지로 리다이렉트
 */
export const useKakaoLogin = () => {
  const { showToast } = useAuthStore();

  return useMutation({
    mutationKey: authKeys.kakaoLogin(),
    mutationFn: async () => {
      const { url } = await authApi.loginWithKakao();
      return url;
    },
    onSuccess: (url) => {
      // OAuth 페이지로 리다이렉트
      window.location.href = url;
    },
    onError: (error: BusinessError) => {
      showToast(error.message || 'Kakao 로그인에 실패했습니다', 'error');
    },
  });
};
