"use client";

import { useState } from 'react';
import { Users, MapPin, Image as ImageIcon, FileText, Globe, Lock, Tag, Sparkles, Search } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { BackButton } from '@/shared/components/BackButton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';

interface CreateGroupScreenProps {
  onBack: () => void;
  onCreate: (groupData: any) => void;
}

export function CreateGroupScreen({ onBack, onCreate }: CreateGroupScreenProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Social Activities');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');

  const categories = [
    { name: 'Social Activities', emoji: '🎉' },
    { name: 'Food & Dining', emoji: '🍜' },
    { name: 'Sports & Fitness', emoji: '⚽' },
    { name: 'Arts & Culture', emoji: '🎭' },
    { name: 'Language Exchange', emoji: '💬' },
    { name: 'Professional Networking', emoji: '💼' },
    { name: 'Outdoor Adventures', emoji: '🏔️' },
    { name: 'Tech & Innovation', emoji: '💻' },
  ];

  // Mock location data (city, district level)
  const mockLocations = [
    { display: '서울시 강남구', city: '서울', district: '강남구' },
    { display: '서울시 서초구', city: '서울', district: '서초구' },
    { display: '서울시 송파구', city: '서울', district: '송파구' },
    { display: '서울시 강동구', city: '서울', district: '강동구' },
    { display: '서울시 마포구', city: '서울', district: '마포구' },
    { display: '서울시 용산구', city: '서울', district: '용산구' },
    { display: '서울시 성동구', city: '서울', district: '성동구' },
    { display: '서울시 광진구', city: '서울', district: '광진구' },
    { display: '부산시 해운대구', city: '부산', district: '해운대구' },
    { display: '부산시 남구', city: '부산', district: '남구' },
    { display: '부산시 동래구', city: '부산', district: '동래구' },
    { display: '인천시 남동구', city: '인천', district: '남동구' },
    { display: '인천시 연수구', city: '인천', district: '연수구' },
    { display: '대구시 수성구', city: '대구', district: '수성구' },
    { display: '대구시 중구', city: '대구', district: '중구' },
    { display: '대전시 유성구', city: '대전', district: '유성구' },
    { display: '광주시 북구', city: '광주', district: '북구' },
    { display: '울산시 남구', city: '울산', district: '남구' },
  ].filter(loc => 
    locationSearchQuery === '' || 
    loc.display.includes(locationSearchQuery) ||
    loc.city.includes(locationSearchQuery) ||
    loc.district.includes(locationSearchQuery)
  );

  const handleLocationSelect = (locationDisplay: string) => {
    setLocation(locationDisplay);
    setIsLocationDialogOpen(false);
    setLocationSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      name,
      description,
      location,
      category,
      privacy,
    });
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
            <Label htmlFor="description" className="text-sm flex items-center gap-1.5">
              <span>설명</span>
              <span className="text-accent-rose-dark">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="그룹의 목적, 활동 내용, 어떤 사람들이 참여하면 좋을지 알려주세요... 💭"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              className="resize-none bg-input-background border-border/60"
              required
            />
            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="text-base">✨</span>
              <span className="pt-0.5">자세한 설명은 더 많은 멤버를 모을 수 있어요 (최소 50자)</span>
            </p>
          </div>

          {/* Group Image */}
          <div className="relative z-10">
            <Label className="text-sm mb-2 block flex items-center gap-1.5">
              <span>그룹 이미지</span>
              <span className="text-base">📸</span>
            </Label>
            <div className="relative border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent-rose/5 transition-all cursor-pointer group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/10 to-accent-rose/10 group-hover:from-primary/20 group-hover:to-accent-rose/20 flex items-center justify-center transition-all">
                <span className="text-3xl group-hover:scale-110 transition-transform">🖼️</span>
              </div>
              <p className="text-sm mb-1">그룹 사진 업로드</p>
              <p className="text-xs text-muted-foreground">권장: 1200x630px</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF (최대 5MB)</p>
            </div>
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
            <p className="text-xs text-muted-foreground flex items-start gap-1.5">
              <span className="text-base">📍</span>
              <span className="pt-0.5">그룹의 주요 활동 지역을 선택하세요</span>
            </p>
          </div>

          <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <span className="text-xl">🔍</span>
                  <span>위치 검색</span>
                </DialogTitle>
                <DialogDescription>
                  시, 구 단위로 지역을 검색하세요
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="예: 강남구, 서울, 부산"
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    className="pl-10 h-11 bg-input-background border-border/60"
                  />
                </div>
                <div className="max-h-[300px] overflow-y-auto space-y-2">
                  {mockLocations.length > 0 ? (
                    mockLocations.map((loc, index) => (
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
                    <div className="text-center py-8 text-muted-foreground">
                      <span className="text-3xl mb-2 block">🔍</span>
                      <p className="text-sm">검색어를 입력하세요</p>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
            {categories.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`p-3.5 rounded-xl border-2 transition-all text-sm flex items-center gap-2.5 ${
                  category === cat.name
                    ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-md scale-[1.01]'
                    : 'border-border/60 hover:border-primary/40 hover:bg-gradient-to-br hover:from-muted/30 hover:to-accent-rose/5 hover:scale-[1.005]'
                }`}
              >
                <span className="text-xl">{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="relative bg-gradient-to-br from-card via-card to-accent-sage/10 rounded-2xl p-5 border border-border/50 shadow-sm overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-sage/10 rounded-full blur-3xl -z-0"></div>
          
          <div className="flex items-center gap-2 mb-3 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center shadow-sm">
              <span className="text-xl">🔒</span>
            </div>
            <Label className="text-base">공개 설정</Label>
            <span className="text-accent-rose-dark">*</span>
          </div>
          
          <div className="grid grid-cols-1 gap-3 relative z-10">
            <button
              type="button"
              onClick={() => setPrivacy('public')}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                privacy === 'public'
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.01]'
                  : 'border-border/60 hover:border-primary/40 hover:bg-gradient-to-br hover:from-muted/30 hover:to-accent-sage/5'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  privacy === 'public' 
                    ? 'bg-gradient-to-br from-primary/20 to-primary/10' 
                    : 'bg-muted/50'
                }`}>
                  <span className="text-2xl">🌍</span>
                </div>
                <div className="flex-1">
                  <div className={`text-sm ${privacy === 'public' ? 'text-primary' : ''}`}>
                    공개 그룹
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    누구나 찾아서 가입할 수 있습니다
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPrivacy('private')}
              className={`p-5 rounded-xl border-2 transition-all text-left ${
                privacy === 'private'
                  ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 shadow-md scale-[1.01]'
                  : 'border-border/60 hover:border-primary/40 hover:bg-gradient-to-br hover:from-muted/30 hover:to-accent-sage/5'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  privacy === 'private' 
                    ? 'bg-gradient-to-br from-primary/20 to-primary/10' 
                    : 'bg-muted/50'
                }`}>
                  <span className="text-2xl">🔐</span>
                </div>
                <div className="flex-1">
                  <div className={`text-sm ${privacy === 'private' ? 'text-primary' : ''}`}>
                    비공개 그룹
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    승인된 회원만 가입할 수 있습니다
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

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <Button type="submit" className="w-full h-12 shadow-md bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary flex items-center justify-center gap-2">
              <span>그룹 만들기</span>
              <span className="text-lg">✨</span>
            </Button>
            <Button type="button" variant="outline" onClick={onBack} className="w-full h-12 border-border/60">
              취소
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
