"use client";

import { Users, MapPin, Star, MessageCircle, MoreVertical, Edit, UserCog, Trash2, Share2, Heart, Flag } from 'lucide-react';
import { useGroup, useGroupMembers, useGroupImages, useGroupEvents } from '@/domains/group/hooks';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { PhotoGallery } from '@/domains/event/components/PhotoGallery';
import { ShareDialog } from '@/shared/components/ShareDialog';
import { MembersModal } from '@/shared/components/MembersModal';
import { useUIStore } from '@/shared/store/uiStore';
import { useLike } from '@/shared/hooks';
import { useState, useRef } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';

interface GroupDetailScreenProps {
  groupId: string;
  onBack: () => void;
  onEventClick: (eventId: string) => void;
  onUserClick: (userId: string) => void;
  onMessageClick?: (userId: string) => void;
  isOwner?: boolean;
  onEditGroup?: () => void;
  onManageMembers?: () => void;
  onDeleteGroup?: () => void;
}

export function GroupDetailScreen({ groupId, onBack, onEventClick, onUserClick, onMessageClick, isOwner = false, onEditGroup, onManageMembers, onDeleteGroup }: GroupDetailScreenProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'events' | 'photos'>('about');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [displayedEventsCount, setDisplayedEventsCount] = useState(4);
  const [displayedPastEventsCount, setDisplayedPastEventsCount] = useState(4);
  const { openShareDialog } = useUIStore();
  const { isLiked, toggleLike } = useLike(groupId, 'group');

  // Refs for scroll-to-section
  const aboutRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: 'about' | 'events' | 'photos') => {
    setActiveTab(tab);

    // Scroll to the corresponding section after state update
    setTimeout(() => {
      const refs = {
        about: aboutRef,
        events: eventsRef,
        photos: photosRef
      };

      const targetRef = refs[tab];
      if (targetRef.current) {
        // Get the scroll container by ID
        const scrollContainer = document.getElementById('main-scroll-container');

        if (scrollContainer) {
          // Calculate the position relative to the scroll container
          const containerRect = scrollContainer.getBoundingClientRect();
          const targetRect = targetRef.current.getBoundingClientRect();
          const offsetTop = targetRect.top - containerRect.top + scrollContainer.scrollTop;

          // Scroll with offset for sticky tab bar (approximately 60px for tab bar height)
          scrollContainer.scrollTo({
            top: offsetTop - 60,
            behavior: 'smooth'
          });
        }
      }
    }, 50);
  };

  // Fetch group data from Supabase
  const { data: group, isLoading } = useGroup(groupId);

  // Fetch group members from Supabase
  const { data: members = [] } = useGroupMembers(groupId);

  // Fetch group images from Supabase
  const { data: groupPhotos = [] } = useGroupImages(groupId);

  // Fetch group events from Supabase (특정 그룹의 이벤트만 가져오기)
  const { data: rawGroupEvents = [] } = useGroupEvents(groupId);

  // API 응답을 화면 형식으로 변환
  const groupEvents = rawGroupEvents.map((event: any) => ({
    id: event.id,
    title: event.title,
    image: event.thumbnail_image_url || '/images/placeholder-event.jpg',
    date: event.datetime ? new Date(event.datetime).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : '',
    time: event.datetime ? new Date(event.datetime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : '',
    location: event.streetAddress || '',
    attendees: event.attendees || 0,
    groupId: event.group_id,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading group...</p>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold mb-2">Group not found</p>
          <p className="text-muted-foreground mb-4">The group you're looking for doesn't exist.</p>
          <Button onClick={onBack}>Go Back</Button>
        </div>
      </div>
    );
  }

  // Mock 데이터: 리뷰/평점 (추후 구현 시 실제 API로 대체)
  const mockReviews = [
    {
      name: 'Sarah Johnson',
      initial: 'S',
      color: 'bg-pink-200',
      rating: 5,
      date: 'October 15, 2024',
      text: 'Amazing experience! The atmosphere was so welcoming and I met so many interesting people from different countries.'
    },
    {
      name: 'Kim Min-ji',
      initial: '김',
      color: 'bg-purple-200',
      rating: 5,
      date: 'October 12, 2024',
      text: 'Great way to practice English and make friends! The organizers are super friendly and make everyone feel included.'
    },
    {
      name: 'Alex Martinez',
      initial: 'A',
      color: 'bg-blue-200',
      rating: 4,
      date: 'October 8, 2024',
      text: 'Really enjoyed the event. The venue was perfect and the activities were well-organized.'
    },
  ];

  // 멤버 아바타를 위한 헬퍼 함수
  const getInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getAvatarColor = (index: number) => {
    const colors = ['bg-pink-200', 'bg-purple-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200'];
    return colors[index % colors.length];
  };

  // 그룹 포토 URL만 추출
  const groupPhotoUrls = groupPhotos.map(photo => photo.imageUrl);

  return (
    <>
      <div className="min-h-screen bg-background pb-12">
        {/* Main Content */}
        <div className="px-8 xl:px-12 pt-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
              {/* Left Column */}
              <div className="space-y-8">
                {/* Group Header */}
                <div className="flex items-start gap-6">
                  {/* Group Logo */}
                  <div className="w-48 h-48 rounded-2xl flex-shrink-0 shadow-lg overflow-hidden">
                    <img
                      src={group.image}
                      alt={group.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Group Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <h1 className="text-4xl flex-1">{group.name}</h1>
                      {isOwner && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2">
                              <MoreVertical className="w-4 h-4" />
                              <span className="text-sm font-medium">관리</span>
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={onEditGroup} className="cursor-pointer">
                              <Edit className="w-4 h-4 mr-3 text-primary" />
                              <span>그룹 수정</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onManageMembers} className="cursor-pointer">
                              <UserCog className="w-4 h-4 mr-3 text-primary" />
                              <span>멤버 관리</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onDeleteGroup} className="cursor-pointer text-destructive focus:text-destructive">
                              <Trash2 className="w-4 h-4 mr-3" />
                              <span>그룹 삭제</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4].map((star) => (
                          <Star key={star} className="w-4 h-4 fill-red-500 text-red-500" />
                        ))}
                        <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                      </div>
                      <span className="text-sm">4.3 · 16 ratings</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{group.location}</span>
                    </div>

                    {/* Members */}
                    <div className="flex items-center gap-2 text-muted-foreground mb-4">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{members.length} members · Public group</span>
                    </div>

                  </div>
                </div>

                {/* Tabs - Sticky */}
                <div className="sticky top-0 z-10 bg-background border-b border-border">
                  <div className="flex items-center gap-1">
                    {[
                      { id: 'about', icon: '🎨', label: 'About' },
                      { id: 'events', icon: '🎁', label: 'Events' },
                      { id: 'photos', icon: '🖼️', label: 'Photos' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => handleTabClick(tab.id as 'about' | 'events' | 'photos')}
                        className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                          activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span>{tab.icon}</span>
                        <span className="text-sm">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'about' && (
                  <div ref={aboutRef} className="space-y-8">
                    {/* What we're about */}
                    <div>
                      <h2 className="mb-4">그룹 소개</h2>
                      <div className="bg-card rounded-2xl p-6 border border-border shadow-sm">
                        <p className="text-muted-foreground leading-relaxed">{group.description}</p>
                      </div>
                    </div>

                    {/* Related topics */}
                    {group.tags && group.tags.length > 0 && (
                      <div>
                        <h2 className="mb-4">관심사</h2>
                        <div className="flex flex-wrap gap-2">
                          {group.tags.map((topic, idx) => (
                            <button
                              key={idx}
                              className="px-4 py-2 bg-muted/50 border border-border rounded-full text-sm hover:bg-muted transition-colors"
                            >
                              {topic}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Ratings */}
                    <div>
                      <h2 className="mb-4">Ratings</h2>
                      <div className="bg-card border border-border rounded-2xl p-6">
                        <div className="flex items-start gap-6 mb-6">
                          <div className="text-center">
                            <div className="text-5xl mb-2">4.3</div>
                            <div className="flex items-center justify-center gap-1 mb-1">
                              {[1, 2, 3, 4].map((star) => (
                                <Star key={star} className="w-4 h-4 fill-red-500 text-red-500" />
                              ))}
                              <Star className="w-4 h-4 fill-gray-300 text-gray-300" />
                            </div>
                            <p className="text-sm text-muted-foreground">16 ratings</p>
                          </div>

                          <div className="flex-1 space-y-2">
                            {[
                              { stars: 5, count: 10, percentage: 62.5 },
                              { stars: 4, count: 4, percentage: 25 },
                              { stars: 3, count: 2, percentage: 12.5 },
                              { stars: 2, count: 0, percentage: 0 },
                              { stars: 1, count: 0, percentage: 0 },
                            ].map((rating) => (
                              <div key={rating.stars} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-12">
                                  <span className="text-sm">{rating.stars}</span>
                                  <Star className="w-3 h-3 fill-gray-400 text-gray-400" />
                                </div>
                                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-red-500 rounded-full"
                                    style={{ width: `${rating.percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground w-8">{rating.count}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reviews */}
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h2>Reviews ({mockReviews.length})</h2>
                        <button className="text-sm text-primary hover:underline">See all</button>
                      </div>

                      <div className="space-y-4">
                        {mockReviews.map((review, idx) => (
                          <div key={idx} className="bg-card border border-border rounded-2xl p-5">
                            <div className="flex items-start gap-3 mb-3">
                              <div className={`w-12 h-12 rounded-full ${review.color} flex items-center justify-center flex-shrink-0`}>
                                <span>{review.initial}</span>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium mb-1">{review.name}</p>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="flex">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-3 h-3 ${
                                          i < review.rating
                                            ? 'fill-red-500 text-red-500'
                                            : 'fill-gray-300 text-gray-300'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">{review.date}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div ref={eventsRef} className="space-y-8">
                    {/* Upcoming Events */}
                    <div>
                      <h2 className="mb-4">Upcoming events ({groupEvents.length})</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupEvents.slice(0, displayedEventsCount).map((event: any) => (
                          <div
                            key={event.id}
                            className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                            onClick={() => onEventClick(event.id)}
                          >
                            <div className="relative aspect-[16/9]">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4">
                              <p className="text-xs text-muted-foreground mb-2">{event.date} · {event.time}</p>
                              <h3 className="mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                              <div className="flex items-start gap-2 text-xs text-muted-foreground mb-2">
                                <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                  {members.slice(0, 3).map((member, idx) => (
                                    <div
                                      key={idx}
                                      className={`w-6 h-6 rounded-full border-2 border-background ${getAvatarColor(idx)} flex items-center justify-center text-xs`}
                                    >
                                      {getInitial(member.name)}
                                    </div>
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{event.attendees} attendees</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 더보기 버튼 */}
                      {groupEvents.length > displayedEventsCount && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={() => setDisplayedEventsCount(prev => prev + 4)}
                            className="px-6 py-3 bg-muted hover:bg-secondary rounded-xl transition-colors text-sm font-medium"
                          >
                            더보기 +{Math.min(4, groupEvents.length - displayedEventsCount)}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Past Events */}
                    <div>
                      <h2 className="mb-4">Past events ({groupEvents.length})</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {groupEvents.slice(0, displayedPastEventsCount).map((event: any) => (
                          <div
                            key={`past-${event.id}`}
                            className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group opacity-80"
                            onClick={() => onEventClick(event.id)}
                          >
                            <div className="relative aspect-[16/9]">
                              <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover grayscale-[30%]"
                              />
                            </div>
                            <div className="p-4">
                              <p className="text-xs text-muted-foreground mb-2">{event.date} · {event.time}</p>
                              <h3 className="mb-3 group-hover:text-primary transition-colors">{event.title}</h3>
                              <div className="flex items-start gap-2 text-xs text-muted-foreground mb-2">
                                <MapPin className="w-3 h-3 flex-shrink-0 mt-0.5" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                  {members.slice(0, 3).map((member, idx) => (
                                    <div
                                      key={idx}
                                      className={`w-6 h-6 rounded-full border-2 border-background ${getAvatarColor(idx)} flex items-center justify-center text-xs`}
                                    >
                                      {getInitial(member.name)}
                                    </div>
                                  ))}
                                </div>
                                <span className="text-xs text-muted-foreground">{event.attendees} attendees</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Past Events 더보기 버튼 */}
                      {groupEvents.length > displayedPastEventsCount && (
                        <div className="flex justify-center mt-6">
                          <button
                            onClick={() => setDisplayedPastEventsCount(prev => prev + 4)}
                            className="px-6 py-3 bg-muted hover:bg-secondary rounded-xl transition-colors text-sm font-medium"
                          >
                            더보기 +{Math.min(4, groupEvents.length - displayedPastEventsCount)}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'photos' && (
                  <div ref={photosRef}>
                    <h2 className="mb-4">Photos ({groupPhotos.length})</h2>
                    {groupPhotos.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {groupPhotos.slice(0, 6).map((photo, idx) => (
                          <button
                            key={photo.id}
                            onClick={() => {
                              setGalleryStartIndex(idx);
                              setIsGalleryOpen(true);
                            }}
                            className="relative aspect-square rounded-xl overflow-hidden bg-muted"
                          >
                            <img
                              src={photo.imageUrl}
                              alt={photo.caption || `Group photo ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                            {idx === 5 && groupPhotos.length > 6 && (
                              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                <p className="text-white text-2xl">+{groupPhotos.length - 6}</p>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 text-center bg-muted/30 rounded-xl border border-border/50">
                        <p className="text-muted-foreground">아직 그룹 사진이 없습니다</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="space-y-6">
                {/* Join Button - Sticky */}
                <div className="lg:sticky lg:top-6">
                  {/* Organizers */}
                  <div className="bg-card border border-border rounded-2xl p-5 mb-3">
                    <h3 className="mb-4">Organizer</h3>
                    <button
                      onClick={() => onUserClick(group.hostId)}
                      className="flex items-center gap-3 hover:opacity-80 transition-opacity w-full"
                    >
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {group.hostName ? group.hostName.split(' ').map(n => n[0]).join('') : 'O'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-left">
                        <p className="font-bold">{group.hostName || 'Organizer'}</p>
                      </div>
                    </button>
                    <button
                      className="w-full mt-3 py-2 bg-transparent rounded-lg hover:text-primary transition-all flex items-center justify-center gap-2 group focus:outline-none"
                      onClick={() => onMessageClick?.(group.hostId)}
                    >
                      <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="font-medium">Message</span>
                    </button>
                  </div>

                  {/* Members */}
                  <div className="bg-card border border-border rounded-2xl p-5 mb-3">
                    <div className="flex items-center justify-between mb-4">
                      <h3>Members ({members.filter(m => m.role !== 'admin').length.toLocaleString()})</h3>
                      <button
                        onClick={() => setIsMembersModalOpen(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        See all
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {members
                        .filter(member => member.role !== 'admin')
                        .slice(0, members.filter(m => m.role !== 'admin').length > 9 ? 9 : 10)
                        .map((member, idx) => (
                          <div
                            key={member.id}
                            className="relative group cursor-default"
                          >
                            {member.avatarUrl ? (
                              <img
                                src={member.avatarUrl}
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div
                                className={`w-12 h-12 rounded-full ${getAvatarColor(idx)} flex items-center justify-center`}
                              >
                                <span className="text-sm">{getInitial(member.name)}</span>
                              </div>
                            )}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                              {member.name}
                            </div>
                          </div>
                        ))}
                      {members.filter(m => m.role !== 'admin').length > 9 && (
                        <div className="relative group cursor-pointer" onClick={() => setIsMembersModalOpen(true)}>
                          <button
                            className="w-12 h-12 rounded-full bg-muted flex items-center justify-center font-medium text-xs hover:scale-110 transition-transform"
                          >
                            +{(members.filter(m => m.role !== 'admin').length - 9).toLocaleString()}
                          </button>
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            more
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button className="w-full h-12 bg-foreground hover:bg-foreground/90 text-background mb-3">
                    Join this group
                  </Button>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 px-3 py-2 bg-muted rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
                      onClick={() =>
                        openShareDialog({
                          title: '그룹 공유하기',
                          description: '그룹을 친구들과 공유하세요.',
                          shareText: group?.name || '',
                        })
                      }
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span className="text-xs">Share</span>
                    </button>
                    <button
                      className="flex-1 px-3 py-2 bg-muted rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
                      onClick={toggleLike}
                    >
                      {isLiked ? (
                        <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                      ) : (
                        <Heart className="w-3.5 h-3.5" />
                      )}
                      <span className="text-xs">{isLiked ? 'Liked' : 'Like'}</span>
                    </button>
                    <button className="flex-1 px-3 py-2 bg-muted rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-1.5">
                      <Flag className="w-3.5 h-3.5" />
                      <span className="text-xs">Report</span>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Gallery Modal */}
      <PhotoGallery
        photos={groupPhotoUrls}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={galleryStartIndex}
      />

      {/* Members Modal */}
      <MembersModal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        members={members}
        title="Group Members"
        onMemberClick={onUserClick}
      />

      {/* Share Dialog */}
      <ShareDialog />
    </>
  );
}
