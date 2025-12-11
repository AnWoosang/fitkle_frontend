"use client";

import { EventCategory } from '@/domains/event/types/event';
import { EventCard } from '@/domains/event/components';
import { GroupCard } from '@/domains/group/components';
import { Footer } from '@/shared/components';
import { LocationFilter } from '@/shared/components/LocationFilter';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { ArrowLeft, Calendar, MapPin, Search, SlidersHorizontal, Users as UsersIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { throttle } from '@/shared/utils';
import { useInfiniteEvents, useInfiniteGroups, useInfiniteScrollTrigger } from '@/shared/hooks/useInfiniteScroll';
import type { EventFilters, EventType } from '@/domains/event/types/event';
import type { GroupFilters } from '@/domains/group/types/group';
import { useGroupCategories, useEventCategories } from '@/shared/hooks/useCategories';

interface ExploreScreenProps {
  onEventClick: (eventId: string) => void;
  onGroupClick?: (groupId: string) => void;
  initialSearchQuery?: string;
  initialLocation?: string;
  onBack?: () => void;
}

export function ExploreScreen({ onEventClick, onGroupClick, initialSearchQuery = '', initialLocation = 'All Regions', onBack }: ExploreScreenProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState('groups');
  const [isMounted, setIsMounted] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // 카테고리 데이터 가져오기
  const { data: groupCategories } = useGroupCategories();
  const { data: eventCategories } = useEventCategories();

  // Hydration 에러 방지
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter states
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedDate, setSelectedDate] = useState('all');
  const [tempLocation, setTempLocation] = useState(initialLocation);
  const [tempDate, setTempDate] = useState('all');

  // URL 파라미터가 변경될 때 검색어와 지역 업데이트
  useEffect(() => {
    if (initialSearchQuery !== undefined) {
      setSearchQuery(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  useEffect(() => {
    if (initialLocation !== undefined) {
      setSelectedLocation(initialLocation);
      setTempLocation(initialLocation);
    }
  }, [initialLocation]);

  // 스크롤 위치 확인 (useCallback으로 메모이제이션)
  const checkScrollPosition = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  // throttle된 스크롤 체크 함수 (useMemo로 메모이제이션)
  const throttledCheckScroll = useMemo(
    () => throttle(checkScrollPosition, 16), // 16ms = 60fps
    [checkScrollPosition]
  );

  useEffect(() => {
    checkScrollPosition();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', throttledCheckScroll);
      return () => container.removeEventListener('scroll', throttledCheckScroll);
    }
  }, [checkScrollPosition, throttledCheckScroll]);

  // 스크롤 함수 (useCallback으로 메모이제이션)
  const scroll = useCallback((direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  }, []);

  // Location 정규화 함수
  const normalizeLocation = useCallback((loc: string) => {
    if (loc === 'All Regions' || loc === '모든 지역' || loc === '전체 지역') {
      return undefined;
    }
    return loc;
  }, []);

  // 동적 카테고리 목록 생성 (탭에 따라 다른 카테고리 사용)
  const categories = useMemo(() => {
    const baseCategories = selectedTab === 'groups'
      ? groupCategories
      : eventCategories;

    return [
      { label: 'All', key: 'all', emoji: undefined },
      ...(baseCategories || []).map(cat => ({
        label: cat.name,
        key: cat.code,
        emoji: cat.emoji
      }))
    ];
  }, [selectedTab, groupCategories, eventCategories]);

  // 카테고리가 변경될 때 스크롤 위치 재계산
  useEffect(() => {
    // 약간의 지연을 주어 DOM이 업데이트된 후 체크
    const timer = setTimeout(() => {
      checkScrollPosition();
    }, 100);
    return () => clearTimeout(timer);
  }, [categories, checkScrollPosition]);

  // Group filters (useMemo로 메모이제이션)
  const groupFilters: GroupFilters = useMemo(() => {
    const filters = {
      searchQuery: searchQuery || undefined,
      category: selectedCategory !== 'all' ? selectedCategory : undefined,
      location: normalizeLocation(selectedLocation),
      date: selectedDate !== 'all' ? selectedDate : undefined,
    };
    console.log('[ExploreScreen] Group Filters:', filters);
    return filters;
  }, [searchQuery, selectedCategory, selectedLocation, selectedDate, normalizeLocation]);

  // Event filters (useMemo로 메모이제이션)
  const eventFilters: EventFilters = useMemo(() => {
    const filters: EventFilters = {
      searchQuery: searchQuery || undefined,
      category: selectedCategory !== 'all' ? (selectedCategory as EventCategory) : undefined,
      location: normalizeLocation(selectedLocation),
      type: selectedTab === 'group-events' ? ('group' as EventType) : selectedTab === 'personal-events' ? ('personal' as EventType) : undefined,
      date: selectedDate !== 'all' ? (selectedDate as 'today' | 'thisWeek' | 'thisMonth') : undefined,
    };
    console.log('[ExploreScreen] Event Filters:', filters);
    return filters;
  }, [searchQuery, selectedCategory, selectedLocation, selectedTab, selectedDate, normalizeLocation]);

  // Fetch data with infinite scroll
  const {
    data: groupsData,
    fetchNextPage: fetchNextGroupsPage,
    hasNextPage: hasNextGroupsPage,
    isFetchingNextPage: isFetchingNextGroupsPage,
    isLoading: isLoadingGroups,
  } = useInfiniteGroups(groupFilters);

  const {
    data: eventsData,
    fetchNextPage: fetchNextEventsPage,
    hasNextPage: hasNextEventsPage,
    isFetchingNextPage: isFetchingNextEventsPage,
    isLoading: isLoadingEvents,
  } = useInfiniteEvents(eventFilters);

  // Flatten paginated data
  const filteredGroups = useMemo(() => {
    const allGroups = groupsData?.pages.flatMap((page) => page.data) ?? [];

    // 중복 제거: ID 기준으로 unique한 그룹만 유지 (안전장치)
    const uniqueGroups = Array.from(
      new Map(allGroups.map(group => [group.id, group])).values()
    );

    return uniqueGroups;
  }, [groupsData]);

  const filteredEvents = useMemo(() => {
    const allEvents = eventsData?.pages.flatMap((page) => page.data) ?? [];

    // 중복 제거: ID 기준으로 unique한 이벤트만 유지 (안전장치)
    const uniqueEvents = Array.from(
      new Map(allEvents.map(event => [event.id, event])).values()
    );

    return uniqueEvents;
  }, [eventsData]);

  const isLoading = selectedTab === 'groups' ? isLoadingGroups : isLoadingEvents;
  const isFetchingNextPage = selectedTab === 'groups' ? isFetchingNextGroupsPage : isFetchingNextEventsPage;
  const hasNextPage = selectedTab === 'groups' ? hasNextGroupsPage : hasNextEventsPage;
  const fetchNextPage = selectedTab === 'groups' ? fetchNextGroupsPage : fetchNextEventsPage;

  // Infinite scroll trigger
  const { ref: infiniteScrollRef } = useInfiniteScrollTrigger({
    onIntersect: fetchNextPage,
    enabled: hasNextPage && !isFetchingNextPage,
  });

  // applyFilters (useCallback으로 메모이제이션)
  const applyFilters = useCallback(() => {
    setSelectedLocation(tempLocation);
    setSelectedDate(tempDate);
  }, [tempLocation, tempDate]);

  // resetFilters (useCallback으로 메모이제이션)
  const resetFilters = useCallback(() => {
    setTempLocation('All Regions');
    setTempDate('all');
    setSelectedLocation('All Regions');
    setSelectedDate('all');
  }, []);

  // activeFilterCount (useMemo로 메모이제이션)
  // 팝오버 내부의 필터(Location, Date)만 카운트 (카테고리는 별도 UI이므로 제외)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (normalizeLocation(selectedLocation)) count++;
    if (selectedDate !== 'all') count++;
    return count;
  }, [selectedLocation, selectedDate, normalizeLocation]);

  // 카테고리 선택 핸들러 (useCallback으로 메모이제이션)
  const handleCategoryClick = useCallback((categoryKey: string) => {
    setSelectedCategory(categoryKey);
  }, []);

  // 스크롤 left 핸들러 (useCallback으로 메모이제이션)
  const handleScrollLeft = useCallback(() => {
    scroll('left');
  }, [scroll]);

  // 스크롤 right 핸들러 (useCallback으로 메모이제이션)
  const handleScrollRight = useCallback(() => {
    scroll('right');
  }, [scroll]);

  // 그룹 카드 클릭 핸들러 (useCallback으로 메모이제이션)
  const handleGroupClick = useCallback((groupId: string) => {
    onGroupClick?.(groupId);
  }, [onGroupClick]);

  // 이벤트 카드 클릭 핸들러 (useCallback으로 메모이제이션)
  const handleEventClick = useCallback((eventId: string) => {
    onEventClick(eventId);
  }, [onEventClick]);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Tabs and Filter Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-border/50 shadow-sm">
        <div className="px-8 lg:px-24 xl:px-32 2xl:px-40 max-w-[1600px] mx-auto">
          {/* Tabs */}
          <div className="flex items-center gap-3 pt-4 pb-2 border-b border-border/30">
            {/* Back Arrow */}
            {onBack && (
              <button
                onClick={onBack}
                className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            )}

            <button
              onClick={() => setSelectedTab('groups')}
              className={`px-5 py-2 rounded-t-lg transition-all text-sm font-medium border-b-2 ${
                selectedTab === 'groups'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              }`}
            >
              Groups
            </button>
            <button
              onClick={() => setSelectedTab('group-events')}
              className={`px-5 py-2 rounded-t-lg transition-all text-sm font-medium border-b-2 ${
                selectedTab === 'group-events'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              }`}
            >
              Group Events
            </button>
            <button
              onClick={() => setSelectedTab('personal-events')}
              className={`px-5 py-2 rounded-t-lg transition-all text-sm font-medium border-b-2 ${
                selectedTab === 'personal-events'
                  ? 'text-primary border-primary'
                  : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
              }`}
            >
              Personal Events
            </button>
          </div>

          {/* Categories and Filters */}
          <div className="py-3 flex items-center justify-between gap-4">
            {/* Categories with Navigation Arrows */}
            <div className="relative flex-1 min-w-0 flex items-center gap-2">
              {/* Left Arrow */}
              {showLeftArrow && (
                <button
                  onClick={handleScrollLeft}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-border/50 hover:bg-secondary/50 transition-colors flex items-center justify-center shadow-sm z-20"
                  aria-label="Scroll left"
                >
                  <ChevronLeft className="w-4 h-4 text-foreground" />
                </button>
              )}

              {/* Categories Container */}
              <div className="relative flex-1 min-w-0">
                {/* 카테고리 스크롤 영역 */}
                <div
                  ref={scrollContainerRef}
                  className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide scroll-smooth"
                >
                  {categories.map((category) => (
                    <button
                      key={category.key}
                      onClick={() => handleCategoryClick(category.key)}
                      className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm flex-shrink-0 ${
                        selectedCategory === category.key
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-secondary/50 text-foreground hover:bg-secondary border border-border/50'
                      }`}
                    >
                      {category.emoji && <span className="mr-1.5">{category.emoji}</span>}
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Arrow */}
              {showRightArrow && (
                <button
                  onClick={handleScrollRight}
                  className="flex-shrink-0 w-8 h-8 rounded-full bg-white border border-border/50 hover:bg-secondary/50 transition-colors flex items-center justify-center shadow-sm z-20"
                  aria-label="Scroll right"
                >
                  <ChevronRight className="w-4 h-4 text-foreground" />
                </button>
              )}
            </div>

            {/* Filter Button - Popover */}
            <Popover modal={true}>
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
                  <h3 className="font-semibold">Filters</h3>
                </div>

                <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                  {/* Location Filter */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      <label className="text-sm font-medium">Location</label>
                    </div>
                    <LocationFilter
                      value={tempLocation}
                      onChange={setTempLocation}
                    />
                  </div>

                  {/* Date Filter - For All Tabs */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      <label className="text-sm font-medium">Date</label>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {['all', 'today', 'thisWeek', 'thisMonth'].map((date) => (
                        <button
                          key={date}
                          onClick={() => setTempDate(date)}
                          className={`px-3 py-2 rounded-lg text-xs transition-all ${
                            tempDate === date
                              ? 'bg-primary text-white'
                              : 'bg-secondary/50 text-foreground hover:bg-secondary'
                          }`}
                        >
                          {date === 'all' ? 'All' :
                           date === 'today' ? 'Today' :
                           date === 'thisWeek' ? 'This Week' :
                           'This Month'}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="border-t border-border p-3 bg-muted/30">
                  <div className="flex gap-2">
                    <PopoverClose asChild>
                      <Button variant="outline" onClick={resetFilters} className="flex-1 h-9 text-xs">
                        Reset
                      </Button>
                    </PopoverClose>
                    <PopoverClose asChild>
                      <Button onClick={applyFilters} className="flex-1 h-9 text-xs">
                        Apply
                      </Button>
                    </PopoverClose>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="px-8 lg:px-24 xl:px-32 2xl:px-40 max-w-[1600px] mx-auto py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedTab === 'groups' ? `${filteredGroups.length} groups` : `${filteredEvents.length} events`}
          </p>
        </div>

        {selectedTab === 'groups' ? (
          isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : filteredGroups.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {filteredGroups.map((group) => (
                  <GroupCard
                    key={group.id}
                    id={group.id}
                    name={group.name}
                    description={group.description}
                    category={group.categoryCode || ''}
                    members={group.members}
                    image={group.image}
                    location={group.location}
                    hostName={group.hostName}
                    eventCount={group.eventCount}
                    rating={group.rating}
                    onClick={handleGroupClick}
                  />
                ))}
              </div>

              {/* Infinite scroll trigger */}
              {hasNextPage && (
                <div ref={infiniteScrollRef} className="py-8 flex justify-center">
                  {isFetchingNextPage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm text-muted-foreground">Loading more...</p>
                    </div>
                  ) : (
                    <div className="h-20" /> // Trigger area
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <UsersIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-2">No groups found</p>
            </div>
          )
        ) : (
          isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-muted-foreground">Loading...</p>
            </div>
          ) : filteredEvents.length > 0 ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    date={event.date}
                    time={event.time}
                    location={event.streetAddress}  
                    hostName={event.hostName}
                    attendees={event.attendees}
                    maxAttendees={event.maxAttendees}
                    image={event.image}
                    category={event.categoryCode || ''}
                    isHot={event.isHot}
                    isNew={event.isNew}
                    groupId={event.groupId}
                    onClick={handleEventClick}
                  />
                ))}
              </div>

              {/* Infinite scroll trigger */}
              {hasNextPage && (
                <div ref={infiniteScrollRef} className="py-8 flex justify-center">
                  {isFetchingNextPage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <p className="text-sm text-muted-foreground">Loading more...</p>
                    </div>
                  ) : (
                    <div className="h-20" /> // Trigger area
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-2">No events found</p>
            </div>
          )
        )}
      </div>

      <Footer />
    </div>
  );
}
