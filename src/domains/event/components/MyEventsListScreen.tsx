'use client';

import { Calendar, Clock, MapPin, Star, Heart, UserPlus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useState, useEffect } from 'react';
import { useMyEvents } from '../hooks/useMyEvents';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import type { Event } from '../types/event';

interface MyEventsListScreenProps {
  onBack: () => void;
  onEventClick: (eventId: string, isOwner?: boolean) => void;
  initialFilter?: 'created' | 'joined' | 'saved';
}

export function MyEventsListScreen({ onBack: _onBack, onEventClick, initialFilter = 'created' }: MyEventsListScreenProps) {
  const [activeTab, setActiveTab] = useState<'created' | 'joined' | 'saved'>(initialFilter);

  // initialFilter가 변경되면 activeTab도 업데이트 (URL 변경 시)
  useEffect(() => {
    setActiveTab(initialFilter);
  }, [initialFilter]);

  // 인증 체크
  const { user, isAuthenticated, isLoading: authLoading } = useAuthUtils();

  // 내 이벤트 조회 (참여한 이벤트 + 생성한 이벤트)
  const { data: myEvents = [], isLoading: eventsLoading } = useMyEvents({
    enabled: isAuthenticated, // 인증된 경우에만 실행
  });

  // 탭별 필터링
  const hostedEvents = myEvents.filter(e => e.hostId === user?.id);
  const joinedEvents = myEvents.filter(e => e.hostId !== user?.id);
  const savedEvents: Event[] = []; // TODO: 찜 기능 구현 필요

  // 통계 데이터 (실제 값으로 계산)
  const stats = [
    {
      icon: Calendar,
      label: 'Total Events',
      value: myEvents.length.toString(),
      color: 'bg-gradient-to-br from-primary to-primary/80',
      iconBg: 'bg-primary/20',
    },
    {
      icon: UserPlus,
      label: 'Hosted Events',
      value: hostedEvents.length.toString(),
      color: 'bg-gradient-to-br from-accent-sage to-accent-sage/80',
      iconBg: 'bg-accent-sage/20',
    },
    {
      icon: Heart,
      label: 'Joined Events',
      value: joinedEvents.length.toString(),
      color: 'bg-gradient-to-br from-accent-rose to-accent-rose/80',
      iconBg: 'bg-accent-rose/20',
    },
  ];

  // 로딩 상태
  const isLoading = authLoading || eventsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">이벤트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 비인증 상태 처리
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center px-6">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto">
            <Calendar className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl mb-2">로그인이 필요합니다</h3>
          <p className="text-sm text-muted-foreground mb-6">
            내 이벤트를 확인하려면 로그인해주세요
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity"
          >
            홈으로 가기
          </button>
        </div>
      </div>
    );
  }

  const EventCard = ({ event, isOwner = false }: { event: Event, isOwner?: boolean }) => (
    <button
      onClick={() => onEventClick(event.id, isOwner)}
      className="w-full bg-card rounded-2xl overflow-hidden border border-border/50 hover:border-primary/40 hover:shadow-lg transition-all duration-300 text-left group"
    >
      {/* Image */}
      <div className="relative w-full h-40 lg:h-44 overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {event.attendees >= event.maxAttendees - 5 && (
          <div className="absolute top-3 right-3 px-2.5 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs rounded-full shadow-lg">
            마감임박
          </div>
        )}
        
        {/* Participants Avatars */}
        {event.attendees > 0 && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-full shadow-lg">
            <div className="flex items-center -space-x-1.5">
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
                    className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-sm"
                    style={{
                      background: `linear-gradient(135deg, ${colorStart}, ${colorEnd})`
                    }}
                  >
                    <span className="text-[9px] text-white font-semibold">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                );
              })}
            </div>
            <span className="text-xs text-foreground font-medium">
              {event.attendees > 3 && '+'}{event.attendees > 3 ? event.attendees - 3 : event.attendees}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        {/* Title */}
        <h3 className="text-sm mb-2.5 line-clamp-2 leading-snug">{event.title}</h3>

        {/* Date & Time */}
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span>{event.date}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span>{event.time}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2.5 border-t border-border/30">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
            <span className="text-xs text-muted-foreground truncate">{event.streetAddress}</span>
          </div>
          <div className="flex items-center gap-1 ml-2">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-foreground font-medium">{(event.rating || 4.5).toFixed(1)}</span>
          </div>
        </div>
      </div>
    </button>
  );

  return (
    <div className="flex flex-col min-h-full bg-background">
      {/* Header */}
      <div className="bg-white">
        <div className="px-8 lg:px-24 xl:px-32 2xl:px-40 py-5 max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl mb-1">My Events</h1>
              <p className="text-sm text-muted-foreground">
                Track your event journey and connections
              </p>
            </div>
          </div>

          {/* Stats Cards - Desktop Compact */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3.5 rounded-xl border border-border/50 bg-card/50"
                >
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">{stat.label}</p>
                    <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs & Events List */}
      <div className="flex-1">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'created' | 'joined' | 'saved')}>
          {/* Tabs */}
          <div className="bg-background">
            <div className="px-8 lg:px-24 xl:px-32 2xl:px-40 max-w-[1600px] mx-auto">
              <TabsList className="bg-transparent border-0 p-0 h-auto">
                <TabsTrigger
                  value="created"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  내가 만든 이벤트 ({hostedEvents.length})
                </TabsTrigger>
                <TabsTrigger
                  value="joined"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  참여한 이벤트 ({joinedEvents.length})
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  찜한 이벤트 ({savedEvents.length})
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <TabsContent value="created" className="mt-0 px-8 lg:px-24 xl:px-32 2xl:px-40 py-6 pb-6">
            <div className="max-w-[1600px] mx-auto">
              {hostedEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {hostedEvents.map((event: Event) => (
                    <EventCard key={event.id} event={event} isOwner={true} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="mb-2">만든 이벤트가 없습니다</h3>
                  <p className="text-sm text-muted-foreground">
                    새로운 이벤트를 만들어보세요
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="joined" className="mt-0 px-8 lg:px-24 xl:px-32 2xl:px-40 py-6 pb-6">
            <div className="max-w-[1600px] mx-auto">
              {joinedEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {joinedEvents.map((event: Event) => (
                    <EventCard key={event.id} event={event} isOwner={false} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <UserPlus className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="mb-2">참여한 이벤트가 없습니다</h3>
                  <p className="text-sm text-muted-foreground">
                    이벤트를 탐색하고 참여해보세요
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="saved" className="mt-0 px-8 lg:px-24 xl:px-32 2xl:px-40 py-6 pb-6">
            <div className="max-w-[1600px] mx-auto">
              {savedEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {savedEvents.map((event: Event) => (
                    <EventCard key={event.id} event={event} isOwner={false} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="mb-2">찜한 이벤트가 없습니다</h3>
                  <p className="text-sm text-muted-foreground">
                    관심있는 이벤트를 저장해보세요
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
