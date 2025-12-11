"use client";

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { BackButton } from '@/shared/components/BackButton';
import { MultiImageUploader, BaseModal } from '@/shared/components';
import { useAuthUtils } from '@/domains/auth';
import { useUIStore } from '@/shared/store';
import regionsData from '@/assets/regions.json';
import { useGroupCategories } from '@/shared/hooks';
import type { CategoryCode } from '@/shared/types';

interface CreateGroupScreenProps {
  onBack: () => void;
  onCreate: (groupData: any) => void;
}

export function CreateGroupScreen({ onBack, onCreate }: CreateGroupScreenProps) {
  // React Query를 통한 인증 정보 가져오기
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthUtils();
  const { openLoginModal } = useUIStore();

  // 그룹 카테고리 목록 조회 (DB에서)
  const { data: categories = [], isLoading: isCategoriesLoading } = useGroupCategories();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<CategoryCode>('SOCIAL');
  const [requiresApproval, setRequiresApproval] = useState(false);
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'saving' | 'done'>('idle');

  // regions.json 데이터를 배열로 변환
  const allLocations = useMemo(() => {
    const locations: { display: string; city: string; district: string }[] = [];

    Object.entries(regionsData).forEach(([cityName, districts]) => {
      (districts as string[]).forEach((districtName) => {
        // 세종시는 시군구가 없으므로 "세종시"만 표시
        if (cityName === '세종시' && districtName === '세종시') {
          locations.push({
            display: '세종시',
            city: cityName,
            district: districtName,
          });
        } else {
          locations.push({
            display: `${cityName} ${districtName}`,
            city: cityName,
            district: districtName,
          });
        }
      });
    });

    return locations;
  }, []);

  // 검색어로 필터링된 위치 목록
  const filteredLocations = useMemo(() => {
    if (locationSearchQuery === '') {
      return allLocations;
    }

    const query = locationSearchQuery.toLowerCase();
    return allLocations.filter(
      (loc) =>
        loc.display.toLowerCase().includes(query) ||
        loc.city.toLowerCase().includes(query) ||
        loc.district.toLowerCase().includes(query)
    );
  }, [allLocations, locationSearchQuery]);

  const handleLocationSelect = (locationDisplay: string) => {
    setLocation(locationDisplay);
    setIsLocationDialogOpen(false);
    setLocationSearchQuery('');
  };

  // 폼 검증 함수
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // 이름 검증
    if (!name.trim()) {
      errors.name = '그룹 이름을 입력해주세요';
    }

    // 설명 검증 (최소 50자)
    if (!description.trim()) {
      errors.description = '그룹 설명을 입력해주세요';
    } else if (description.trim().length < 50) {
      errors.description = `설명은 최소 50자 이상이어야 합니다 (현재: ${description.trim().length}자)`;
    }

    // 위치 검증
    if (!location.trim()) {
      errors.location = '그룹 활동 지역을 선택해주세요';
    }

    // 이미지 검증 (최소 1장)
    if (images.length === 0) {
      errors.images = '그룹 사진을 최소 1장 이상 업로드해주세요';
    } else if (images.length > 500) {
      errors.images = '그룹 사진은 최대 500장까지 업로드 가능합니다';
    }

    // requiresApproval 검증 (boolean 확인)
    if (typeof requiresApproval !== 'boolean') {
      errors.requiresApproval = '가입 승인 설정을 선택해주세요';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 중복 제출 방지
    if (isSubmitting) return;

    // 클라이언트 검증
    if (!validateForm()) {
      const firstError = Object.keys(formErrors)[0];
      if (firstError) {
        alert(formErrors[firstError]);
      }
      return;
    }

    // 인증 확인
    if (!isAuthenticated || !user) {
      openLoginModal();
      alert('로그인이 필요합니다');
      return;
    }

    setIsSubmitting(true);
    setFormErrors({});
    setUploadProgress(0);
    setUploadStatus('uploading');

    try {
      // 1. BFF API를 통한 이미지 업로드
      const formData = new FormData();
      formData.append('folder', 'group');

      images.forEach((image, index) => {
        formData.append(`file${index}`, image);
      });

      const uploadResponse = await fetch('/api/upload/images', {
        method: 'POST',
        body: formData,
      });

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        throw new Error(
          uploadResult.error || '이미지 업로드에 실패했습니다'
        );
      }

      setUploadProgress(100);

      // 2. BFF에 DB 저장 요청
      setUploadStatus('saving');

      const response = await fetch('/api/groups/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: uploadResult.transactionId,
          imageUrls: uploadResult.uploadedUrls,
          name: name.trim(),
          description: description.trim(),
          location: location.trim(),
          category,
          requiresApproval,
          hostId: user.id,
          hostName: user.name,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || '그룹 생성에 실패했습니다');
      }

      setUploadStatus('done');

      // 성공 시 콜백 호출
      onCreate(result.data);
    } catch (error) {
      console.error('그룹 생성 오류:', error);

      // 에러 메시지 표시
      const errorMessage = error instanceof Error
        ? error.message
        : '그룹 생성 중 오류가 발생했습니다';

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadStatus('idle');
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto overscroll-contain pb-24 lg:pb-6">
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-24 xl:px-32 2xl:px-40 py-4 lg:py-6 space-y-5">
          {/* Header */}
          <div className="flex items-center gap-3 mb-2">
            <BackButton onClick={onBack} />
            <div className="flex items-center gap-2">
              <span className="text-2xl">👥</span>
              <h1 className="text-xl lg:text-2xl">그룹 만들기</h1>
            </div>
          </div>

        {/* Basic Information */}
        <div className="relative bg-gradient-to-br from-card via-card to-accent-rose/5 rounded-2xl p-5 border border-border/50 shadow-sm space-y-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-rose/10 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-primary/5 rounded-full blur-2xl -z-0"></div>
          
          <div className="flex items-center gap-2 mb-1 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
              <span className="text-xl">📝</span>
            </div>
            <h3 className="text-base">기본 정보</h3>
          </div>

          {/* Group Name */}
          <div className="space-y-2 relative z-10">
            <Label htmlFor="name" className="text-sm flex items-center gap-1.5">
              <span>그룹 이름</span>
              <span className="text-accent-rose-dark">*</span>
            </Label>
            <Input
              id="name"
              placeholder="예: Seoul International Friends ✨"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 bg-input-background border-border/60"
              required
            />
            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="text-base">💡</span>
              <span className="pt-0.5">그룹의 목적을 반영하는 이름을 선택하세요</span>
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2 relative z-10">
            <Label htmlFor="description" className="text-sm flex items-center gap-1.5 justify-between">
              <div className="flex items-center gap-1.5">
                <span>설명</span>
                <span className="text-accent-rose-dark">*</span>
              </div>
              <span className={`text-xs ${description.trim().length >= 50 ? 'text-green-600' : 'text-muted-foreground'}`}>
                {description.trim().length} / 50자
              </span>
            </Label>
            <Textarea
              id="description"
              placeholder="그룹의 목적, 활동 내용, 어떤 사람들이 참여하면 좋을지 알려주세요... 💭"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                const length = e.target.value.trim().length;

                // 실시간 검증: 입력이 있고 50자 미만일 때 에러 표시
                if (length > 0 && length < 50) {
                  setFormErrors((prev) => ({
                    ...prev,
                    description: `설명은 최소 50자 이상이어야 합니다 (현재: ${length}자)`,
                  }));
                } else {
                  // 에러 초기화
                  setFormErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.description;
                    return newErrors;
                  });
                }
              }}
              rows={6}
              className="resize-none bg-input-background border-border/60"
              required
            />
            {formErrors.description ? (
              <p className="text-sm text-red-600">{formErrors.description}</p>
            ) : (
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-base">✨</span>
                <span className="pt-0.5">자세한 설명은 더 많은 멤버를 모을 수 있어요 (최소 50자)</span>
              </p>
            )}
          </div>

          {/* Group Image */}
          <div className="relative z-10">
            <MultiImageUploader
              title="그룹 사진 업로드"
              recommendation="1200x630px"
              images={images}
              imagePreviews={imagePreviews}
              onImagesChange={(newImages, newPreviews) => {
                setImages(newImages);
                setImagePreviews(newPreviews);
                // 이미지 변경 시 에러 초기화
                if (formErrors.images) {
                  setFormErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.images;
                    return newErrors;
                  });
                }
              }}
              required={true}
              maxSize={5}
              maxImages={500}
              showFormatText="PNG, JPG, GIF"
            />
            {formErrors.images && (
              <p className="text-sm text-red-600 mt-2">{formErrors.images}</p>
            )}
          </div>
        </div>

        {/* Location */}
        <div className="relative bg-gradient-to-br from-card via-card to-accent-sage/10 rounded-2xl p-5 border border-border/50 shadow-sm overflow-hidden space-y-4">
          <div className="absolute top-0 right-0 w-28 h-28 bg-accent-sage/10 rounded-full blur-3xl -z-0"></div>
          
          <div className="flex items-center gap-2 mb-1 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
              <span className="text-xl">📍</span>
            </div>
            <Label className="text-base">위치</Label>
            <span className="text-accent-rose-dark">*</span>
          </div>
          
          <div className="space-y-2 relative z-10">
            <div className="flex gap-2">
              <Input
                placeholder="시, 구를 검색하세요"
                value={location}
                readOnly
                className="h-12 bg-input-background border-border/60 flex-1 cursor-pointer"
                onClick={() => setIsLocationDialogOpen(true)}
                required
              />
              <Button
                type="button"
                variant="outline"
                className="h-12 px-4 border-border/60 flex items-center gap-2"
                onClick={() => setIsLocationDialogOpen(true)}
              >
                <Search className="w-4 h-4" />
                <span>검색</span>
              </Button>
            </div>
            {formErrors.location ? (
              <p className="text-sm text-red-600">{formErrors.location}</p>
            ) : (
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-base">📍</span>
                <span className="pt-0.5">그룹의 주요 활동 지역을 선택하세요</span>
              </p>
            )}
          </div>

          <BaseModal
            isOpen={isLocationDialogOpen}
            onClose={() => setIsLocationDialogOpen(false)}
            title="위치 검색"
            icon={<span className="text-xl">🔍</span>}
            size="medium"
            closable
            closeOnBackdrop
            preventBodyScroll
            className="h-[600px]"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                시, 구 단위로 지역을 검색하세요
              </p>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="예: 강남구, 서울, 부산"
                  value={locationSearchQuery}
                  onChange={(e) => setLocationSearchQuery(e.target.value)}
                  className="pl-10 h-11 bg-input-background border-border/60"
                />
              </div>

              <div className="h-[400px] overflow-y-auto space-y-2 pr-2">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((loc, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleLocationSelect(loc.display)}
                      className="w-full text-left p-3 rounded-lg border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all flex items-center gap-2"
                    >
                      <span className="text-lg">📍</span>
                      <div className="text-sm">{loc.display}</div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <span className="text-3xl mb-2 block">🔍</span>
                    <p className="text-sm">검색 결과가 없습니다</p>
                  </div>
                )}
              </div>
            </div>
          </BaseModal>
        </div>

        {/* Category */}
        <div className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl p-5 border border-border/50 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-rose/10 rounded-full blur-2xl -z-0"></div>
          
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
              <span className="text-xl">🏷️</span>
            </div>
            <Label className="text-base">카테고리</Label>
            <span className="text-accent-rose-dark">*</span>
          </div>
          
          <div className="flex flex-wrap gap-2.5 relative z-10">
            {isCategoriesLoading ? (
              <div className="text-sm text-muted-foreground">카테고리 로딩 중...</div>
            ) : (
              categories.map((cat) => (
                <button
                  key={cat.code}
                  type="button"
                  onClick={() => setCategory(cat.code as CategoryCode)}
                  className={`p-3.5 rounded-xl border-2 transition-all text-sm flex items-center gap-2.5 ${
                    category === cat.code
                      ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-md scale-[1.01]'
                      : 'border-border/60 hover:border-primary/40 hover:bg-gradient-to-br hover:from-muted/30 hover:to-accent-rose/5 hover:scale-[1.005]'
                  }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Approval Setting */}
        <div className="relative bg-gradient-to-br from-card via-card to-accent-sage/10 rounded-2xl p-5 border border-border/50 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-sage/10 rounded-full blur-3xl -z-0"></div>

          <div className="flex items-center gap-2 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
              <span className="text-xl">🔒</span>
            </div>
            <Label className="text-base">가입 승인 설정</Label>
            <span className="text-accent-rose-dark">*</span>
          </div>

          <div className="grid grid-cols-2 gap-3 relative z-10">
            <button
              type="button"
              onClick={() => setRequiresApproval(false)}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                !requiresApproval
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.01]'
                  : 'border-border/60 hover:border-primary/40 hover:bg-gradient-to-br hover:from-muted/30 hover:to-accent-sage/5'
              }`}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  !requiresApproval
                    ? 'bg-gradient-to-br from-primary/20 to-primary/10'
                    : 'bg-muted/50'
                }`}>
                  <span className="text-2xl">🌍</span>
                </div>
                <div>
                  <div className={`text-sm font-medium ${!requiresApproval ? 'text-primary' : ''}`}>
                    승인 불필요
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    누구나 신청하면 바로 가입할 수 있습니다
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRequiresApproval(true)}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                requiresApproval
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.01]'
                  : 'border-border/60 hover:border-primary/40 hover:bg-gradient-to-br hover:from-muted/30 hover:to-accent-sage/5'
              }`}
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  requiresApproval
                    ? 'bg-gradient-to-br from-primary/20 to-primary/10'
                    : 'bg-muted/50'
                }`}>
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <div className={`text-sm font-medium ${requiresApproval ? 'text-primary' : ''}`}>
                    승인 필요
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    운영자가 승인한 회원만 가입할 수 있습니다
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="relative bg-gradient-to-br from-accent-sage/5 via-accent-sage/10 to-primary/5 rounded-2xl p-5 border border-primary/20 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-accent-sage/20 rounded-full blur-3xl -z-0"></div>
          
          <div className="flex gap-3 relative z-10">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
                <span className="text-xl">📋</span>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-base">커뮤니티 가이드라인</span>
                <span className="text-lg">✨</span>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">💚</span>
                  <span className="pt-0.5">모든 멤버를 존중하고 포용하세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">🎯</span>
                  <span className="pt-0.5">그룹 목적에 맞는 콘텐츠를 공유하세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">🚫</span>
                  <span className="pt-0.5">스팸, 괴롭힘, 부적절한 콘텐츠는 금지됩니다</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-base flex-shrink-0">📅</span>
                  <span className="pt-0.5">정기적인 모임과 활동을 조직하세요</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

          {/* Upload Progress */}
          {isSubmitting && (
            <div className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl p-5 border border-border/50 shadow-sm overflow-hidden">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
                      <span className="text-xl">
                        {uploadStatus === 'uploading' && '📤'}
                        {uploadStatus === 'saving' && '💾'}
                        {uploadStatus === 'done' && '✅'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-base font-medium">
                        {uploadStatus === 'uploading' && '이미지 업로드 중...'}
                        {uploadStatus === 'saving' && '그룹 정보 저장 중...'}
                        {uploadStatus === 'done' && '완료!'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {uploadStatus === 'uploading' && `${uploadProgress}% 완료`}
                        {uploadStatus === 'saving' && '잠시만 기다려주세요'}
                        {uploadStatus === 'done' && '그룹이 생성되었습니다'}
                      </p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {uploadProgress}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <Button
              type="submit"
              disabled={isSubmitting || isAuthLoading}
              className="w-full h-12 shadow-md bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary flex items-center justify-center gap-2"
            >
              {isAuthLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>인증 확인 중...</span>
                </>
              ) : isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>
                    {uploadStatus === 'uploading' && '업로드 중...'}
                    {uploadStatus === 'saving' && '저장 중...'}
                    {uploadStatus === 'done' && '완료!'}
                    {uploadStatus === 'idle' && '생성 중...'}
                  </span>
                </>
              ) : (
                <>
                  <span>그룹 만들기</span>
                  <span className="text-lg">✨</span>
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              disabled={isSubmitting || isAuthLoading}
              className="w-full h-12 border-border/60"
            >
              취소
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
