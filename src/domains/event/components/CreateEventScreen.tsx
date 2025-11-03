"use client";

import { groups } from '@/data/groups';
import { BackButton } from '@/shared/components/BackButton';
import { Button } from '@/shared/components/ui/button';
import { Checkbox } from '@/shared/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Textarea } from '@/shared/components/ui/textarea';
import { Calendar, Clock, Search, Users, Wifi } from 'lucide-react';
import { useState } from 'react';

interface CreateEventScreenProps {
  onBack: () => void;
  onCreate: (eventData: any) => void;
}

export function CreateEventScreen({ onBack, onCreate }: CreateEventScreenProps) {
  const [eventType, setEventType] = useState<'personal' | 'group'>('personal');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [locationType, setLocationType] = useState<'online' | 'offline'>('offline');
  const [location, setLocation] = useState('');
  const [detailedAddress, setDetailedAddress] = useState('');
  const [onlineLink, setOnlineLink] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [category, setCategory] = useState('카페 모임');
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [addressSearchQuery, setAddressSearchQuery] = useState('');

  const categories = [
    { name: '카페 모임', emoji: '☕' },
    { name: '맛집 탐방', emoji: '🍽️' },
    { name: '야외 활동', emoji: '🌳' },
    { name: '문화/예술', emoji: '🎨' },
    { name: '운동', emoji: '💪' },
    { name: '언어교환', emoji: '💬' },
  ];

  // Mock address search results
  const mockAddresses = [
    { roadAddress: '서울 강남구 테헤란로 123', jibunAddress: '서울 강남구 역삼동 123-45' },
    { roadAddress: '서울 강남구 강남대로 456', jibunAddress: '서울 강남구 역삼동 456-78' },
    { roadAddress: '서울 서초구 서초대로 789', jibunAddress: '서울 서초구 서초동 789-12' },
    { roadAddress: '서울 송파구 올림픽로 321', jibunAddress: '서울 송파구 잠실동 321-54' },
  ].filter(addr => 
    addressSearchQuery === '' || 
    addr.roadAddress.includes(addressSearchQuery) ||
    addr.jibunAddress.includes(addressSearchQuery)
  );

  const handleAddressSelect = (roadAddress: string) => {
    setLocation(roadAddress);
    setIsAddressDialogOpen(false);
    setAddressSearchQuery('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate({
      eventType,
      groupId: eventType === 'group' ? selectedGroupId : null,
      title,
      description,
      date,
      time,
      isRecurring,
      locationType,
      location: locationType === 'offline' ? location : 'Online',
      detailedAddress: locationType === 'offline' ? detailedAddress : '',
      onlineLink: locationType === 'online' ? onlineLink : '',
      maxAttendees: parseInt(maxAttendees),
      category,
    });
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
                <SelectValue placeholder="이벤트를 만들 그룹을 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    <div className="flex items-center gap-2">
                      <span>{group.name}</span>
                      <span className="text-xs text-muted-foreground">({group.members}명)</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground flex items-start gap-1.5 relative z-10">
              <span className="text-lg">💡</span>
              <span className="pt-0.5">선택한 그룹의 멤버들에게 이벤트가 표시됩니다</span>
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
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`p-3.5 rounded-xl border-2 transition-all text-sm flex items-center gap-2 ${
                    category === cat.name
                      ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5 text-primary shadow-md scale-[1.02]'
                      : 'border-border/60 hover:border-primary/40 hover:bg-gradient-to-br hover:from-muted/30 hover:to-accent-rose/5 hover:scale-[1.01]'
                  }`}
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Event Image */}
          <div className="relative z-10">
            <Label className="text-sm mb-2 block flex items-center gap-1.5">
              <span>이벤트 이미지</span>
              <span className="text-base">📸</span>
            </Label>
            <div className="relative border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/5 hover:to-accent-rose/5 transition-all cursor-pointer group">
              <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary/10 to-accent-rose/10 group-hover:from-primary/20 group-hover:to-accent-rose/20 flex items-center justify-center transition-all">
                <span className="text-3xl group-hover:scale-110 transition-transform">🖼️</span>
              </div>
              <p className="text-sm mb-1">이미지 업로드</p>
              <p className="text-xs text-muted-foreground">권장: 1200x630px</p>
            </div>
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

          {/* Recurring Event Option */}
          <div className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all relative z-10 ${
            isRecurring 
              ? 'bg-gradient-to-br from-primary/10 to-accent-sage/10 border-primary/30 shadow-sm' 
              : 'bg-gradient-to-br from-muted/20 to-transparent border-border/40'
          }`}>
            <Checkbox
              id="recurring"
              checked={isRecurring}
              onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              className="mt-0.5"
            />
            <div className="flex-1">
              <label
                htmlFor="recurring"
                className="text-sm cursor-pointer flex items-center gap-2"
              >
                <span className="text-lg">🔄</span>
                <span>매주 반복 이벤트</span>
              </label>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-start gap-1.5">
                <span className="text-base">✨</span>
                <span className="pt-0.5">매주 같은 요일, 같은 시간에 이벤트가 자동으로 생성됩니다</span>
              </p>
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
                    onClick={() => setIsAddressDialogOpen(true)}
                    required={locationType === 'offline'}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="h-12 px-4 border-border/60 flex items-center gap-2"
                    onClick={() => setIsAddressDialogOpen(true)}
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

              <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <span className="text-xl">🔍</span>
                      <span>주소 검색</span>
                    </DialogTitle>
                    <DialogDescription>
                      도로명, 건물명 또는 지번으로 주소를 검색하세요
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="예: 테헤란로, 강남역, 역삼동"
                        value={addressSearchQuery}
                        onChange={(e) => setAddressSearchQuery(e.target.value)}
                        className="pl-10 h-11 bg-input-background border-border/60"
                      />
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-2">
                      {mockAddresses.length > 0 ? (
                        mockAddresses.map((addr, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => handleAddressSelect(addr.roadAddress)}
                            className="w-full text-left p-3 rounded-lg border border-border/60 hover:border-primary/50 hover:bg-primary/5 transition-all"
                          >
                            <div className="text-sm mb-1">{addr.roadAddress}</div>
                            <div className="text-xs text-muted-foreground">{addr.jibunAddress}</div>
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

          {/* Action Buttons */}
          <div className="pt-2 space-y-3">
            <Button type="submit" className="w-full h-12 shadow-md bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary flex items-center justify-center gap-2">
              <span>이벤트 만들기</span>
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
