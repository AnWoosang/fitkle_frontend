'use client';

import { useEvent, useEventParticipants, useEventImages, useEventHost } from '../hooks';
import { useGroup } from '@/domains/group/hooks';
import { BackButton } from '@/shared/components/BackButton';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Calendar, CheckCircle2, Edit, Flag, Heart, MapPin, MoreVertical, Share2, Star, Trash2, User, UserCog, Users } from 'lucide-react';
import { useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { EventMap } from './EventMap';
import { PhotoGallery } from './PhotoGallery';
import { EventCard } from './EventCard';
import { ShareDialog } from '@/shared/components/ShareDialog';
import { MembersModal } from '@/shared/components/MembersModal';
import { useUIStore } from '@/shared/store/uiStore';
import { useLike } from '@/shared/hooks';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/shared/components/ui/carousel';

interface EventDetailScreenProps {
  eventId: string;
  onBack: () => void;
  onHostClick: (userId: string) => void;
  isOwner?: boolean;
  onEditEvent?: () => void;
  onManageAttendees?: () => void;
  onDeleteEvent?: () => void;
}

export function EventDetailScreen({ eventId, onBack, onHostClick, isOwner = false, onEditEvent, onManageAttendees, onDeleteEvent }: EventDetailScreenProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'about' | 'photos'>('about');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isAttendeesModalOpen, setIsAttendeesModalOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const { openShareDialog } = useUIStore();
  const { isLiked, toggleLike } = useLike(eventId, 'event');

  // Refs for scroll-to-section
  const aboutRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: 'about' | 'photos') => {
    setActiveTab(tab);

    // Scroll to the corresponding section after state update
    setTimeout(() => {
      const refs = {
        about: aboutRef,
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

  // Fetch event data using hook
  const { data: event, isLoading, error } = useEvent(eventId);

  // Fetch group data if event has a groupId
  const { data: groupData } = useGroup(event?.groupId || '');

  // Fetch participants, images, and host using hooks
  const { data: rawParticipants = [] } = useEventParticipants(eventId);
  const { data: rawEventImages = [] } = useEventImages(eventId);
  const { data: hostData } = useEventHost(eventId);

  // 이벤트 카드 클릭 핸들러 (useCallback으로 메모이제이션) - Hook이므로 조건문 이전에 호출
  const handleEventCardClick = useCallback((eventId: string) => {
    router.push(`/events/${eventId}`);
  }, [router]);

  // API 응답을 UI 형식으로 변환
  const attendees = rawParticipants.map((participant: any) => ({
    id: participant.id,
    name: participant.name,
    avatarUrl: participant.avatarUrl,
    status: participant.status,
  }));

  const photos = rawEventImages.map((img: any) => ({
    id: img.id,
    url: img.imageUrl,
    caption: img.caption,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading event...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-destructive mb-2">Error loading event</p>
          <p className="text-sm text-muted-foreground">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Event not found</p>
      </div>
    );
  }

  // Mock 추천 이벤트 데이터
  const recommendedEvents = [
    {
      id: 'rec-1',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: '10월 20일',
      time: '7:00 PM',
      title: 'Coffee Chat at Blue Bottle',
      location: '서울시 강남구',
      attendees: 5,
      maxAttendees: 10,
      category: 'cafe'
    },
    {
      id: 'rec-2',
      image: 'https://images.unsplash.com/photo-1587280501635-68a0e82cd5ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: '10월 21일',
      time: '6:00 PM',
      title: 'Weekend Tennis Match',
      location: '서울시 송파구',
      attendees: 4,
      maxAttendees: 8,
      category: 'fitness'
    },
    {
      id: 'rec-3',
      image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: '10월 22일',
      time: '2:00 PM',
      title: 'Study Session at Library',
      location: '서울시 서초구',
      attendees: 6,
      maxAttendees: 12,
      category: 'language'
    },
    {
      id: 'rec-4',
      image: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: '10월 23일',
      time: '8:00 PM',
      title: 'Movie Night: Korean Cinema',
      location: '서울시 마포구',
      attendees: 8,
      maxAttendees: 15,
      category: 'art'
    }
  ];

  // Mock 최근 본 이벤트 데이터
  const recentlyViewedEvents = [
    {
      id: 'recent-1',
      image: 'https://images.unsplash.com/photo-1534083449179-cc7f3afd1b8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: '10월 24일',
      time: '9:00 AM',
      title: 'Morning Jog at Han River',
      location: '서울시 용산구',
      attendees: 10,
      maxAttendees: 20,
      category: 'fitness'
    },
    {
      id: 'recent-2',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: '10월 25일',
      time: '7:00 PM',
      title: 'Cooking Together: Italian Night',
      location: '서울시 용산구',
      attendees: 6,
      maxAttendees: 10,
      category: 'food'
    },
    {
      id: 'recent-3',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: '10월 26일',
      time: '3:00 PM',
      title: 'Traditional Tea Ceremony',
      location: '서울시 종로구',
      attendees: 8,
      maxAttendees: 12,
      category: 'culture'
    },
    {
      id: 'recent-4',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: '10월 27일',
      time: '5:00 PM',
      title: 'Photography Walk in Seoul',
      location: '서울시 중구',
      attendees: 7,
      maxAttendees: 10,
      category: 'art'
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-background pb-12">
        {/* Back Button */}
        <div className="px-8 xl:px-12 pt-6 pb-4">
          <div className="max-w-7xl mx-auto">
            <BackButton onClick={onBack} />
          </div>
        </div>

        {/* Main Content - 2 Column Layout */}
        <div className="px-8 xl:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              {/* Title with emoji and admin menu */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h1 className="text-4xl flex-1">{event.title} 🎉✨</h1>
                  {isOwner && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2">
                          <MoreVertical className="w-4 h-4" />
                          <span className="text-sm font-medium">관리</span>
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={onEditEvent} className="cursor-pointer">
                          <Edit className="w-4 h-4 mr-3 text-primary" />
                          <span>이벤트 수정</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onManageAttendees} className="cursor-pointer">
                          <UserCog className="w-4 h-4 mr-3 text-primary" />
                          <span>참가자 관리</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={onDeleteEvent} className="cursor-pointer text-destructive focus:text-destructive">
                          <Trash2 className="w-4 h-4 mr-3" />
                          <span>이벤트 삭제</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                
                {/* Hosted By */}
                <div>
                  <button
                    onClick={() => hostData?.id && onHostClick(hostData.id)}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="w-10 h-10">
                      {hostData?.avatarUrl ? (
                        <img
                          src={hostData.avatarUrl}
                          alt={hostData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {hostData?.name
                            ? hostData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
                            : event.hostName?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'H'}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Hosted by</p>
                      <div className="flex items-center gap-1.5">
                        <p>{hostData?.name || event.hostName || 'Unknown'}</p>
                        {hostData?.isVerified && (
                          <CheckCircle2 className="w-4 h-4 text-primary fill-primary" />
                        )}
                      </div>
                    </div>
                  </button>

                  {/* Host About Me */}
                  {hostData?.bio && (
                    <div className="mt-3 ml-[52px]">
                      <p className="text-sm text-muted-foreground">
                        {hostData.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Meet the Group - Only show if event has a group */}
              {event.groupId && groupData && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <p className="text-sm text-muted-foreground mb-4">Meet the group</p>
                  <button
                    onClick={() => router.push(`/groups/${groupData.id}`)}
                    className="flex items-start gap-4 w-full text-left hover:opacity-80 transition-opacity"
                  >
                    {/* Group Logo/Icon */}
                    <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {groupData.image ? (
                        <img
                          src={groupData.image}
                          alt={groupData.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">Group</span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="mb-2">{groupData.name}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xl">{groupData.rating?.toFixed(1) || '0.0'}</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= Math.round(groupData.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{groupData.members} members</span>
                      </div>
                    </div>
                  </button>
                </div>
              )}

              {/* Tabs - Sticky */}
              <div className="sticky top-0 z-10 bg-background border-b border-border">
                <div className="flex items-center gap-1">
                  {[
                    { id: 'about', icon: '📝', label: 'About' },
                    { id: 'photos', icon: '📸', label: 'Photos' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id as 'about' | 'photos')}
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
                  {/* Details */}
                  <div>
                    <h2 className="mb-4">Details</h2>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">
                          ✅ The meet-up will be held on the 5th floor ❗
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">
                          ✅ Korean Address: 서울특별시 마포구 와우산로 65, 5층
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-muted-foreground">
                          ✅ English Address: 65, Wausan-ro, Mapo-gu, Seoul, Republic of Korea (5F)
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <h2 className="mb-4">About this event</h2>
                    <div className="prose prose-sm max-w-none text-muted-foreground space-y-4">
                      <p>
                        주말 아침을 여유롭게 시작해보세요! 강남역 근처의 아늑한 카페에서
                        브런치를 즐기며 다양한 국적의 친구들과 이야기를 나눠요.
                      </p>
                      <p>
                        한국 생활, 여행, 취미 등 다양한 주제로 편하게 대화하실 수 있어요.
                        한국어 학습에 관심 있으신 분들도 환영합니다!
                      </p>
                    </div>
                  </div>

                  {/* Map */}
                  <div>
                    <h2 className="mb-4">위치</h2>
                    <EventMap location={event.streetAddress || ''} />
                  </div>
                </div>
              )}

              {activeTab === 'photos' && (
                <div ref={photosRef}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h2>Photos</h2>
                      <span className="text-muted-foreground">{photos.length}</span>
                    </div>
                    {photos.length > 6 && (
                      <button
                        onClick={() => {
                          setGalleryStartIndex(0);
                          setIsGalleryOpen(true);
                        }}
                        className="text-sm text-primary hover:underline"
                      >
                        See all photos
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {photos.slice(0, 6).map((photo: any, idx: number) => (
                      <button
                        key={photo.id || idx}
                        onClick={() => {
                          setGalleryStartIndex(idx);
                          setIsGalleryOpen(true);
                        }}
                        className="relative aspect-square rounded-xl overflow-hidden bg-muted"
                      >
                        <img
                          src={photo.url}
                          alt={photo.caption || `Past event ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {idx === 5 && photos.length > 6 && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <p className="text-white text-2xl">+{photos.length - 6}</p>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* See More Events from Group - Only show if event has a group */}
              {event.groupId && groupData && (
                <div>
                  <button
                    onClick={() => router.push(`/groups/${groupData.id}`)}
                    className="w-full bg-muted/30 hover:bg-muted/50 border border-border rounded-2xl p-5 flex items-center justify-between transition-colors group"
                  >
                    <span className="text-sm">
                      See more events by {groupData.name}
                    </span>
                    <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Recommended Events Slider - Desktop */}
              <div className="mt-12 relative">
                <h2 className="mb-6">추천 이벤트</h2>
                <div className="relative px-8">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: false,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2">
                      {recommendedEvents.map((e) => (
                        <CarouselItem key={e.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
                          <EventCard
                            id={e.id}
                            title={e.title}
                            date={e.date}
                            time={e.time}
                            location={e.location}
                            attendees={e.attendees}
                            maxAttendees={e.maxAttendees}
                            image={e.image}
                            category={e.category}
                            onClick={handleEventCardClick}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-4" />
                    <CarouselNext className="-right-4" />
                  </Carousel>
                </div>
              </div>

              {/* Recently Viewed Events Slider - Desktop */}
              <div className="mt-12 relative pb-12">
                <h2 className="mb-6">최근 본 이벤트</h2>
                <div className="relative px-8">
                  <Carousel
                    opts={{
                      align: "start",
                      loop: false,
                    }}
                    className="w-full"
                  >
                    <CarouselContent className="-ml-2">
                      {recentlyViewedEvents.map((e) => (
                        <CarouselItem key={e.id} className="pl-2 md:basis-1/2 lg:basis-1/3">
                          <EventCard
                            id={e.id}
                            title={e.title}
                            date={e.date}
                            time={e.time}
                            location={e.location}
                            attendees={e.attendees}
                            maxAttendees={e.maxAttendees}
                            image={e.image}
                            category={e.category}
                            onClick={handleEventCardClick}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-4" />
                    <CarouselNext className="-right-4" />
                  </Carousel>
                </div>
              </div>
            </div>

            {/* Right Column - Sticky */}
            <div className="lg:sticky lg:top-6 lg:self-start space-y-4">
              {/* Event Image */}
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Event Info Card */}
              <div className="bg-card border border-border rounded-xl p-4 space-y-3">
                {/* Attendees Count */}
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Users className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Attendees</p>
                    <p className="text-sm font-semibold">
                      {event.attendees} / {event.maxAttendees} people
                    </p>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Date & Time</p>
                      <p className="text-sm">{event.date}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Location</p>
                      <p className="text-sm">{event.streetAddress}</p>
                    </div>
                  </div>

                  {event.groupId && (
                    <div className="flex items-start gap-2">
                      <Users className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Event Type</p>
                        <p className="text-sm">Group Event</p>
                      </div>
                    </div>
                  )}

                  {!event.groupId && event.hostName && (
                    <div className="flex items-start gap-2">
                      <User className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Event Type</p>
                        <p className="text-sm">Personal Event by {event.hostName}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Group/Host Info */}
                {event.groupId && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs mb-1">Group Event</p>
                    <p className="text-[10px] text-muted-foreground">
                      Public group · Hosted by community
                    </p>
                  </div>
                )}

                {!event.groupId && event.hostName && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-xs mb-1">Personal Event</p>
                    <p className="text-[10px] text-muted-foreground">
                      Hosted by {event.hostName}
                    </p>
                  </div>
                )}
              </div>

              {/* Attendees Section */}
              <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold">Attendees ({attendees.length})</h3>
                  <button
                    onClick={() => setIsAttendeesModalOpen(true)}
                    className="text-xs text-primary hover:underline"
                  >
                    See all
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {attendees.slice(0, 8).map((attendee: any, idx: number) => {
                    const getAvatarColor = (index: number) => {
                      const colors = ['bg-pink-200', 'bg-purple-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200'];
                      return colors[index % colors.length];
                    };
                    const getInitial = (name: string) => name.charAt(0).toUpperCase();

                    return (
                      <div key={attendee.id || idx} className="relative group">
                        <div className={`w-10 h-10 rounded-full ${getAvatarColor(idx)} flex items-center justify-center`}>
                          <span className="text-sm font-medium">{getInitial(attendee.name)}</span>
                        </div>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                          {attendee.name}
                        </div>
                      </div>
                    );
                  })}
                  {attendees.length > 8 && (
                    <button
                      onClick={() => setIsAttendeesModalOpen(true)}
                      className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium text-xs hover:scale-110 transition-transform"
                    >
                      +{attendees.length - 8}
                    </button>
                  )}
                </div>
              </div>

                {/* Join Button */}
                <Button
                  className={`w-full h-10 text-sm ${
                    event.attendees >= event.maxAttendees
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                  disabled={event.attendees >= event.maxAttendees}
                >
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees >= event.maxAttendees ? 'Event Full' : 'Attend'}
                </Button>


              {/* Share, Save and Report */}
              <div className="flex gap-2">
                <button
                  className="flex-1 px-3 py-2 bg-muted rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
                  onClick={() =>
                    openShareDialog({
                      title: '이벤트 공유하기',
                      description: '이벤트를 친구들과 공유하세요.',
                      shareText: event?.title || '',
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

      {/* Photo Gallery Modal */}
      <PhotoGallery
        photos={photos.map((p: any) => p.url)}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={galleryStartIndex}
      />

      {/* Attendees Modal */}
      <MembersModal
        isOpen={isAttendeesModalOpen}
        onClose={() => setIsAttendeesModalOpen(false)}
        members={attendees.map(attendee => ({
          id: attendee.id || attendee.name,
          name: attendee.name,
          avatarUrl: attendee.avatarUrl,
          status: attendee.status
        }))}
        title="Event Attendees"
        onMemberClick={onHostClick}
      />

      {/* Share Dialog */}
      <ShareDialog />
    </>
  );
}
