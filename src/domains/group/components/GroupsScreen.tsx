"use client";

import { Users, Calendar, SlidersHorizontal, MapPin } from 'lucide-react';
import { useState } from 'react';
import { useGroups } from '@/domains/group/hooks/useGroups';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Button } from '@/shared/components/ui/button';
import { LocationFilter } from '@/shared/components/LocationFilter';

interface GroupsScreenProps {
  onGroupClick: (groupId: string) => void;
  initialSearchQuery?: string;
}

export function GroupsScreen({ onGroupClick, initialSearchQuery = '' }: GroupsScreenProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState('모든 지역');
  const [memberSize, setMemberSize] = useState('all');
  const [activityLevel, setActivityLevel] = useState('all');

  // Temp filter states for modal
  const [tempLocation, setTempLocation] = useState('모든 지역');
  const [tempMemberSize, setTempMemberSize] = useState('all');
  const [tempActivityLevel, setTempActivityLevel] = useState('all');

  // Fetch groups from API
  const { data: groups = [], isLoading } = useGroups();

  const categories = [
    { label: '전체', key: 'all' },
    { label: '카페 모임', key: '카페 모임' },
    { label: '맛집 탐방', key: '맛집 탐방' },
    { label: '야외 활동', key: '야외 활동' },
    { label: '문화/예술', key: '문화/예술' },
    { label: '운동', key: '운동' },
    { label: '언어교환', key: '언어교환' },
  ];

  const applyFilters = () => {
    setSelectedLocation(tempLocation);
    setMemberSize(tempMemberSize);
    setActivityLevel(tempActivityLevel);
    setIsFilterOpen(false);
  };

  const resetFilters = () => {
    setTempLocation('모든 지역');
    setSelectedLocation('모든 지역');
    setSelectedCategory('all');
    setSearchQuery('');
    setMemberSize('all');
    setActivityLevel('all');
    setTempMemberSize('all');
    setTempActivityLevel('all');
    setIsFilterOpen(false);
  };

  const activeFilterCount =
    (selectedLocation !== '모든 지역' && selectedLocation !== '전체 지역' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (memberSize !== 'all' ? 1 : 0) +
    (activityLevel !== 'all' ? 1 : 0);

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.categoryName === selectedCategory;

    const locationMatch = selectedLocation === '모든 지역' ||
      selectedLocation === '전체 지역' ||
      group.location?.includes(selectedLocation.split(' ').pop() || '') ||
      group.location === selectedLocation;

    let memberSizeMatch = true;
    if (memberSize === 'small') memberSizeMatch = group.members < 50;
    else if (memberSize === 'medium') memberSizeMatch = group.members >= 50 && group.members < 150;
    else if (memberSize === 'large') memberSizeMatch = group.members >= 150;

    let activityMatch = true;
    if (activityLevel === 'active') activityMatch = group.eventCount >= 10;
    else if (activityLevel === 'moderate') activityMatch = group.eventCount >= 5 && group.eventCount < 10;
    else if (activityLevel === 'new') activityMatch = group.eventCount < 5;

    return matchesSearch && matchesCategory && locationMatch && memberSizeMatch && activityMatch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">그룹을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Layout - Similar to ExploreScreen */}
      <div>
        {/* Filter Bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-border/50 shadow-sm">
          <div className="max-w-[1600px] mx-auto px-8 lg:px-24 xl:px-32 2xl:px-40 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide flex-1">
                {categories.map((category) => (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm ${
                      selectedCategory === category.key
                        ? 'bg-primary text-white shadow-sm'
                        : 'bg-secondary/50 text-foreground hover:bg-secondary border border-border/50'
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>

              {/* Filter Button - Desktop Popover */}
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <button className="relative flex items-center gap-2 px-4 py-2 bg-white border border-border/50 rounded-full hover:bg-secondary/50 transition-colors">
                    <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Filters</span>
                    {activeFilterCount > 0 && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-[10px] text-white font-semibold">
                          {activeFilterCount}
                        </span>
                      </div>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b border-border">
                    <h3 className="font-semibold">필터</h3>
                    <p className="text-xs text-muted-foreground mt-1">원하는 그룹을 찾아보세요</p>
                  </div>

                  <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                    {/* Location Filter */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        <label className="text-sm font-medium">위치</label>
                      </div>
                      <LocationFilter
                        value={tempLocation}
                        onChange={setTempLocation}
                      />
                    </div>

                    {/* Member Size Filter */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Users className="w-3.5 h-3.5 text-primary" />
                        <label className="text-sm font-medium">멤버 수</label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'all', label: '전체' },
                          { value: 'small', label: '소규모 (<50)' },
                          { value: 'medium', label: '중규모 (50-150)' },
                          { value: 'large', label: '대규모 (150+)' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setTempMemberSize(option.value)}
                            className={`px-3 py-2 rounded-lg text-xs transition-all ${
                              tempMemberSize === option.value
                                ? 'bg-primary text-white'
                                : 'bg-secondary/50 text-foreground hover:bg-secondary'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Activity Level Filter */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        <label className="text-sm font-medium">활동 수준</label>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'all', label: '전체' },
                          { value: 'active', label: '매우 활발 (10+)' },
                          { value: 'moderate', label: '보통 (5-10)' },
                          { value: 'new', label: '신규 (<5)' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setTempActivityLevel(option.value)}
                            className={`px-3 py-2 rounded-lg text-xs transition-all ${
                              tempActivityLevel === option.value
                                ? 'bg-primary text-white'
                                : 'bg-secondary/50 text-foreground hover:bg-secondary'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-border p-3 bg-muted/30">
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={resetFilters} className="flex-1 h-9 text-xs">
                        초기화
                      </Button>
                      <Button onClick={applyFilters} className="flex-1 h-9 text-xs">
                        적용
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="max-w-[1600px] mx-auto px-8 lg:px-24 xl:px-32 2xl:px-40 py-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredGroups.length}개 그룹
            </p>
          </div>

          {filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {filteredGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => onGroupClick(group.id)}
                  className="w-full bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all text-left group"
                >
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-border/50">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-xs text-foreground font-medium">
                        {group.members.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="mb-2">
                      <span className="inline-block text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-lg">
                        {group.categoryName || '미분류'}
                      </span>
                    </div>
                    <h3 className="mb-2 truncate leading-snug">{group.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {group.description}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-0.5">
                        <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="whitespace-nowrap">{group.eventCount}개 이벤트</span>
                      </div>
                      <span className="text-muted-foreground/50 mx-0.5">•</span>
                      <div className="flex items-center gap-0.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="truncate">{group.location}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-2">그룹을 찾을 수 없습니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
