import { events } from '@/data/events';
import { HostCard } from '@/shared/components/HostCard';
import { InfoCard } from '@/shared/components/InfoCard';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { Calendar, CheckCircle2, Edit, Flag, Heart, MapPin, MoreVertical, Share2, Star, Trash2, User, UserCog, Users } from 'lucide-react';
import { useRef, useState } from 'react';
import { EventMap } from './EventMap';
import { PhotoGallery } from './PhotoGallery';

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
  const [selectedDate, setSelectedDate] = useState(0);
  const [activeTab, setActiveTab] = useState<'about' | 'photos' | 'attendees'>('about');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  
  // Refs for scroll-to-section
  const aboutRef = useRef<HTMLDivElement>(null);
  const photosRef = useRef<HTMLDivElement>(null);
  const attendeesRef = useRef<HTMLDivElement>(null);

  const handleTabClick = (tab: 'about' | 'photos' | 'attendees') => {
    setActiveTab(tab);
    
    // Scroll to the corresponding section after state update
    setTimeout(() => {
      const refs = {
        about: aboutRef,
        photos: photosRef,
        attendees: attendeesRef
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
  
  // Find the selected event
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    return <div>Event not found</div>;
  }

  const attendees = [
    { name: 'Sarah', avatar: '', country: '🇺🇸', joined: '2개월 전' },
    { name: 'Emma', avatar: '', country: '🇬🇧', joined: '5개월 전' },
    { name: 'Maria', avatar: '', country: '🇪🇸', joined: '1개월 전' },
    { name: 'Lisa', avatar: '', country: '🇩🇪', joined: '3개월 전' },
    { name: 'Anna', avatar: '', country: '🇫🇷', joined: '4개월 전' },
    { name: 'Sophie', avatar: '', country: '🇨🇦', joined: '6개월 전' },
  ];

  const eventPhotos = [
    'https://images.unsplash.com/photo-1623121181613-eeced17aea39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwbWVldGluZyUyMGNhZmV8ZW58MXx8fHwxNzYxMDU4ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1730875648117-ff32ae9b98c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NpYWwlMjBnYXRoZXJpbmclMjBwZW9wbGV8ZW58MXx8fHwxNzYxMDU4ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1714761131527-accab693e96e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGRpbm5lciUyMGZyaWVuZHN8ZW58MXx8fHwxNzYxMDU4ODQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1573860838444-ae841678963d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZW9wbGUlMjB0YWxraW5nJTIwcmVzdGF1cmFudHxlbnwxfHx8fDE3NjEwNTg4NTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1598908314766-3e3ce9bd2f48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtZWV0dXAlMjBmcmllbmRzfGVufDF8fHx8MTc2MTAxMzA4NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1635367474298-5b8cd525f2b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvdXRkb29yJTIwZXZlbnQlMjBwZW9wbGV8ZW58MXx8fHwxNzYxMDAwMzY1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    'https://images.unsplash.com/photo-1543603819-cb2d1c267265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtZWV0aW5nJTIwZnJpZW5kc3xlbnwxfHx8fDE3NjA1MzEzMTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
    'https://images.unsplash.com/photo-1671576193244-964fe85e1797?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMHBlb3BsZSUyMG1lZXR1cHxlbnwxfHx8fDE3NjA1MzE1NTR8MA&ixlib=rb-4.1.0&q=80&w=1080',
  ];

  // Mock recurring dates
  const upcomingDates = [
    { date: 'Oct 25', time: '8 PM GMT-9', label: 'Oct 25 @ 8 PM GMT-9' },
    { date: 'Nov 1', time: '8 PM GMT-9', label: 'Nov 1 @ 8 PM GMT-9' },
    { date: 'Nov 8', time: '8 PM GMT-9', label: 'Nov 8 @ 8 PM GMT-9' },
  ];

  // Mobile Layout
  const MobileView = () => (
    <div className="flex flex-col h-full bg-background overflow-y-auto overscroll-contain">
      {/* Header Image */}
      <div className="relative h-72">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-border/50"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                  <MoreVertical className="w-5 h-5" />
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
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-border/50">
            <Share2 className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg border border-border/50">
            <Heart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="px-4 py-5 space-y-6">
          {/* Title & Info */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-accent text-primary border-0">
                {event.category}
              </Badge>
              <span className="text-sm text-muted-foreground">· {event.date}</span>
              {event.isHot && (
                <Badge variant="secondary" className="bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border-orange-200 border">
                  🔥 인기
                </Badge>
              )}
              {event.isNew && (
                <Badge variant="secondary" className="bg-accent-rose/30 text-accent-rose-dark">
                  ✨ 신규
                </Badge>
              )}
            </div>
            <h1 className="mb-3 text-2xl">{event.title}</h1>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3">
            <InfoCard
              icon={Calendar}
              label="날짜 및 시간"
              value={
                <>
                  <p>{event.date}</p>
                  <p>{event.time}</p>
                </>
              }
            />
            
            <InfoCard
              icon={Users}
              label="참가자"
              value={
                <>
                  <p className="font-semibold">{event.attendees} / {event.maxAttendees} 명</p>
                  <p className="text-sm text-muted-foreground">
                    {event.maxAttendees - event.attendees > 0 
                      ? `${event.maxAttendees - event.attendees} spots left`
                      : 'Full'}
                  </p>
                </>
              }
            />
            
            <InfoCard
              icon={MapPin}
              label="장소"
              value={event.location}
              subValue="정확한 주소는 참가 신청 후 공개됩니다"
              className="col-span-2"
            />

            {event.type === 'personal' && event.hostName && (
              <div className="col-span-2 p-3 bg-accent/30 rounded-lg border border-accent-sage/30">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  <p className="text-sm">
                    <span className="text-muted-foreground">Personal Event by </span>
                    <span className="font-medium">{event.hostName}</span>
                  </p>
                </div>
              </div>
            )}

            {event.type === 'group' && event.groupId && (
              <div className="col-span-2 p-3 bg-accent/30 rounded-lg border border-accent-sage/30">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <p className="text-sm">
                    <span className="text-muted-foreground">Group Event</span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Map */}
          <div>
            <h3 className="mb-3">위치</h3>
            <EventMap location={event.location} />
          </div>

          {/* Host */}
          <div>
            <h3 className="mb-3">호스트</h3>
            <HostCard
              name={event.type === 'personal' && event.hostName ? event.hostName : "Jiyoung Park"}
              country="🇰🇷"
              rating={4.9}
              reviewCount={23}
              bio={event.type === 'personal' 
                ? "안녕하세요! 새로운 친구들과 함께 즐거운 시간을 보내고 싶어요 😊" 
                : "안녕하세요! 서울에서 3년째 살고 있는 지영입니다. 다양한 나라에서 온 친구들과 함께 즐거운 시간을 보내는 걸 좋아해요."}
              stats={[
                { label: '주최한 이벤트', value: '25회' },
                { label: '총 참여자', value: '150명' },
                { label: '활동 기간', value: '2년' },
              ]}
              onClick={onHostClick}
              isVerified={true}
            />
          </div>

          {/* Photos from past events */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3>지난 모임 사진 ({eventPhotos.length})</h3>
              {eventPhotos.length > 6 && (
                <button 
                  onClick={() => {
                    setGalleryStartIndex(0);
                    setIsGalleryOpen(true);
                  }}
                  className="text-sm text-primary"
                >
                  전체보기
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {eventPhotos.slice(0, 6).map((photo, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setGalleryStartIndex(idx);
                    setIsGalleryOpen(true);
                  }}
                  className="relative aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={photo}
                    alt={`Past event ${idx + 1}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {idx === 5 && eventPhotos.length > 6 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <p className="text-white text-xl">+{eventPhotos.length - 6}</p>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Attendees */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3>참가자 ({attendees.length}명)</h3>
              <button className="text-sm text-primary">전체보기</button>
            </div>
            <div className="space-y-2">
              {attendees.slice(0, 4).map((attendee, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                      {attendee.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">{attendee.name} {attendee.country}</p>
                    <p className="text-xs text-muted-foreground">fitkle 가입 {attendee.joined}</p>
                  </div>
                </div>
              ))}
              {attendees.length > 4 && (
                <button className="w-full p-3 text-sm text-primary bg-muted rounded-lg hover:bg-secondary transition-colors">
                  +{attendees.length - 4}명 더보기
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="mb-3">상세정보</h3>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>
                주말 아침을 여유롭게 시작해보세요! 강남역 근처의 아늑한 카페에서 
                브런치를 즐기며 다양한 국적의 친구들과 이야기를 나눠요.
              </p>
              <p>
                한국 생활, 여행, 취미 등 다양한 주제로 편하게 대화하실 수 있어요. 
                한국어 학습에 관심 있으신 분들도 환영합니다!
              </p>
              <p className="mt-4">
                <strong className="text-foreground">준비사항</strong><br />
                • 특별히 준비할 것은 없어요<br />
                • 편안한 복장으로 오시면 됩니다
              </p>
              <p className="mt-4">
                <strong className="text-foreground">참가비</strong><br />
                무료 (각자 주문한 음식값 개별 부담)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Join Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-safe bg-white border-t border-border/50 z-10">
        <Button 
          className={`w-full h-12 ${
            event.attendees >= event.maxAttendees 
              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
          disabled={event.attendees >= event.maxAttendees}
        >
          <Users className="w-5 h-5 mr-2" />
          {event.attendees >= event.maxAttendees 
            ? `모집 마감 (${event.attendees}/${event.maxAttendees})`
            : `참가 신청 (${event.attendees}/${event.maxAttendees})`
          }
        </Button>
      </div>
    </div>
  );

  // Desktop Layout - Meetup Style with Tabs
  const DesktopView = () => (
    <div className="min-h-screen bg-background pb-12">
      {/* Main Content - 2 Column Layout */}
      <div className="max-w-[1600px] mx-auto px-8 lg:px-24 xl:px-32 2xl:px-40">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_480px] gap-8 xl:gap-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_480px] gap-8 xl:gap-12">
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
                    onClick={onHostClick}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {(event.type === 'personal' && event.hostName 
                          ? event.hostName.split(' ').map(n => n[0]).join('').toUpperCase()
                          : 'JY')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">Hosted by</p>
                      <div className="flex items-center gap-1.5">
                        <p>{event.type === 'personal' && event.hostName ? event.hostName : 'Becky'}</p>
                        <CheckCircle2 className="w-4 h-4 text-primary fill-primary" />
                      </div>
                    </div>
                  </button>
                  
                  {/* Host About Me */}
                  <div className="mt-3 ml-[52px]">
                    <p className="text-sm text-muted-foreground">
                      {event.type === 'personal' 
                        ? "안녕하세요! 새로운 친구들과 함께 즐거운 시간을 보내고 싶어요 😊" 
                        : "안녕하세요! 서울에서 3년째 살고 있는 지영입니다. 다양한 나라에서 온 친구들과 함께 즐거운 시간을 보내는 걸 좋아해요."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Meet the Group - Only show if event has a group */}
              {event.groupId && (
                <div className="bg-card border border-border rounded-2xl p-6">
                  <p className="text-sm text-muted-foreground mb-4">Meet the group</p>
                  <div className="flex items-start gap-4">
                    {/* Group Logo/Icon */}
                    <div className="w-16 h-16 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">Group</span>
                      <div className="absolute -top-1 -right-1 text-xs">
                        <span className="text-sm">example</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-2">🎊 2030 global student party in Hongdae 🎊</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-xl">4.3</span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-300 text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">16 reviews</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tabs - Sticky */}
              <div className="sticky top-0 z-10 bg-background border-b border-border">
                <div className="flex items-center gap-1">
                  {[
                    { id: 'about', icon: '📝', label: 'About' },
                    { id: 'photos', icon: '📸', label: 'Photos' },
                    { id: 'attendees', icon: '👥', label: 'Attendees' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id as any)}
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

              {/* About Tab Content */}
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
                  <EventMap location={event.location} />
                </div>
              </div>

              {/* Photos Tab Content */}
              <div ref={photosRef}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2>Photos</h2>
                    <span className="text-muted-foreground">{eventPhotos.length}</span>
                  </div>
                  {eventPhotos.length > 6 && (
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
                  {eventPhotos.slice(0, 6).map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setGalleryStartIndex(idx);
                        setIsGalleryOpen(true);
                      }}
                      className="relative aspect-square rounded-xl overflow-hidden bg-muted"
                    >
                      <img
                        src={photo}
                        alt={`Past event ${idx + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      {idx === 5 && eventPhotos.length > 6 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <p className="text-white text-2xl">+{eventPhotos.length - 6}</p>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Attendees Tab Content */}
              <div ref={attendeesRef}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <h2>Attendees</h2>
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                      <span className="text-sm">{attendees.length + 25}</span>
                    </div>
                  </div>
                  <button className="text-sm text-primary hover:underline">See all</button>
                </div>
                
                <div className="bg-card border border-border rounded-2xl p-6">
                  <div className="flex items-start gap-6">
                    {/* Organizer */}
                    <button 
                      onClick={onHostClick}
                      className="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            {(event.type === 'personal' && event.hostName 
                              ? event.hostName.split(' ').map(n => n[0]).join('').toUpperCase()
                              : 'JY')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-background">
                          <Star className="w-4 h-4 fill-white text-white" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <p className="text-sm">{event.type === 'personal' && event.hostName ? event.hostName : 'Becky'}</p>
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary fill-primary" />
                        </div>
                        <p className="text-xs text-muted-foreground">Organizer</p>
                      </div>
                    </button>

                    {/* Members */}
                    {attendees.slice(0, 2).map((attendee, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <Avatar className="w-20 h-20">
                          <AvatarFallback className="bg-secondary text-secondary-foreground">
                            {attendee.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-center">
                          <p className="text-sm">{attendee.name}</p>
                          <p className="text-xs text-muted-foreground">Member</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 justify-center">
                            <User className="w-3 h-3" />
                            5 guests
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* More avatars */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="flex -space-x-3">
                        {['K', '김', 'S', '+25'].map((initial, idx) => (
                          <div
                            key={idx}
                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 border-background ${
                              idx === 0 ? 'bg-purple-200' :
                              idx === 1 ? 'bg-orange-200' :
                              idx === 2 ? 'bg-yellow-200' :
                              'bg-rose-400 text-white'
                            }`}
                          >
                            <span className="text-sm">{initial}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-sm mt-2">+28 more</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* See More Events from Group - Only show if event has a group */}
              {event.groupId && (
                <div>
                  <button className="w-full bg-muted/30 hover:bg-muted/50 border border-border rounded-2xl p-5 flex items-center justify-between transition-colors group">
                    <span className="text-sm">
                      See more events by 🎊 2030 global student party in Hongdae 🎊
                    </span>
                    <svg className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

            </div>

            {/* Right Column - Sticky */}
            <div className="lg:sticky lg:top-6 lg:self-start space-y-6">
              {/* Event Image */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Date Selection Pills */}
              <div className="flex flex-wrap gap-2">
                {upcomingDates.map((dateOption, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDate(idx)}
                    className={`px-4 py-2 rounded-full transition-all ${
                      selectedDate === idx
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-secondary'
                    }`}
                  >
                    {dateOption.label}
                  </button>
                ))}
              </div>

              {/* Event Info Card */}
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                {/* Attendees Count */}
                <div className="flex items-center gap-3 pb-3 border-b border-border">
                  <Users className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Attendees</p>
                    <p className="font-semibold">
                      {event.attendees} / {event.maxAttendees} people
                    </p>
                  </div>
                  <div className="flex -space-x-2">
                    {[...Array(Math.min(3, event.attendees))].map((_, i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary/20 border-2 border-background flex items-center justify-center">
                        <span className="text-xs font-medium">{String.fromCharCode(65 + i)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date and Time */}
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Date & Time</p>
                      <p>{event.date}</p>
                      <p className="text-sm text-muted-foreground mt-0.5">{event.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Location</p>
                      <p>{event.location}</p>
                    </div>
                  </div>

                  {event.type === 'group' && event.groupId && (
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Event Type</p>
                        <p>Group Event</p>
                      </div>
                    </div>
                  )}

                  {event.type === 'personal' && event.hostName && (
                    <div className="flex items-start gap-3">
                      <User className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Event Type</p>
                        <p>Personal Event by {event.hostName}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Join Button */}
                <Button 
                  className={`w-full h-12 ${
                    event.attendees >= event.maxAttendees 
                      ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary/90 text-primary-foreground'
                  }`}
                  disabled={event.attendees >= event.maxAttendees}
                >
                  <Users className="w-5 h-5 mr-2" />
                  {event.attendees >= event.maxAttendees ? 'Event Full' : 'Attend'}
                </Button>

                {/* Group/Host Info */}
                {event.type === 'group' && event.groupId && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm mb-2">Group Event</p>
                    <p className="text-xs text-muted-foreground">
                      Public group · Hosted by community
                    </p>
                  </div>
                )}

                {event.type === 'personal' && event.hostName && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm mb-2">Personal Event</p>
                    <p className="text-xs text-muted-foreground">
                      Hosted by {event.hostName}
                    </p>
                  </div>
                )}
              </div>

              {/* Share, Save and Report */}
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-3 bg-muted rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                  <Share2 className="w-4 h-4" />
                  <span className="text-sm">Share</span>
                </button>
                <button className="flex-1 px-4 py-3 bg-muted rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span className="text-sm">Save</span>
                </button>
                <button className="flex-1 px-4 py-3 bg-muted rounded-lg hover:bg-secondary transition-colors flex items-center justify-center gap-2">
                  <Flag className="w-4 h-4" />
                  <span className="text-sm">Report</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile View */}
      <div className="lg:hidden">
        <MobileView />
      </div>

      {/* Desktop View */}
      <div className="hidden lg:block">
        <DesktopView />
      </div>

      {/* Photo Gallery Modal */}
      <PhotoGallery
        photos={eventPhotos}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={galleryStartIndex}
      />
    </>
  );
}
