import { supabase } from '@/lib/supabase/client';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  success: boolean;
  uploadedUrls: string[];
  failedFiles: File[];
  transactionId: string;
  error?: string;
}

interface UploadOptions {
  bucketName: string;
  folder: string;
  onProgress?: (uploaded: number, total: number) => void;
  maxRetries?: number;
}

/**
 * 여러 이미지를 Supabase Storage에 업로드
 * - 재시도 로직 포함 (exponential backoff)
 * - 진행률 추적
 * - 실패한 파일과 성공한 파일 분리
 */
export async function uploadImagesToStorage(
  files: File[],
  options: UploadOptions
): Promise<UploadResult> {
  const {
    bucketName,
    folder,
    onProgress,
    maxRetries = 3,
  } = options;

  // 🔍 디버깅: 세션 확인
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  console.log('🔐 Upload - Session Check:', {
    hasSession: !!session,
    sessionError,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    accessToken: session?.access_token ? '존재함' : '없음',
  });

  if (!session || !session.access_token) {
    console.error('❌ No valid session for upload');
    return {
      success: false,
      uploadedUrls: [],
      failedFiles: files,
      transactionId: uuidv4(),
      error: '인증 세션이 없습니다. 다시 로그인해주세요.',
    };
  }

  const transactionId = uuidv4();
  const uploadedUrls: string[] = [];
  const failedFiles: File[] = [];

  let uploadedCount = 0;
  const totalFiles = files.length;

  // 각 파일을 업로드 (순차 처리로 진행률 정확도 향상)
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // 파일 확장자 추출
    const fileExtension = file.name.split('.').pop() || 'jpg';

    // 파일명 생성: UUID를 사용하여 고유한 파일명 생성
    // 재시도 시에도 동일한 경로를 보장하기 위해 index를 prefix로 사용
    const fileUuid = uuidv4();
    const fileName = `${folder}/${transactionId}/${i}_${fileUuid}.${fileExtension}`;

    // 재시도 로직
    let uploaded = false;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`📤 Uploading file (attempt ${attempt + 1}/${maxRetries}):`, {
          fileName,
          fileSize: file.size,
          bucketName,
        });

        const { error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: true, // 재시도 시 같은 파일 덮어쓰기 허용
          });

        if (error) {
          console.error('❌ Upload error:', {
            message: error.message,
            statusCode: (error as any).statusCode,
            errorCode: (error as any).error,
            fileName,
          });
          throw error;
        }

        // Public URL 생성
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(fileName);

        uploadedUrls.push(urlData.publicUrl);
        uploaded = true;
        break;
      } catch (error) {
        lastError = error as Error;

        // 마지막 시도가 아니면 대기 후 재시도
        if (attempt < maxRetries - 1) {
          // Exponential backoff: 1초, 2초, 4초
          const delay = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    if (!uploaded) {
      console.error(`파일 업로드 실패 (${maxRetries}회 재시도): ${file.name}`, lastError);
      failedFiles.push(file);
    }

    // 진행률 업데이트
    uploadedCount++;
    if (onProgress) {
      onProgress(uploadedCount, totalFiles);
    }
  }

  return {
    success: failedFiles.length === 0,
    uploadedUrls,
    failedFiles,
    transactionId,
    error: failedFiles.length > 0
      ? `${failedFiles.length}개 파일 업로드 실패`
      : undefined,
  };
}

/**
 * 단일 이미지 업로드 (간단한 케이스용)
 */
export async function uploadSingleImage(
  file: File,
  bucketName: string,
  folder: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const result = await uploadImagesToStorage([file], {
    bucketName,
    folder,
  });

  return {
    success: result.success,
    url: result.uploadedUrls[0],
    error: result.error,
  };
}

/**
 * Storage에서 이미지 삭제 (롤백용)
 */
export async function deleteImagesFromStorage(
  urls: string[],
  bucketName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Public URL에서 파일 경로 추출
    const paths = urls.map((url) => {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split(`/storage/v1/object/public/${bucketName}/`);
      return pathParts[1];
    });

    const { error } = await supabase.storage
      .from(bucketName)
      .remove(paths);

    if (error) throw error;

    return { success: true };
  } catch (error) {
    console.error('이미지 삭제 실패:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '삭제 중 오류 발생',
    };
  }
}
