"use client";

import { useState, useEffect } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { BackButton } from '@/shared/components/BackButton';
import { useEvent } from '../hooks/useEvent';

interface EditEventScreenProps {
  eventId: string;
  onBack: () => void;
  onUpdate: (eventData: any) => void;
}

export function EditEventScreen({ eventId, onBack, onUpdate }: EditEventScreenProps) {
  const { data: event } = useEvent(eventId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [category, setCategory] = useState('카페 모임');

  const categories = [
    '카페 모임',
    '맛집 탐방',
    '야외 활동',
    '문화/예술',
    '운동',
    '언어교환',
  ];

  // Load existing event data
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || '주말 아침을 여유롭게 시작해보세요! 강남역 근처의 아늑한 카페에서 브런치를 즐기며 다양한 국적의 친구들과 이야기를 나눠요.');
      setDate(event.date);
      setTime(event.time);
      setLocation(event.streetAddress || '');
      setMaxAttendees(event.maxAttendees.toString());
      setCategory(event.categoryCode || '');
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      id: eventId,
      title,
      description,
      date,
      time,
      location,
      maxAttendees: parseInt(maxAttendees),
      category,
    });
  };

  // Desktop Layout
  const DesktopView = () => (
    <div className="min-h-screen bg-background pb-12">
      {/* Back Button */}
      <div className="px-8 xl:px-12 pt-6 pb-4">
        <div className="max-w-4xl mx-auto">
          <BackButton onClick={onBack} />
        </div>
      </div>

      {/* Form Container */}
      <div className="px-8 xl:px-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border border-border rounded-2xl p-8">
            <h1 className="text-3xl mb-8">이벤트 수정</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Image */}
        <div>
          <Label>이벤트 이미지</Label>
          <div className="mt-2 border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">이미지 업로드 (권장: 1200x630px)</p>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">이벤트 제목 *</Label>
          <Input
            id="title"
            placeholder="예: 강남 브런치 & 수다 모임"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label>카테고리 *</Label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`p-3 rounded-lg border transition-all text-sm ${
                  category === cat
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">이벤트 설명 *</Label>
          <Textarea
            id="description"
            placeholder="이벤트에 대한 상세 설명을 작성해주세요"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            required
          />
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="date">날짜 *</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">시간 *</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">장소 *</Label>
          <Input
            id="location"
            placeholder="예: 강남역 스타벅스"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        {/* Max Attendees */}
        <div className="space-y-2">
          <Label htmlFor="maxAttendees">최대 참가자 수 *</Label>
          <Input
            id="maxAttendees"
            type="number"
            placeholder="예: 10"
            value={maxAttendees}
            onChange={(e) => setMaxAttendees(e.target.value)}
            min="2"
            required
          />
        </div>

              {/* Event Image */}
              <div>
                <Label>이벤트 이미지</Label>
                <div className="mt-3 border-2 border-dashed border-border rounded-xl p-12 text-center hover:border-primary/50 transition-colors cursor-pointer">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">이미지 업로드 (권장: 1200x630px)</p>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">이벤트 제목 *</Label>
                <Input
                  id="title"
                  placeholder="예: 강남 브런치 & 수다 모임"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="text-lg"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>카테고리 *</Label>
                <div className="grid grid-cols-3 gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`p-4 rounded-lg border transition-all ${
                        category === cat
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">이벤트 설명 *</Label>
                <Textarea
                  id="description"
                  placeholder="이벤트에 대한 상세 설명을 작성해주세요"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">날짜 *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">시간 *</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">장소 *</Label>
                <Input
                  id="location"
                  placeholder="예: 강남역 스타벅스"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              {/* Max Attendees */}
              <div className="space-y-2">
                <Label htmlFor="maxAttendees">최대 참가자 수 *</Label>
                <Input
                  id="maxAttendees"
                  type="number"
                  placeholder="예: 10"
                  value={maxAttendees}
                  onChange={(e) => setMaxAttendees(e.target.value)}
                  min="2"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-6">
                <Button type="button" variant="outline" onClick={onBack} className="flex-1 py-6">
                  취소
                </Button>
                <Button type="submit" className="flex-1 py-6">
                  수정 완료
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );

  return <DesktopView />;
}
