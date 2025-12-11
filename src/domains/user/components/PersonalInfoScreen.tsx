"use client";

import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProfile, useUpdateProfile } from '../hooks';
import { Heart, Plus, X, Search, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { ProfileSettingsSidebar } from './ProfileSettingsSidebar';

export function PersonalInfoScreen() {
  const router = useRouter();

  // 프로필 데이터 가져오기
  const { data: profile, isLoading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  // Interests state
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [interestSearchQuery, setInterestSearchQuery] = useState('');
  const [notificationRadius, setNotificationRadius] = useState('50 mi');

  // 프로필 데이터가 로드되면 state 초기화
  useEffect(() => {
    if (profile) {
      setSelectedInterests(profile.interestsList?.map(i => i.code) || []);
    }
  }, [profile]);

  // All interests (will be fetched from API in real implementation)
  const allInterestsWithEmoji = [
    { label: 'Social', emoji: '🎉' },
    { label: 'Professional Networking', emoji: '💼' },
    { label: 'Book Club', emoji: '📚' },
    { label: 'Adventure', emoji: '🏔️' },
    { label: 'Writing and Publishing', emoji: '✍️' },
    { label: 'Painting', emoji: '🎨' },
    { label: 'Pickup Soccer', emoji: '⚽' },
    { label: 'Social Justice', emoji: '✊' },
    { label: 'Camping', emoji: '⛺' },
    { label: 'Group Singing', emoji: '🎤' },
    { label: 'Family Friendly', emoji: '👨‍👩‍👧' },
    { label: 'Outdoor Fitness', emoji: '🏃' },
    { label: 'Eco-Conscious', emoji: '🌱' },
    { label: 'Stress Relief', emoji: '😌' },
    { label: 'Game Night', emoji: '🎲' },
    { label: 'Yoga', emoji: '🧘‍♂️' },
    { label: 'International Travel', emoji: '✈️' },
    { label: 'Soccer', emoji: '⚽' },
    { label: 'Outdoors', emoji: '🌲' },
    { label: 'New In Town', emoji: '🗺️' },
    { label: 'Make New Friends', emoji: '👥' },
    { label: 'Fun Times', emoji: '🎊' },
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(prev => prev.filter(i => i !== interest));
  };

  const getInterestEmoji = (label: string) => {
    return allInterestsWithEmoji.find(i => i.label === label)?.emoji || '⭐';
  };

  const filteredInterests = allInterestsWithEmoji.filter(
    interest =>
      !selectedInterests.includes(interest.label) &&
      interest.label.toLowerCase().includes(interestSearchQuery.toLowerCase())
  );

  const handleSave = () => {
    updateProfileMutation.mutate(
      {
        interests: selectedInterests,
      },
      {
        onSuccess: () => {
          toast.success('관심사가 성공적으로 업데이트되었습니다.');
          router.push('/profile');
        },
        onError: (error) => {
          console.error('관심사 업데이트 실패:', error);
          toast.error('관심사 업데이트에 실패했습니다. 다시 시도해주세요.');
        },
      }
    );
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">프로필을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 프로필이 없을 때
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">프로필을 불러올 수 없습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6">
          {/* Sidebar */}
          <ProfileSettingsSidebar />

          {/* Content Area */}
          <div className="flex-1">
            <div className="space-y-6 max-w-3xl">
              <div className="bg-white rounded-2xl p-6 border border-border shadow-sm space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h1 className="mb-1">Personal Info</h1>
                      <p className="text-sm text-muted-foreground">
                        Get notified about groups that match your interests
                      </p>
                    </div>
                  </div>

                  {/* Notification Radius */}
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-border">
                    <Bell className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="flex-1 text-sm">Notify me about new groups within:</span>
                    <Select value={notificationRadius} onValueChange={setNotificationRadius}>
                      <SelectTrigger className="w-28 h-9 border-2 border-border bg-white rounded-lg text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10 mi">10 mi</SelectItem>
                        <SelectItem value="25 mi">25 mi</SelectItem>
                        <SelectItem value="50 mi">50 mi</SelectItem>
                        <SelectItem value="100 mi">100 mi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Divider */}
                {selectedInterests.length > 0 && <div className="border-t border-border"></div>}

                {/* Selected Interests */}
                {selectedInterests.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Heart className="w-4 h-4 text-white fill-white" />
                        </div>
                        <h3>Your Interests</h3>
                        <span className="px-2.5 py-0.5 bg-primary text-white rounded-full text-sm">
                          {selectedInterests.length}
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedInterests([])}
                        className="text-sm text-red-600 hover:text-red-700 transition-colors flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Clear all
                      </button>
                    </div>
                    <div className="p-3 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20">
                      <div className="flex flex-wrap gap-1.5">
                        {selectedInterests.map((interest) => (
                          <button
                            key={interest}
                            onClick={() => removeInterest(interest)}
                            className="group flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-white border border-primary/30 text-foreground hover:border-red-500 hover:bg-red-50 hover:text-red-700 transition-all shadow-sm"
                          >
                            <span>{getInterestEmoji(interest)}</span>
                            <span className="font-medium">{interest}</span>
                            <X className="w-3.5 h-3.5 group-hover:text-red-600" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Search & Browse */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Search className="w-5 h-5 text-primary" />
                    <h3>Discover More</h3>
                  </div>

                  {/* Search Input */}
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search interests..."
                      value={interestSearchQuery}
                      onChange={(e) => setInterestSearchQuery(e.target.value)}
                      className="h-11 border-2 border-border bg-input-background rounded-lg pr-10"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>

                  {/* Search Results Counter */}
                  {interestSearchQuery && (
                    <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-900">
                        Found <span className="font-semibold">{filteredInterests.length}</span> interests matching "{interestSearchQuery}"
                      </p>
                      <button
                        onClick={() => setInterestSearchQuery('')}
                        className="text-sm text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Available Interests */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Plus className="w-5 h-5 text-primary" />
                      <h3>Add More Interests</h3>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {filteredInterests.length} available
                    </span>
                  </div>

                  {filteredInterests.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {filteredInterests.map((interest) => (
                        <button
                          key={interest.label}
                          onClick={() => toggleInterest(interest.label)}
                          className="group flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-border bg-white text-foreground hover:border-primary hover:bg-primary/10 hover:text-primary transition-all"
                        >
                          <span>{interest.emoji}</span>
                          <span className="font-medium">{interest.label}</span>
                          <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 opacity-30" />
                      </div>
                      <p className="font-medium mb-1">No interests found</p>
                      <p className="text-sm">Try a different search term</p>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-border"></div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    className="px-8 py-3 h-12 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" />
                    Save Interests
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
