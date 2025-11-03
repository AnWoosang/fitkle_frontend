"use client";

import { events } from '@/data/events';
import { groups } from '@/data/groups';
import { Footer } from '@/shared/components';
import { LocationFilter } from '@/shared/components/LocationFilter';
import { Button } from '@/shared/components/ui/button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/shared/components/ui/popover';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/shared/components/ui/sheet';
import { ArrowLeft, Calendar, Clock, MapPin, Search, SlidersHorizontal, Star, User, Users as UsersIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';

interface ExploreScreenProps {
  onEventClick: (eventId: string) => void;
  onGroupClick?: (groupId: string) => void;
  initialSearchQuery?: string;
  initialLocation?: string;
  onBack?: () => void;
}

export function ExploreScreen({ onEventClick, onGroupClick, initialSearchQuery = '', initialLocation = '모든 지역', onBack }: ExploreScreenProps) {
  const t = useTranslations('explore');
  const tCommon = useTranslations('common');
  const tEvent = useTranslations('event');
  const tGroup = useTranslations('group');

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTab, setSelectedTab] = useState('group-events');

  // Filter states for events
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedDate, setSelectedDate] = useState('all');
  
  // Filter states for groups
  const [memberSize, setMemberSize] = useState('all');
  const [activityLevel, setActivityLevel] = useState('all');

  // Temp filter states for modal
  const [tempLocation, setTempLocation] = useState(initialLocation);
  const [tempDate, setTempDate] = useState('all');
  const [tempMemberSize, setTempMemberSize] = useState('all');
  const [tempActivityLevel, setTempActivityLevel] = useState('all');

  const getGroupName = (groupId?: string) => {
    if (!groupId) return null;
    const group = groups.find(g => g.id === groupId);
    return group?.name || null;
  };

  const categories = [
    { label: t('categoryAll'), key: 'all' },
    { label: t('categoryCafe'), key: 'cafe' },
    { label: t('categoryFood'), key: 'food' },
    { label: t('categoryOutdoor'), key: 'outdoor' },
    { label: t('categoryCulture'), key: 'art' },
    { label: t('categorySports'), key: 'fitness' },
    { label: t('categoryLanguage'), key: 'language' },
  ];

  const applyFilters = () => {
    setSelectedLocation(tempLocation);
    setSelectedDate(tempDate);
    setMemberSize(tempMemberSize);
    setActivityLevel(tempActivityLevel);
  };

  const resetFilters = () => {
    setTempLocation('모든 지역');
    setSelectedLocation('모든 지역');
    setSelectedCategory('all');
    setSearchQuery('');
    setSelectedDate('all');
    setTempDate('all');
    setMemberSize('all');
    setActivityLevel('all');
    setTempMemberSize('all');
    setTempActivityLevel('all');
  };

  const activeFilterCount = selectedTab === 'groups'
    ? (selectedLocation !== '모든 지역' && selectedLocation !== '전체 지역' ? 1 : 0) +
      (selectedCategory !== 'all' ? 1 : 0) +
      (memberSize !== 'all' ? 1 : 0) +
      (activityLevel !== 'all' ? 1 : 0)
    : (selectedLocation !== '모든 지역' && selectedLocation !== '전체 지역' ? 1 : 0) +
      (selectedCategory !== 'all' ? 1 : 0) +
      (selectedDate !== 'all' ? 1 : 0);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    
    const locationMatch = selectedLocation === '모든 지역' || 
      selectedLocation === '전체 지역' ||
      event.location?.includes(selectedLocation.split(' ').pop() || '') ||
      event.location === selectedLocation;
    
    let dateMatch = true;
    if (selectedDate === 'today') {
      // Simple date matching logic
      dateMatch = event.date.includes('오늘') || event.date.includes('Today');
    } else if (selectedDate === 'thisWeek') {
      dateMatch = true; // Could add more specific logic
    }
    
    // Filter by event type based on selected tab
    const typeMatch = 
      selectedTab === 'group-events' ? event.type === 'group' :
      selectedTab === 'personal-events' ? event.type === 'personal' :
      true;
    
    return matchesSearch && matchesCategory && locationMatch && dateMatch && typeMatch;
  });

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    
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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mobile Layout */}
      <div className="lg:hidden flex-1">
          {/* Search Bar and Filter - Mobile */}
          <div className="px-4 pt-4 pb-3 bg-background sticky top-0 z-10 border-b border-border/30">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-card border border-border/50 focus:bg-background focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10 transition-all shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="relative flex items-center gap-2 px-4 py-3 bg-card border border-border/50 rounded-xl hover:bg-secondary/50 transition-colors shadow-sm">
                <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
                {activeFilterCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-primary-foreground font-semibold">
                      {activeFilterCount}
                    </span>
                  </div>
                )}
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <SheetHeader>
                <SheetTitle>{tCommon('filters')}</SheetTitle>
                <SheetDescription>{t('findEventsDescription')}</SheetDescription>
              </SheetHeader>
              
              <div className="mt-6 space-y-6 overflow-y-auto max-h-[calc(70vh-200px)] px-4">
                {/* Location Filter */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <h3>{tCommon('location')}</h3>
                  </div>
                  <LocationFilter
                    selectedLocation={tempLocation}
                    onLocationChange={setTempLocation}
                  />
                </div>

                {/* Date Filter - Only for Events */}
                {selectedTab !== 'groups' && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <h3>{tCommon('date')}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { value: 'all', label: t('allDates') },
                        { value: 'today', label: t('today') },
                        { value: 'thisWeek', label: t('thisWeek') },
                        { value: 'thisMonth', label: t('thisMonth') },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTempDate(option.value)}
                          className={`px-4 py-3.5 rounded-2xl text-sm transition-all font-medium ${
                            tempDate === option.value
                              ? 'bg-primary text-white shadow-sm shadow-primary/20'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Member Size Filter - Only for Groups */}
                {selectedTab === 'groups' && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <UsersIcon className="w-4 h-4 text-primary" />
                      <h3>{t('memberSize')}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { value: 'all', label: t('memberAll') },
                        { value: 'small', label: t('memberSmall') },
                        { value: 'medium', label: t('memberMedium') },
                        { value: 'large', label: t('memberLarge') },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTempMemberSize(option.value)}
                          className={`px-4 py-3.5 rounded-2xl text-sm transition-all font-medium ${
                            tempMemberSize === option.value
                              ? 'bg-primary text-white shadow-sm shadow-primary/20'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activity Level Filter - Only for Groups */}
                {selectedTab === 'groups' && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <h3>{t('activityLevel')}</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {[
                        { value: 'all', label: t('activityAll') },
                        { value: 'active', label: t('activityActive') },
                        { value: 'moderate', label: t('activityModerate') },
                        { value: 'new', label: t('activityNew') },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setTempActivityLevel(option.value)}
                          className={`px-4 py-3.5 rounded-2xl text-sm transition-all font-medium ${
                            tempActivityLevel === option.value
                              ? 'bg-primary text-white shadow-sm shadow-primary/20'
                              : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons - Fixed at bottom */}
              <div className="border-t border-border p-4 bg-background">
                {activeFilterCount > 0 && (
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-muted-foreground">
                      {tCommon('filters')}: {activeFilterCount}
                    </p>
                    <button
                      onClick={resetFilters}
                      className="text-sm text-primary hover:underline"
                    >
                      {tCommon('reset')}
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="flex-1"
                    >
                      {tCommon('reset')}
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      onClick={applyFilters}
                      className="flex-1"
                    >
                      {tCommon('showing')} ({selectedTab === 'groups' ? filteredGroups.length : filteredEvents.length})
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

          {/* Tabs - Mobile */}
          <div className="px-4 py-3 border-b border-border/30 bg-background sticky top-[72px] z-10">
            <div className="flex gap-2 mb-3">
              <button
                onClick={() => setSelectedTab('group-events')}
                className={`flex-1 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  selectedTab === 'group-events'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-card text-foreground hover:bg-secondary/80 border border-border/50'
                }`}
              >
                {t('groupEvents')}
              </button>
              <button
                onClick={() => setSelectedTab('personal-events')}
                className={`flex-1 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  selectedTab === 'personal-events'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-card text-foreground hover:bg-secondary/80 border border-border/50'
                }`}
              >
                {t('personalEvents')}
              </button>
              <button
                onClick={() => setSelectedTab('groups')}
                className={`flex-1 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  selectedTab === 'groups'
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-card text-foreground hover:bg-secondary/80 border border-border/50'
                }`}
              >
                {tCommon('groups')}
              </button>
            </div>

            {/* Categories */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((category) => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-xl whitespace-nowrap transition-all text-sm shadow-sm ${
                    selectedCategory === category.key
                      ? 'bg-primary text-white'
                      : 'bg-card text-foreground hover:bg-secondary/80 border border-border/50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Events/Groups List - Mobile */}
          <div className="px-4 py-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {selectedTab === 'groups' ? `${filteredGroups.length} ${t('groupCount')}` : `${filteredEvents.length} ${t('eventCount')}`}
          </p>
          {activeFilterCount > 0 && (
            <span className="text-xs text-primary">
              {activeFilterCount} {tCommon('filters')}
            </span>
          )}
        </div>

        {selectedTab === 'groups' ? (
          /* Groups List */
          filteredGroups.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => onGroupClick?.(group.id)}
                  className="w-full bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all text-left group"
                >
                  {/* Image */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {group.isVerified && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 bg-primary text-white text-xs rounded-full flex items-center gap-1">
                        <span>✓</span>
                        <span>{tCommon('verified')}</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Group Name */}
                    <h3 className="mb-3 line-clamp-2 leading-snug">{group.name}</h3>

                    {/* Members & Events Count */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <UsersIcon className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{group.members.toLocaleString()}</span>
                      </div>
                      <span className="text-muted-foreground/50">•</span>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{group.eventCount} {tCommon('events')}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                      {group.description}
                    </p>

                    {/* Category & Host */}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{group.category}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{group.hostName}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Search className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground mb-2">{t('noGroups')}</p>
              <p className="text-sm text-muted-foreground">{t('tryDifferentSearch')}</p>
            </div>
          )
        ) : (
          /* Events List */
          filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick(event.id)}
                className="w-full bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all text-left group"
              >
                {/* Image */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {event.attendees >= event.maxAttendees - 5 && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 bg-red-500 text-white text-xs rounded-full">
                      {t('closingSoon')}
                    </div>
                  )}
                  
                  {/* Participants Avatars */}
                  {event.attendees > 0 && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-background/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-lg border border-border/50">
                      <div className="flex items-center -space-x-2">
                        {/* Show up to 3 avatar circles */}
                        {[...Array(Math.min(3, event.attendees))].map((_, index) => {
                          const avatarColors = [
                            ['#9eb384', '#8da372'],
                            ['#c8d5b9', '#b8c5a9'],
                            ['#a8c090', '#98b080'],
                          ];
                          const [colorStart, colorEnd] = avatarColors[index % 3];
                          
                          return (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border-2 border-background flex items-center justify-center shadow-sm"
                              style={{
                                background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`
                              }}
                            >
                              <span className="text-[10px] text-white font-semibold">
                                {String.fromCharCode(65 + index)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <span className="text-xs text-foreground font-medium ml-0.5">
                        {event.attendees > 3 && '+'}{event.attendees > 3 ? event.attendees - 3 : event.attendees}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="mb-3 line-clamp-2 leading-snug">{event.title}</h3>

                  {/* Date, Time, Location */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{event.date}</span>
                    </div>
                    <span className="text-muted-foreground/50">•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <span className="text-muted-foreground/50">•</span>
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground line-clamp-1 mb-3">
                    {event.description}
                  </p>

                  {/* Group/Host Name & Rating */}
                  <div className="flex items-center gap-2 text-sm">
                    {event.type === 'group' && getGroupName(event.groupId) && (
                      <>
                        <span className="text-muted-foreground">{getGroupName(event.groupId)}</span>
                        <span className="text-muted-foreground/50">•</span>
                      </>
                    )}
                    {event.type === 'personal' && event.hostName && (
                      <>
                        <span className="text-muted-foreground">by {event.hostName}</span>
                        <span className="text-muted-foreground/50">•</span>
                      </>
                    )}
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-muted-foreground">{(event.rating || 4.5).toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Search className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-2">{t('noEvents')}</p>
            <p className="text-sm text-muted-foreground">{t('tryDifferentSearch')}</p>
          </div>
        )
        )}
          </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block flex-1">
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
                onClick={() => setSelectedTab('group-events')}
                className={`px-5 py-2 rounded-t-lg transition-all text-sm font-medium border-b-2 ${
                  selectedTab === 'group-events'
                    ? 'text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
                }`}
              >
                {t('groupEvents')}
              </button>
              <button
                onClick={() => setSelectedTab('personal-events')}
                className={`px-5 py-2 rounded-t-lg transition-all text-sm font-medium border-b-2 ${
                  selectedTab === 'personal-events'
                    ? 'text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
                }`}
              >
                {t('personalEvents')}
              </button>
              <button
                onClick={() => setSelectedTab('groups')}
                className={`px-5 py-2 rounded-t-lg transition-all text-sm font-medium border-b-2 ${
                  selectedTab === 'groups'
                    ? 'text-primary border-primary'
                    : 'text-muted-foreground border-transparent hover:text-foreground hover:border-border'
                }`}
              >
                {tCommon('groups')}
              </button>
            </div>

            {/* Categories and Filters */}
            <div className="py-3 flex items-center justify-between gap-4">
              {/* Categories */}
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
                <Popover modal={true}>
                  <PopoverTrigger asChild>
                    <button className="relative flex items-center gap-2 px-4 py-2 bg-white border border-border/50 rounded-full hover:bg-secondary/50 transition-colors">
                      <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{tCommon('filters')}</span>
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
                      <h3 className="font-semibold">{tCommon('filters')}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{t('findEventsDescription')}</p>
                    </div>
                    
                    <div className="p-4 space-y-4 max-h-[400px] overflow-y-auto">
                      {/* Location Filter */}
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <label className="text-sm font-medium">{tCommon('location')}</label>
                        </div>
                        <LocationFilter
                          selectedLocation={tempLocation}
                          onLocationChange={setTempLocation}
                        />
                      </div>

                      {/* Date Filter - Only for Events */}
                      {selectedTab !== 'groups' && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <label className="text-sm font-medium">{tCommon('date')}</label>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'all', label: t('allDates') },
                              { value: 'today', label: t('today') },
                              { value: 'thisWeek', label: t('thisWeek') },
                              { value: 'thisMonth', label: t('thisMonth') },
                            ].map((option) => (
                              <button
                                key={option.value}
                                onClick={() => setTempDate(option.value)}
                                className={`px-3 py-2 rounded-lg text-xs transition-all ${
                                  tempDate === option.value
                                    ? 'bg-primary text-white'
                                    : 'bg-secondary/50 text-foreground hover:bg-secondary'
                                }`}
                              >
                                {option.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Member Size Filter - Only for Groups */}
                      {selectedTab === 'groups' && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <UsersIcon className="w-3.5 h-3.5 text-primary" />
                            <label className="text-sm font-medium">{t('memberSize')}</label>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'all', label: t('memberAll') },
                              { value: 'small', label: t('memberSmall') },
                              { value: 'medium', label: t('memberMedium') },
                              { value: 'large', label: t('memberLarge') },
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
                      )}

                      {/* Activity Level Filter - Only for Groups */}
                      {selectedTab === 'groups' && (
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="w-3.5 h-3.5 text-primary" />
                            <label className="text-sm font-medium">{t('activityLevel')}</label>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { value: 'all', label: t('activityAll') },
                              { value: 'active', label: t('activityActive') },
                              { value: 'moderate', label: t('activityModerate') },
                              { value: 'new', label: t('activityNew') },
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
                      )}
                    </div>

                    <div className="border-t border-border p-3 bg-muted/30">
                      <div className="flex gap-2">
                        <PopoverClose asChild>
                          <Button variant="outline" onClick={resetFilters} className="flex-1 h-9 text-xs">
                            {tCommon('reset')}
                          </Button>
                        </PopoverClose>
                        <PopoverClose asChild>
                          <Button onClick={applyFilters} className="flex-1 h-9 text-xs">
                            {tCommon('apply')}
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
        <div className="px-8 lg:px-24 xl:px-32 2xl:px-40 py-6">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {selectedTab === 'groups' ? `${filteredGroups.length} ${t('groupCount')}` : `${filteredEvents.length} ${t('eventCount')}`}
            </p>
          </div>

          {selectedTab === 'groups' ? (
            filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {filteredGroups.map((group) => (
                  <button
                    key={group.id}
                    onClick={() => onGroupClick?.(group.id)}
                    className="w-full bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg border border-border/50">
                        <UsersIcon className="w-4 h-4 text-primary" />
                        <span className="text-xs text-foreground font-medium">
                          {group.members.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <span className="inline-block text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-lg">
                          {group.category}
                        </span>
                      </div>
                      <h3 className="mb-2 truncate leading-snug">{group.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {group.description}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-0.5">
                          <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="whitespace-nowrap">{group.eventCount} {tCommon('events')}</span>
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
                <UsersIcon className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-2">{t('noGroups')}</p>
              </div>
            )
          ) : (
            filteredEvents.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {filteredEvents.map((event) => (
                  <button
                    key={event.id}
                    onClick={() => onEventClick(event.id)}
                    className="w-full bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all text-left group"
                  >
                    <div className="relative w-full h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {event.attendees > 0 && (
                        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-background/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-lg border border-border/50">
                          <span className="text-xs text-foreground font-medium">
                            {event.attendees}/{event.maxAttendees}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="mb-2">
                        <span className="inline-block text-xs px-2.5 py-1 bg-primary/10 text-primary rounded-lg">
                          {event.category}
                        </span>
                      </div>
                      <h3 className="mb-2 truncate leading-snug">{event.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="truncate">{event.date}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground">{(event.rating || 4.5).toFixed(1)}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Search className="w-16 h-16 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground mb-2">{t('noEvents')}</p>
              </div>
            )
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
