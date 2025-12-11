"use client";

import { Search, MessageCircle, LogIn, ChevronDown, Calendar, Users, UserCircle, Settings, Flag, LogOut, Bookmark, UserPlus, Edit, MapPin, X } from 'lucide-react';
import { useTranslations } from '@/lib/useTranslations';
import { AppLogo } from '@/shared/components/AppLogo';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { LanguageSelector } from '@/shared/components/LanguageSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '../components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../components/ui/tooltip';
import { useState } from 'react';
import regionsData from '@/assets/regions.json';

interface User {
  name?: string;
  nickname?: string;
  email?: string;
  profileImageUrl?: string;
}

interface WebHeaderProps {
  onProfileClick: () => void;
  onMessagesClick: () => void;
  onLoginClick: () => void;
  onLogoClick: () => void;
  onSearch: (query: string, location: string) => void;
  onMyEventsClick: () => void;
  onMyGroupsClick: () => void;
  onMyCreatedEventsClick?: () => void;
  onMyJoinedEventsClick?: () => void;
  onMySavedEventsClick?: () => void;
  onMyCreatedGroupsClick?: () => void;
  onMyJoinedGroupsClick?: () => void;
  onCreateGroupClick?: () => void;
  onCreateEventClick?: () => void;
  onSettingsClick?: () => void;
  onReportClick?: () => void;
  onLogoutClick?: () => void;
  isLoggedIn?: boolean;
  user?: User | null;
}

// regions.json 파일에서 가져온 데이터 사용
const locations = regionsData as Record<string, string[]>;

export function WebHeader({
  onProfileClick,
  onMessagesClick,
  onLoginClick,
  onLogoClick,
  onSearch,
  onMyCreatedEventsClick,
  onMyJoinedEventsClick,
  onMySavedEventsClick,
  onMyCreatedGroupsClick,
  onMyJoinedGroupsClick,
  onCreateGroupClick,
  onCreateEventClick,
  onSettingsClick,
  onReportClick,
  onLogoutClick,
  isLoggedIn = false,
  user = null
}: WebHeaderProps) {
  const t = useTranslations('header');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(t('allRegions'));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery, selectedLocation);
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
  };

  // 유저 이름의 이니셜 생성 (예: "안우상" -> "안우", "John Doe" -> "JD")
  const getUserInitials = () => {
    // nickname을 우선 사용, 없으면 email에서 앞 2글자 추출
    let displayName = user?.nickname;

    if (!displayName) {
      // nickname이 없으면 email에서 @ 앞부분의 앞 2글자 추출
      const emailPrefix = user?.email?.split('@')[0];
      displayName = emailPrefix?.substring(0, 2).toUpperCase() || '?';
      return displayName;
    }

    const trimmed = displayName.trim();

    // 한글 이름인 경우 (예: "안우상" -> "안우")
    if (/[\u3131-\uD79D]/.test(trimmed)) {
      return trimmed.substring(0, 2);
    }

    // 영문 이름인 경우 (예: "John Doe" -> "JD")
    const names = trimmed.split(' ');
    if (names.length === 1) {
      return names[0].substring(0, 2).toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white shadow-sm">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-24 xl:px-32 2xl:px-40">
        <div className="flex h-20 items-center justify-between gap-8 py-5">
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <AppLogo compact onClick={onLogoClick} />
          </div>

          {/* Search Bar - Center */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="flex items-center gap-0 bg-white border-2 border-border rounded-full hover:border-primary/50 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              {/* Event/Group Search */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="w-full pl-5 pr-10 py-1.5 bg-transparent border-0 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary/50 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-muted-foreground" />
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-border/50" />

              {/* Location Dropdown */}
              <div className="relative">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-1.5 hover:bg-secondary/30 transition-colors min-w-[140px]"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate">{selectedLocation}</span>
                      {selectedLocation !== t('allRegions') && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedLocation(t('allRegions'));
                          }}
                          className="p-0.5 hover:bg-secondary/50 rounded-full transition-colors flex-shrink-0"
                        >
                          <X className="w-3 h-3 text-muted-foreground" />
                        </button>
                      )}
                      {selectedLocation === t('allRegions') && (
                        <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 max-h-[400px] overflow-y-auto">
                    <DropdownMenuItem onClick={() => handleLocationChange(t('allRegions'))}>
                      {t('allRegions')}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {Object.entries(locations).map(([city, districts]) => (
                      districts.length === 1 && districts[0] === '전체' ? (
                        <DropdownMenuItem key={city} onClick={() => handleLocationChange(city)}>
                          {city}
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuSub key={city}>
                          <DropdownMenuSubTrigger>{city}</DropdownMenuSubTrigger>
                          <DropdownMenuSubContent className="max-h-96 overflow-y-auto">
                            <DropdownMenuItem onClick={() => handleLocationChange(city)}>
                              {city} {t('allCity')}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {districts.map((district) => (
                              <DropdownMenuItem
                                key={district}
                                onClick={() => handleLocationChange(`${city} ${district}`)}
                              >
                                {district}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuSubContent>
                        </DropdownMenuSub>
                      )
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Search Button */}
              <button
                type="submit"
                className="m-0.5 w-8 h-8 bg-primary hover:bg-primary/90 transition-colors flex items-center justify-center rounded-full flex-shrink-0"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            <TooltipProvider>
              {/* Make Event Button */}
              {isLoggedIn && onCreateEventClick && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onCreateEventClick}
                      className="p-2.5 rounded-full hover:bg-secondary/80 transition-all"
                    >
                      <Calendar className="w-5 h-5 text-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('createEvent')}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Make Group Button */}
              {isLoggedIn && onCreateGroupClick && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onCreateGroupClick}
                      className="p-2.5 rounded-full hover:bg-secondary/80 transition-all"
                    >
                      <Users className="w-5 h-5 text-foreground" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('createGroup')}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              {/* Language Selector */}
              <LanguageSelector />

              {/* Messages Icon - 로그인 시에만 표시 */}
              {isLoggedIn && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={onMessagesClick}
                      className="relative p-2.5 rounded-full hover:bg-secondary/80 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-muted-foreground" />
                      {/* Notification Badge */}
                      <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t('messages')}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </TooltipProvider>

            {isLoggedIn ? (
              /* Profile Dropdown */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-secondary/80 transition-colors">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-white text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {/* My Events - with submenu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <Calendar className="w-4 h-4 mr-3 text-primary" />
                      <span>{t('myEvents')}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48">
                      <DropdownMenuItem onClick={onMyCreatedEventsClick} className="cursor-pointer">
                        <Edit className="w-4 h-4 mr-3 text-muted-foreground" />
                        <span>{t('myCreatedEvents')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onMyJoinedEventsClick} className="cursor-pointer">
                        <UserPlus className="w-4 h-4 mr-3 text-muted-foreground" />
                        <span>{t('myJoinedEvents')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onMySavedEventsClick} className="cursor-pointer">
                        <Bookmark className="w-4 h-4 mr-3 text-muted-foreground" />
                        <span>{t('mySavedEvents')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  {/* My Groups - with submenu */}
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="cursor-pointer">
                      <Users className="w-4 h-4 mr-3 text-primary" />
                      <span>{t('myGroups')}</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-48">
                      <DropdownMenuItem onClick={onMyCreatedGroupsClick} className="cursor-pointer">
                        <Edit className="w-4 h-4 mr-3 text-muted-foreground" />
                        <span>{t('myCreatedGroups')}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={onMyJoinedGroupsClick} className="cursor-pointer">
                        <UserPlus className="w-4 h-4 mr-3 text-muted-foreground" />
                        <span>{t('myJoinedGroups')}</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>

                  <DropdownMenuItem onClick={onProfileClick} className="cursor-pointer">
                    <UserCircle className="w-4 h-4 mr-3 text-primary" />
                    <span>{t('myProfile')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onSettingsClick} className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span>{t('settings')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onReportClick} className="cursor-pointer">
                    <Flag className="w-4 h-4 mr-3 text-muted-foreground" />
                    <span>{t('report')}</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onLogoutClick} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>{t('logout')}</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Login Button */
              <button
                onClick={onLoginClick}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-all shadow-sm"
              >
                <LogIn className="w-4 h-4" />
                <span className="text-sm font-medium">{t('login')}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
