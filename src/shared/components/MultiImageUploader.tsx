"use client";

import { useState, useEffect } from 'react';
import { Plus, X, Sparkles, AlertCircle } from 'lucide-react';
import { Label } from '@/shared/components/ui/label';
import imageCompression from 'browser-image-compression';

interface MultiImageUploaderProps {
  title: string;
  recommendation?: string;
  images: File[];
  imagePreviews: string[];
  onImagesChange: (images: File[], previews: string[]) => void;
  required?: boolean;
  maxSize?: number; // MB 단위
  maxImages?: number;
  acceptedFormats?: string[];
  showFormatText?: string;
}

interface UploadError {
  type: 'size' | 'format' | 'count';
  message: string;
}

export function MultiImageUploader({
  title,
  recommendation = '1200x630px',
  images,
  imagePreviews,
  onImagesChange,
  required = false,
  maxSize = 5, // 5MB
  maxImages = 50,
  acceptedFormats = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
  showFormatText = 'PNG, JPG, GIF',
}: MultiImageUploaderProps) {
  const [error, setError] = useState<UploadError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // 각 이미지에 고유 ID 부여 (배열 순서가 바뀌어도 React가 추적 가능)
  const [imageIds, setImageIds] = useState<string[]>([]);

  // 파일 크기를 MB로 변환
  const bytesToMB = (bytes: number) => bytes / (1024 * 1024);

  // 파일 형식 검증
  const isValidFormat = (file: File): boolean => {
    return acceptedFormats.some(format => file.type === format);
  };

  // 파일 크기 검증
  const isValidSize = (file: File): boolean => {
    return bytesToMB(file.size) <= maxSize;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setError(null);
    setIsLoading(true);

    try {
      // 최대 이미지 개수 체크
      if (images.length + files.length > maxImages) {
        setError({
          type: 'count',
          message: `최대 ${maxImages}장까지만 업로드할 수 있습니다. (현재: ${images.length}장)`,
        });
        setIsLoading(false);
        e.target.value = '';
        return;
      }

      const newImages: File[] = [];
      const newPreviews: string[] = [];

      // 압축 옵션
      const compressionOptions = {
        maxSizeMB: 1,          // 1MB 이하로 압축
        maxWidthOrHeight: 1920, // 최대 1920px
        useWebWorker: true,
        fileType: 'image/jpeg' as const,
        initialQuality: 0.8,    // 품질 80%
      };

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 파일 형식 검증
        if (!isValidFormat(file)) {
          setError({
            type: 'format',
            message: `지원하지 않는 파일 형식입니다: ${file.name}`,
          });
          setIsLoading(false);
          e.target.value = '';
          return;
        }

        // 파일 크기 검증
        if (!isValidSize(file)) {
          setError({
            type: 'size',
            message: `파일 크기는 ${maxSize}MB 이하여야 합니다: ${file.name} (${bytesToMB(file.size).toFixed(2)}MB)`,
          });
          setIsLoading(false);
          e.target.value = '';
          return;
        }

        // 이미지 압축
        let processedFile = file;
        try {
          // GIF는 애니메이션 깨질 수 있으므로 압축 스킵
          if (file.type !== 'image/gif') {
            console.log(`압축 전: ${file.name} - ${bytesToMB(file.size).toFixed(2)}MB`);

            const compressedFile = await imageCompression(file, compressionOptions);

            console.log(`압축 후: ${compressedFile.name} - ${bytesToMB(compressedFile.size).toFixed(2)}MB`);
            console.log(`압축률: ${((1 - compressedFile.size / file.size) * 100).toFixed(1)}%`);

            processedFile = compressedFile;
          } else {
            console.log(`GIF 파일은 압축 스킵: ${file.name}`);
          }
        } catch (compressionError) {
          console.warn('이미지 압축 실패, 원본 사용:', compressionError);
          // 압축 실패해도 원본 파일 사용
        }

        newImages.push(processedFile);

        // Blob URL 생성 (Base64 대신 사용)
        const blobUrl = URL.createObjectURL(processedFile);
        newPreviews.push(blobUrl);
      }

      // 새로운 이미지들에 고유 ID 부여
      const newIds = newImages.map(() => crypto.randomUUID());
      setImageIds([...imageIds, ...newIds]);

      onImagesChange([...images, ...newImages], [...imagePreviews, ...newPreviews]);
    } catch (err) {
      setError({
        type: 'format',
        message: '이미지 업로드 중 오류가 발생했습니다.',
      });
    } finally {
      setIsLoading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    // Blob URL 메모리 해제
    const blobUrl = imagePreviews[index];
    if (blobUrl && blobUrl.startsWith('blob:')) {
      URL.revokeObjectURL(blobUrl);
    }

    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newIds = imageIds.filter((_, i) => i !== index);

    setImageIds(newIds);
    onImagesChange(newImages, newPreviews);

    // 이미지 삭제 시 에러 초기화
    if (error?.type === 'count') {
      setError(null);
    }
  };

  const handleSetPrimaryImage = (index: number) => {
    if (index === 0) return; // 이미 대표 이미지인 경우

    // 선택한 이미지를 첫 번째로 이동 (ID도 함께 이동)
    const newImages = [images[index], ...images.filter((_, i) => i !== index)];
    const newPreviews = [imagePreviews[index], ...imagePreviews.filter((_, i) => i !== index)];
    const newIds = [imageIds[index], ...imageIds.filter((_, i) => i !== index)];

    setImageIds(newIds);
    onImagesChange(newImages, newPreviews);
  };

  // 컴포넌트 언마운트 시 모든 Blob URL 메모리 해제
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (preview && preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  return (
    <div className="space-y-2">
      <Label className="text-sm mb-2 block flex items-center gap-1.5">
        <span>{title}</span>
        {required && <span className="text-accent-rose-dark">*</span>}
        <span className="text-base">📸</span>
      </Label>

      {/* 에러 메시지 */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <p>{error.message}</p>
        </div>
      )}

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-primary text-sm">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p>이미지를 업로드하는 중...</p>
        </div>
      )}

      {imagePreviews.length === 0 ? (
        <div className="relative border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent-rose/5 transition-all cursor-pointer group">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/10 to-accent-rose/10 group-hover:from-primary/20 group-hover:to-accent-rose/20 flex items-center justify-center transition-all">
            <span className="text-3xl group-hover:scale-110 transition-transform">🖼️</span>
          </div>
          <p className="text-sm mb-1">이미지 업로드</p>
          {recommendation && (
            <p className="text-xs text-muted-foreground">권장: {recommendation}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {showFormatText} (최대 {maxSize}MB)
          </p>
          {required && (
            <p className="text-xs text-primary mt-2">📸 최소 1장 이상 필요해요</p>
          )}
          <input
            type="file"
            accept={acceptedFormats.join(',')}
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageChange}
            required={required && imagePreviews.length === 0}
            aria-label={title}
            disabled={isLoading}
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
          {imagePreviews.map((preview, index) => {
            // 고유 ID 사용 (없으면 fallback으로 preview-index)
            const imageId = imageIds[index] || `${preview}-${index}`;

            return (
              <div
                key={imageId}
                className="relative aspect-square rounded-lg overflow-hidden border-2 border-border/60 bg-muted/20 group"
              >
                <img
                  src={preview}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              {/* 대표 이미지 뱃지 */}
              {index === 0 ? (
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-primary text-white text-xs rounded-md shadow-md flex items-center gap-1">
                  <span>⭐</span>
                  <span className="hidden sm:inline">대표</span>
                </div>
              ) : (
                <button
                  type="button"
                  className="absolute top-1.5 left-1.5 px-2 py-1 bg-primary hover:bg-primary/90 text-white text-xs rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1"
                  onClick={() => handleSetPrimaryImage(index)}
                  aria-label={`${index + 1}번 이미지를 대표 이미지로 설정`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span className="hidden sm:inline">대표로</span>
                </button>
              )}
              {/* 삭제 버튼 */}
              <button
                type="button"
                className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-all shadow-md opacity-0 group-hover:opacity-100"
                onClick={() => handleRemoveImage(index)}
                aria-label={`${index + 1}번 이미지 삭제`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
          })}
          {/* 추가 버튼 - 최대 개수 미만일 때만 표시 */}
          {images.length < maxImages && (
            <div className="relative aspect-square rounded-lg border-2 border-dashed border-border/60 hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent-rose/5 transition-all cursor-pointer group">
              <div className="w-full h-full flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-accent-rose/10 group-hover:from-primary/20 group-hover:to-accent-rose/20 flex items-center justify-center transition-all mb-1">
                  <Plus className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                </div>
                <p className="text-xs text-muted-foreground">추가</p>
              </div>
              <input
                type="file"
                accept={acceptedFormats.join(',')}
                multiple
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleImageChange}
                aria-label="이미지 추가"
                disabled={isLoading}
              />
            </div>
          )}
        </div>
      )}

      {/* 이미지 개수 표시 */}
      {imagePreviews.length > 0 && (
        <p className="text-xs text-muted-foreground flex items-center gap-1.5">
          <span className="text-base">📊</span>
          <span>
            {imagePreviews.length}장 / {maxImages}장
            {imagePreviews.length >= maxImages && ' (최대)'}
          </span>
        </p>
      )}
    </div>
  );
}
