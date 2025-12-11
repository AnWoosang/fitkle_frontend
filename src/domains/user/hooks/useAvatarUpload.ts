'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

interface AvatarUploadResponse {
  success: boolean;
  avatarUrl: string;
  message: string;
}

interface AvatarUploadError {
  error: string;
}

/**
 * 프로필 아바타 업로드 훅
 *
 * BFF API를 통해 안전하게 이미지 업로드:
 * - 서버에서 파일 검증 (타입, 크기)
 * - Supabase 자격증명 보호
 * - 업로드 진행률 표시
 * - 자동 캐시 무효화
 */
export function useAvatarUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const queryClient = useQueryClient();

  const mutation = useMutation<AvatarUploadResponse, Error, File>({
    mutationFn: async (file: File) => {
      // FormData 생성
      const formData = new FormData();
      formData.append('file', file);

      // XMLHttpRequest로 진행률 추적
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        // 진행률 이벤트
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(percentComplete);
          }
        });

        // 완료 이벤트
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response: AvatarUploadResponse = JSON.parse(xhr.responseText);
            resolve(response);
          } else {
            const error: AvatarUploadError = JSON.parse(xhr.responseText);
            reject(new Error(error.error || '업로드 실패'));
          }
        });

        // 에러 이벤트
        xhr.addEventListener('error', () => {
          reject(new Error('네트워크 오류가 발생했습니다.'));
        });

        // 타임아웃 이벤트
        xhr.addEventListener('timeout', () => {
          reject(new Error('업로드 시간이 초과되었습니다.'));
        });

        // 요청 전송
        xhr.open('POST', '/api/upload/avatar');
        xhr.timeout = 30000; // 30초 타임아웃
        xhr.send(formData);
      });
    },
    onSuccess: (data) => {
      // 캐시 무효화 (프로필 데이터 다시 불러오기)
      queryClient.invalidateQueries({ queryKey: ['profile'] });

      // 성공 토스트
      toast.success(data.message || '프로필 사진이 업데이트되었습니다.');

      // 진행률 초기화
      setUploadProgress(0);
    },
    onError: (error) => {
      // 에러 토스트
      toast.error(error.message || '업로드에 실패했습니다.');

      // 진행률 초기화
      setUploadProgress(0);
    },
  });

  return {
    uploadAvatar: mutation.mutate,
    uploadAvatarAsync: mutation.mutateAsync,
    isUploading: mutation.isPending,
    uploadProgress,
    error: mutation.error,
  };
}
