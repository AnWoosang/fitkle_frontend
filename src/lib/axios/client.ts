/**
 * Axios API Client
 *
 * BFF(Backend For Frontend) API와 통신하기 위한 Axios 클라이언트
 * 모든 API 요청은 이 클라이언트를 통해 이루어집니다.
 *
 * @example
 * ```typescript
 * import { apiClient } from '@/lib/axios/client';
 *
 * const response = await apiClient.get('/events');
 * const event = await apiClient.post('/events', eventData);
 * ```
 */

import axios, { AxiosError, AxiosResponse } from 'axios';

/**
 * API 응답 타입 (성공)
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

/**
 * API 응답 타입 (에러)
 */
export interface ApiErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}

/**
 * API 응답 타입 (통합)
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Axios 클라이언트 인스턴스
 */
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30초 타임아웃
});

/**
 * 응답 인터셉터: 성공 응답 처리
 * API 응답에서 실제 데이터만 추출하여 반환합니다.
 * API 응답: { success: true, data: T } → 반환: T
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // API가 { success: true, data: T } 형태로 응답한 경우
    // 실제 데이터(data 필드)만 추출하여 반환
    if (response.data && 'data' in response.data) {
      return response.data.data as any;
    }
    // 예외적으로 data 필드가 없는 경우 전체 응답 반환
    return response.data as any;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // 401 에러는 정상적인 비로그인 상태이므로 로깅하지 않음
    if (error.response?.status !== 401) {
      console.error('API Error:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        message: error.response?.data?.error || error.message,
      });
    }

    // 에러 응답이 있는 경우
    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    // 네트워크 에러 등 응답이 없는 경우
    return Promise.reject({
      success: false,
      error: error.message || 'Network error occurred',
      code: error.code,
    } as ApiErrorResponse);
  }
);

/**
 * 요청 인터셉터: 인증 토큰 추가 (필요시)
 * 향후 인증 기능 구현 시 사용
 */
apiClient.interceptors.request.use(
  (config) => {
    // TODO: 로컬 스토리지에서 토큰을 가져와 헤더에 추가
    // const token = localStorage.getItem('auth_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * FormData를 사용하는 Axios 클라이언트 (파일 업로드용)
 */
export const apiFormClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  timeout: 60000, // 60초 타임아웃 (파일 업로드는 더 오래 걸릴 수 있음)
});

// FormData 클라이언트에도 동일한 인터셉터 적용
apiFormClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // API가 { success: true, data: T } 형태로 응답한 경우
    // 실제 데이터(data 필드)만 추출하여 반환
    if (response.data && 'data' in response.data) {
      return response.data.data as any;
    }
    // 예외적으로 data 필드가 없는 경우 전체 응답 반환
    return response.data as any;
  },
  (error: AxiosError<ApiErrorResponse>) => {
    // 401 에러는 정상적인 비로그인 상태이므로 로깅하지 않음
    if (error.response?.status !== 401) {
      console.error('API Upload Error:', {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status: error.response?.status,
        message: error.response?.data?.error || error.message,
      });
    }

    if (error.response?.data) {
      return Promise.reject(error.response.data);
    }

    return Promise.reject({
      success: false,
      error: error.message || 'Upload error occurred',
      code: error.code,
    } as ApiErrorResponse);
  }
);
