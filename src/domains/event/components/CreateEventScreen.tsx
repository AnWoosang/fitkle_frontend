"use client";

import { BackButton } from '@/shared/components/BackButton';
import { MultiImageUploader } from '@/shared/components';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Calendar, Clock, Search, Users, Wifi } from 'lucide-react';
import { useState } from 'react';
import { getCoordinatesFromAddress } from '@/utils/kakao';
import { useAuthUtils } from '@/domains/auth';
import { useUIStore } from '@/shared/store';
import { uploadImagesToStorage } from '@/shared/utils/uploadImages';
import { useEventCategories } from '@/shared/hooks';
import { useMyGroups } from '@/domains/group/hooks';
import type { CategoryCode } from '@/shared/types';

// Daum Postcode 타입 정의
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          roadAddress: string;
          jibunAddress: string;
          zonecode: string;
          buildingName: string;
        }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

interface CreateEventScreenProps {
  onBack: () => void;
  onCreate: (eventData: any) => void;
}

export function CreateEventScreen({ onBack, onCreate }: CreateEventScreenProps) {
  // React Query를 통한 인증 정보 가져오기
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuthUtils();
  const { openLoginModal } = useUIStore();

  // 사용자가 호스트인 그룹 목록 조회
  const { data: myGroups = [], isLoading: isGroupsLoading } = useMyGroups();

  // 이벤트 카테고리 목록 조회 (DB에서)
  const { data: categories = [], isLoading: isCategoriesLoading } = useEventCategories();

  const [eventType, setEventType] = useState<'personal' | 'group'>('personal');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [isGroupMembersOnly, setIsGroupMembersOnly] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [locationType, setLocationType] = useState<'online' | 'offline'>('offline');
  const [location, setLocation] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [onlineLink, setOnlineLink] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [category, setCategory] = useState<CategoryCode>('SOCIAL');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'saving' | 'done'>('idle');

  // Daum 우편번호 서비스로 주소 검색
  const handleAddressSearch = () => {
    if (typeof window === 'undefined' || !window.daum) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: async function (data: any) {
        const fullAddress = data.roadAddress || data.jibunAddress;
        setLocation(fullAddress);

        const coords = await getCoordinatesFromAddress(fullAddress);

        if (coords) {
          setLatitude(coords.latitude);
          setLongitude(coords.longitude);
        } else {
          setLatitude(null);
          setLongitude(null);
        }
      },
    }).open();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) return;

    // 필수 필드 검증
    if (!title || !description || !date || !time || !category || !maxAttendees) {
      alert('필수 항목을 모두 입력해주세요');
      return;
    }

    if (locationType === 'offline' && (!location || latitude === null || longitude === null)) {
      alert('오프라인 이벤트는 주소 검색을 통해 위치를 설정해주세요');
      return;
    }

    if (locationType === 'online' && !onlineLink) {
      alert('온라인 이벤트는 링크를 입력해주세요');
      return;
    }

    if (eventType === 'group' && !selectedGroupId) {
      alert('그룹을 선택해주세요');
      return;
    }

    if (images.length > 10) {
      alert('이미지는 최대 10장까지 업로드 가능합니다');
      return;
    }

    if (!isAuthenticated || !user) {
      openLoginModal();
      alert('로그인이 필요합니다');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);
    setUploadStatus('uploading');

    try {
      // 이미지가 있는 경우에만 업로드
      let uploadedUrls: string[] = [];
      let transactionId = crypto.randomUUID();

      if (images.length > 0) {
        // 1. Storage에 이미지 직접 업로드
        const uploadResult = await uploadImagesToStorage(images, {
          bucketName: 'fitkle',
          folder: 'event',
          onProgress: (uploaded, total) => {
            const progress = Math.round((uploaded / total) * 100);
            setUploadProgress(progress);
          },
        });

        if (!uploadResult.success) {
          throw new Error(
            uploadResult.error ||
            `이미지 업로드 실패 (${uploadResult.failedFiles.length}개)`
          );
        }

        uploadedUrls = uploadResult.uploadedUrls;
        transactionId = uploadResult.transactionId;
      }

      // 2. BFF에 DB 저장 요청
      setUploadStatus('saving');
      setUploadProgress(100);

      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId,
          imageUrls: uploadedUrls,
          title: title.trim(),
          description: description.trim(),
          date,
          time,
          category,
          maxAttendees: parseInt(maxAttendees),
          hostId: user.id,
          hostName: user.name,
          type: locationType,
          location: locationType === 'offline' ? location.trim() : undefined,
          address: locationType === 'offline' ? detailedAddress.trim() : undefined,
          latitude: locationType === 'offline' ? latitude : undefined,
          longitude: locationType === 'offline' ? longitude : undefined,
          onlineLink: locationType === 'online' ? onlineLink.trim() : undefined,
          groupId: eventType === 'group' ? selectedGroupId : undefined,
          isGroupMembersOnly: eventType === 'group' ? isGroupMembersOnly : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || '이벤트 생성에 실패했습니다');
      }

      setUploadStatus('done');

      onCreate(result.data);
    } catch (error) {
      console.error('이벤트 생성 오류:', error);

      const errorMessage = error instanceof Error
        ? error.message
        : '이벤트 생성 중 오류가 발생했습니다';

      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
      setUploadStatus('idle');
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto overscroll-contain pb-24 lg:pb-6">
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-24 xl:px-32 2xl:px-40 py-4 lg:py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <BackButton onClick={onBack} />
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h1 className="text-xl lg:text-2xl">이벤트 만들기</h1>
          </div>
        </div>

        {/* Event Type Selection */}
        <div className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl p-5 border border-border/50 shadow-sm space-y-3 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-rose/10 rounded-full blur-2xl -z-0"></div>
          
          <div className="flex items-center gap-2 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
              <span className="text-xl">🎯</span>
            </div>
            <Label className="text-base">이벤트 타입</Label>
            <span className="text-accent-rose-dark">*</span>
          </div>
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <button
              type="button"
              onClick={() => {
                setEventType('personal');
                setSelectedGroupId('');
              }}
              className={`p-5 rounded-xl border-2 transition-all ${
                eventType === 'personal'
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.02]'
                  : 'border-border/60 hover:border-primary/40 hover:bg-muted/30 hover:scale-[1.01]'
              }`}
            >
              <div className="flex flex-col items-center gap-2.5">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  eventType === 'personal' 
                    ? 'bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm' 
                    : 'bg-muted/50'
                }`}>
                  <span className="text-3xl">👤</span>
                </div>
                <div>
                  <div className="text-sm">Personal Event</div>
                  <div className="text-xs text-muted-foreground mt-0.5">개인 이벤트</div>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setEventType('group')}
              className={`p-5 rounded-xl border-2 transition-all ${
                eventType === 'group'
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.02]'
                  : 'border-border/60 hover:border-primary/40 hover:bg-muted/30 hover:scale-[1.01]'
              }`}
            >
              <div className="flex flex-col items-center gap-2.5">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  eventType === 'group' 
                    ? 'bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm' 
                    : 'bg-muted/50'
                }`}>
                  <span className="text-3xl">👥</span>
                </div>
                <div>
                  <div className="text-sm">Group Event</div>
                  <div className="text-xs text-muted-foreground mt-0.5">그룹 이벤트</div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Group Selection - Only shown for Group Events */}
        {eventType === 'group' && (
          <div className="relative bg-gradient-to-br from-card via-card to-accent-sage/10 rounded-2xl p-5 border border-border/50 shadow-sm space-y-3 overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-accent-sage/10 rounded-full blur-3xl -z-0"></div>
            
            <div className="flex items-center gap-2 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
                <span className="text-xl">👥</span>
              </div>
              <Label htmlFor="group" className="text-base">그룹 선택</Label>
              <span className="text-accent-rose-dark">*</span>
            </div>
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId} required={eventType === 'group'}>
              <SelectTrigger className="w-full h-12 bg-input-background border-border/60">
                <SelectValue placeholder={isGroupsLoading ? "그룹 로딩 중..." : myGroups.length === 0 ? "생성한 그룹이 없습니다" : "이벤트를 만들 그룹을 선택하세요"} />
              </SelectTrigger>
              <SelectContent>
                {isGroupsLoading ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    그룹을 불러오는 중...
                  </div>
                ) : myGroups.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-muted-foreground">
                    먼저 그룹을 생성해주세요
                  </div>
                ) : (
                  myGroups.map((group) => (
                    <SelectItem key={group.id} value={group.id}>
                      <div className="flex items-center gap-2">
                        <span>{group.name}</span>
                        <span className="text-xs text-muted-foreground">({group.members}명)</span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground flex items-start gap-1.5 relative z-10">
              <span className="text-lg">💡</span>
              <span className="pt-0.5">선택한 그룹의 멤버들에게 이벤트가 표시됩니다</span>
            </p>
          </div>
        )}

        {/* Group Event Participation - Only shown for Group Events */}
        {eventType === 'group' && (
          <div className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl p-5 border border-border/50 shadow-sm space-y-3 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-0"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-sage/10 rounded-full blur-2xl -z-0"></div>

            <div className="flex items-center gap-2 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
                <span className="text-xl">🎫</span>
              </div>
              <Label className="text-base">참여 범위</Label>
              <span className="text-accent-rose-dark">*</span>
            </div>
            <div className="grid grid-cols-2 gap-3 relative z-10">
              <button
                type="button"
                onClick={() => setIsGroupMembersOnly(true)}
                className={`p-5 rounded-xl border-2 transition-all ${
                  isGroupMembersOnly
                    ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.02]'
                    : 'border-border/60 hover:border-primary/40 hover:bg-muted/30 hover:scale-[1.01]'
                }`}
              >
                <div className="flex flex-col items-center gap-2.5">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    isGroupMembersOnly
                      ? 'bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm'
                      : 'bg-muted/50'
                  }`}>
                    <span className="text-3xl">🔒</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">그룹원 전용</div>
                    <div className="text-xs text-muted-foreground mt-0.5">그룹 멤버만 참여</div>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setIsGroupMembersOnly(false)}
                className={`p-5 rounded-xl border-2 transition-all ${
                  !isGroupMembersOnly
                    ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.02]'
                    : 'border-border/60 hover:border-primary/40 hover:bg-muted/30 hover:scale-[1.01]'
                }`}
              >
                <div className="flex flex-col items-center gap-2.5">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                    !isGroupMembersOnly
                      ? 'bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm'
                      : 'bg-muted/50'
                  }`}>
                    <span className="text-3xl">🌍</span>
                  </div>
                  <div>
                    <div className="text-sm font-medium">모두 참여 가능</div>
                    <div className="text-xs text-muted-foreground mt-0.5">누구나 참여 가능</div>
                  </div>
                </div>
              </button>
            </div>
            <p className="text-xs text-muted-foreground flex items-start gap-1.5 relative z-10">
              <span className="text-lg">💡</span>
              <span className="pt-0.5">
                {isGroupMembersOnly
                  ? '그룹 멤버만 이벤트를 보고 참여할 수 있습니다'
                  : '그룹 외부 사용자도 이벤트를 검색하고 참여할 수 있습니다'}
              </span>
            </p>
          </div>
        )}

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

          {/* Title */}
          <div className="space-y-2 relative z-10">
            <Label htmlFor="title" className="text-sm flex items-center gap-1.5">
              <span>이벤트 제목</span>
              <span className="text-accent-rose-dark">*</span>
            </Label>
            <Input
              id="title"
              placeholder="예: 강남 브런치 & 수다 모임 ☕✨"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="h-12 bg-input-background border-border/60"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2 relative z-10">
            <Label htmlFor="description" className="text-sm flex items-center gap-1.5">
              <span>설명</span>
              <span className="text-accent-rose-dark">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="어떤 이벤트인지, 무엇을 할지, 누가 참여하면 좋을지 알려주세요... 💭"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="resize-none bg-input-background border-border/60"
              required
            />
            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="text-base">💡</span>
              <span className="pt-0.5">자세한 설명은 더 많은 참여를 이끌어냅니다!</span>
            </p>
          </div>

          {/* Category */}
          <div className="space-y-2 relative z-10">
            <Label className="text-sm flex items-center gap-1.5">
              <span>카테고리</span>
              <span className="text-accent-rose-dark">*</span>
            </Label>
            <div className="flex flex-wrap gap-2.5">
              {isCategoriesLoading ? (
                <div className="text-sm text-muted-foreground">카테고리 로딩 중...</div>
              ) : (
                categories.map((cat) => (
                  <button
                    key={cat.code}
                    type="button"
                    onClick={() => setCategory(cat.code as CategoryCode)}
                    className={`p-3.5 rounded-xl border-2 transition-all text-sm flex items-center gap-2 ${
                      category === cat.code
                        ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-md scale-[1.02]'
                        : 'border-border/60 hover:border-primary/40 hover:bg-gradient-to-br hover:from-muted/30 hover:to-accent-rose/5 hover:scale-[1.01]'
                    }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))
            )}
            </div>
          </div>

          {/* Event Image */}
          <div className="relative z-10">
            <MultiImageUploader
              title="이벤트 이미지"
              recommendation="1200x630px"
              images={images}
              imagePreviews={imagePreviews}
              onImagesChange={(newImages, newPreviews) => {
                setImages(newImages);
                setImagePreviews(newPreviews);
              }}
              required={false}
              maxSize={5}
              maxImages={10}
              showFormatText="PNG, JPG, GIF"
            />
          </div>
        </div>

        {/* Date & Time */}
        <div className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl p-5 border border-border/50 shadow-sm space-y-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-primary/10 rounded-full blur-3xl -z-0"></div>
          
          <div className="flex items-center gap-2 mb-1 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
              <span className="text-xl">🗓️</span>
            </div>
            <h3 className="text-base">날짜 및 시간</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3 relative z-10">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm flex items-center gap-1.5">
                <span>날짜</span>
                <span className="text-accent-rose-dark">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10 h-12 bg-input-background border-border/60"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="text-sm flex items-center gap-1.5">
                <span>시간</span>
                <span className="text-accent-rose-dark">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10 h-12 bg-input-background border-border/60"
                  required
                />
              </div>
            </div>
          </div>

        </div>

        {/* Location Type & Details */}
        <div className="relative bg-gradient-to-br from-card via-card to-accent-sage/10 rounded-2xl p-5 border border-border/50 shadow-sm space-y-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-sage/10 rounded-full blur-3xl -z-0"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent-rose/10 rounded-full blur-2xl -z-0"></div>
          
          <div className="flex items-center gap-2 mb-1 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
              <span className="text-xl">📍</span>
            </div>
            <h3 className="text-base">장소 정보</h3>
          </div>

          {/* Location Type Selection */}
          <div className="space-y-2 relative z-10">
            <Label className="text-sm flex items-center gap-1.5">
              <span>모임 방식</span>
              <span className="text-accent-rose-dark">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setLocationType('offline');
                  setOnlineLink('');
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  locationType === 'offline'
                    ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.02]'
                    : 'border-border/60 hover:border-primary/40 hover:bg-muted/30 hover:scale-[1.01]'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    locationType === 'offline' 
                      ? 'bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm' 
                      : 'bg-muted/50'
                  }`}>
                    <span className="text-2xl">📍</span>
                  </div>
                  <div>
                    <div className="text-sm">오프라인</div>
                    <div className="text-xs text-muted-foreground mt-0.5">실제 장소</div>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLocationType('online');
                  setLocation('');
                  setDetailedAddress('');
                }}
                className={`p-4 rounded-xl border-2 transition-all ${
                  locationType === 'online'
                    ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.02]'
                    : 'border-border/60 hover:border-primary/40 hover:bg-muted/30 hover:scale-[1.01]'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    locationType === 'online' 
                      ? 'bg-gradient-to-br from-primary/20 to-primary/10 shadow-sm' 
                      : 'bg-muted/50'
                  }`}>
                    <span className="text-2xl">💻</span>
                  </div>
                  <div>
                    <div className="text-sm">온라인</div>
                    <div className="text-xs text-muted-foreground mt-0.5">화상 모임</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Offline Location */}
          {locationType === 'offline' && (
            <>
              <div className="space-y-2 relative z-10">
                <Label className="text-sm flex items-center gap-1.5">
                  <span>도로명 주소</span>
                  <span className="text-accent-rose-dark">*</span>
                </Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="주소를 검색하세요"
                    value={location}
                    readOnly
                    className="h-12 bg-input-background border-border/60 flex-1 cursor-pointer"
                    onClick={handleAddressSearch}
                    required={locationType === 'offline'}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-4 border-border/60 flex items-center gap-2"
                    onClick={handleAddressSearch}
                  >
                    <Search className="w-4 h-4" />
                    <span>검색</span>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                  <span className="text-base">📍</span>
                  <span className="pt-0.5">정확한 주소를 입력하면 참가자들이 찾기 쉬워요</span>
                </p>
              </div>

              <div className="space-y-2 relative z-10">
                <Label htmlFor="detailedAddress" className="text-sm flex items-center gap-1.5">
                  <span>상세 주소</span>
                  <span className="text-muted-foreground text-xs">(선택)</span>
                </Label>
                <Input
                  id="detailedAddress"
                  placeholder="예: 2층 스타벅스, 101호 등"
                  value={detailedAddress}
                  onChange={(e) => setDetailedAddress(e.target.value)}
                  className="h-12 bg-input-background border-border/60"
                />
              </div>
            </>
          )}

          {/* Online Link */}
          {locationType === 'online' && (
            <div className="space-y-2 relative z-10">
              <Label htmlFor="onlineLink" className="text-sm flex items-center gap-1.5">
                <span>온라인 링크</span>
                <span className="text-accent-rose-dark">*</span>
              </Label>
              <div className="relative">
                <Wifi className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Input
                  id="onlineLink"
                  placeholder="예: https://zoom.us/j/123456789"
                  value={onlineLink}
                  onChange={(e) => setOnlineLink(e.target.value)}
                  className="pl-10 h-12 bg-input-background border-border/60"
                  required={locationType === 'online'}
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-start gap-1.5">
                <span className="text-base">💡</span>
                <span className="pt-0.5">Zoom, Google Meet, Discord 등의 링크를 입력하세요</span>
              </p>
            </div>
          )}
        </div>

        {/* Capacity */}
        <div className="relative bg-gradient-to-br from-card via-card to-primary/5 rounded-2xl p-5 border border-border/50 shadow-sm space-y-4 overflow-hidden">
          <div className="absolute top-0 right-0 w-28 h-28 bg-primary/10 rounded-full blur-3xl -z-0"></div>
          
          <div className="flex items-center gap-2 mb-1 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
              <span className="text-xl">👥</span>
            </div>
            <h3 className="text-base">참가 인원</h3>
          </div>

          {/* Max Attendees */}
          <div className="space-y-2 relative z-10">
            <Label htmlFor="maxAttendees" className="text-sm flex items-center gap-1.5">
              <span>최대 참가자 수</span>
              <span className="text-accent-rose-dark">*</span>
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input
                id="maxAttendees"
                type="number"
                placeholder="12"
                value={maxAttendees}
                onChange={(e) => setMaxAttendees(e.target.value)}
                className="pl-10 h-12 bg-input-background border-border/60"
                min="1"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="text-base">👫</span>
              <span className="pt-0.5">적정 인원을 설정하면 더 친밀한 모임이 가능해요</span>
            </p>
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
                        {uploadStatus === 'saving' && '이벤트 정보 저장 중...'}
                        {uploadStatus === 'done' && '완료!'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {uploadStatus === 'uploading' && `${uploadProgress}% 완료`}
                        {uploadStatus === 'saving' && '잠시만 기다려주세요'}
                        {uploadStatus === 'done' && '이벤트가 생성되었습니다'}
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
                  <span>이벤트 만들기</span>
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
