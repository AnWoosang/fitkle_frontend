'use client';

import { Calendar, Clock, MapPin, Star, Heart, UserPlus } from 'lucide-react';
import { BackButton } from '@/shared/components/BackButton';
import { events } from '@/data/events';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { useState } from 'react';

interface MyEventsListScreenProps {
  onBack: () => void;
  onEventClick: (eventId: string, isOwner?: boolean) => void;
  initialFilter?: 'created' | 'joined' | 'saved';
}

export function MyEventsListScreen({ onBack, onEventClick, initialFilter = 'created' }: MyEventsListScreenProps) {
  const [activeTab, setActiveTab] = useState<'created' | 'joined' | 'saved'>(initialFilter);

  // Mock data - 실제로는 사용자가 참여한 이벤트만 필터링
  const upcomingEvents = events.slice(0, 8);
  const pastEvents = events.slice(8, 16);

  const stats = [
    {
      icon: Calendar,
      label: 'Total Events',
      value: '24',
      color: 'bg-gradient-to-br from-primary to-primary/80',
      iconBg: 'bg-primary/20',
    },
    {
      icon: UserPlus,
      label: 'Friends Made',
      value: '42',
      color: 'bg-gradient-to-br from-accent-sage to-accent-sage/80',
      iconBg: 'bg-accent-sage/20',
    },
    {
      icon: Heart,
      label: 'Favorite Events',
      value: '8',
      color: 'bg-gradient-to-br from-accent-rose to-accent-rose/80',
      iconBg: 'bg-accent-rose/20',
    },
  ];

  const EventCard = ({ event, isOwner = false }: { event: typeof events[0], isOwner?: boolean }) => (
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
            <span className="text-xs text-muted-foreground truncate">{event.location}</span>
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
      {/* Mobile Header */}
      <div className="lg:hidden bg-gradient-to-b from-background via-background to-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          <BackButton onClick={onBack} />
          <div className="flex-1">
            <h1 className="text-xl">My Events</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Your event journey
            </p>
          </div>
        </div>

        {/* Stats Cards - Mobile */}
        <div className="px-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-2xl p-3 border border-border/50 bg-card"
                >
                  <div className={`w-9 h-9 rounded-xl ${stat.iconBg} flex items-center justify-center mb-2`}>
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-xs text-muted-foreground mb-0.5 leading-tight">{stat.label}</p>
                  <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block bg-white">
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
          {/* Mobile Tabs */}
          <div className="lg:hidden px-4 pt-2">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="created" className="rounded-xl text-xs">
                내가 만든
              </TabsTrigger>
              <TabsTrigger value="joined" className="rounded-xl text-xs">
                참여한
              </TabsTrigger>
              <TabsTrigger value="saved" className="rounded-xl text-xs">
                찜한
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden lg:block bg-background">
            <div className="px-8 lg:px-24 xl:px-32 2xl:px-40 max-w-[1600px] mx-auto">
              <TabsList className="bg-transparent border-0 p-0 h-auto">
                <TabsTrigger 
                  value="created" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  내가 만든 이벤트 ({upcomingEvents.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="joined"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  참여한 이벤트 ({pastEvents.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="saved"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-6 py-3"
                >
                  찜한 이벤트 (5)
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
          
          <TabsContent value="created" className="mt-0 px-4 lg:px-24 xl:px-32 2xl:px-40 py-4 lg:py-6 pb-24 lg:pb-6">
            <div className="max-w-[1600px] mx-auto">
              {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {upcomingEvents.map((event) => (
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
          
          <TabsContent value="joined" className="mt-0 px-4 lg:px-24 xl:px-32 2xl:px-40 py-4 lg:py-6 pb-24 lg:pb-6">
            <div className="max-w-[1600px] mx-auto">
              {pastEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {pastEvents.map((event) => (
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

          <TabsContent value="saved" className="mt-0 px-4 lg:px-24 xl:px-32 2xl:px-40 py-4 lg:py-6 pb-24 lg:pb-6">
            <div className="max-w-[1600px] mx-auto">
              {events.slice(0, 5).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {events.slice(0, 5).map((event) => (
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
