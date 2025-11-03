"use client";

import { Calendar, Users, TrendingUp, Zap, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Button } from '@/shared/components/ui/button';
import { newsPosts } from '@/data/news';
import { AppLogo } from '@/shared/components/AppLogo';

interface HomeScreenProps {
  onEventClick: (eventId: string) => void;
  onGroupClick: (groupId: string) => void;
  onExploreGroupsClick: () => void;
  onNewsClick: (newsId: string) => void;
  onMyEventsClick: () => void;
}

export function HomeScreen({
  onEventClick,
  onGroupClick,
  onExploreGroupsClick,
  onNewsClick,
  onMyEventsClick
}: HomeScreenProps) {
  const t = useTranslations('home');
  const tCommon = useTranslations('common');

  // Mock upcoming events (user's RSVPed events)
  const upcomingEvents = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Oct 21',
      time: '1:00 PM',
      title: 'Café Flow – gentle accountability',
      location: 'Gangnam',
      attendees: 2,
      status: 'confirmed' as const
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Oct 28',
      time: '12:00 PM',
      title: 'Halloween Weekend Games!',
      location: 'Hongdae',
      attendees: 2,
      status: 'confirmed' as const
    }
  ];

  // Mock group events
  const groupEvents = [
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Oct 26',
      time: '4:00 PM',
      title: 'Free English Debate Club',
      group: 'Seoul Speakers',
      isNew: true
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1543603819-cb2d1c267265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Oct 22',
      time: '6:00 PM',
      title: 'K-Pop Dance Class',
      group: 'Seoul Dance Academy',
      isNew: true
    }
  ];

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto overscroll-contain">
      <div className="px-4 py-6 space-y-6 pb-20">
        {/* Header with Logo - Centered */}
        <div className="flex justify-center mb-4">
          <AppLogo />
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              {t('upcomingEvents')}
            </h2>
            <button
              onClick={onMyEventsClick}
              className="text-sm text-primary hover:underline"
            >
              {t('viewAll')}
            </button>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event.id)}
                  className="w-full bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all text-left"
                >
                  <div className="flex gap-3 p-3">
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {t('confirmed')}
                        </div>
                      </div>
                      <h3 className="text-sm font-medium mb-1 line-clamp-1">{event.title}</h3>
                      <div className="space-y-0.5">
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.date} · {event.time}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">
                {t('noUpcomingEvents')}
              </p>
            </div>
          )}
        </div>

        {/* From Your Groups */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              {t('newGroupEvents')}
            </h2>
            <button
              onClick={onExploreGroupsClick}
              className="text-sm text-primary hover:underline"
            >
              {t('viewGroups')}
            </button>
          </div>

          {groupEvents.length > 0 ? (
            <div className="space-y-3">
              {groupEvents.map((event) => (
                <button
                  key={event.id}
                  onClick={() => onEventClick(event.id)}
                  className="w-full bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all text-left"
                >
                  <div className="flex gap-3 p-3">
                    <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {event.isNew && (
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium mb-1">
                          <Zap className="w-3 h-3" />
                          NEW
                        </div>
                      )}
                      <h3 className="text-sm font-medium mb-1 line-clamp-2">{event.title}</h3>
                      <p className="text-xs text-muted-foreground mb-1">
                        by {event.group}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {event.date} · {event.time}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground mb-3">
                {t('joinGroupsToSeeEvents')}
              </p>
              <Button onClick={onExploreGroupsClick} variant="outline" size="sm">
                {t('browseGroups')}
              </Button>
            </div>
          )}
        </div>

        {/* Trending This Week */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t('trendingThisWeek')}
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {[
              {
                id: '5',
                image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                title: 'Korean Food Cooking',
                attendees: 24
              },
              {
                id: '6',
                image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                title: 'Bukhansan Hiking',
                attendees: 32
              },
              {
                id: '7',
                image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
                title: 'Book Club Meeting',
                attendees: 18
              }
            ].map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick(event.id)}
                className="flex-shrink-0 w-[140px] bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all text-left"
              >
                <div className="aspect-square">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2.5">
                  <h3 className="text-sm font-medium mb-1.5 line-clamp-2">{event.title}</h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="w-3 h-3" />
                    <span>{event.attendees}명</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Fitkle News */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2">
              {t('fitkleNews')}
              <span className="text-xl">📰</span>
            </h2>
          </div>

          <div className="space-y-3">
            {newsPosts.slice(0, 2).map((news) => {
              const title = news.titleKo;
              const content = news.contentKo;
              const preview = content.substring(0, 80) + '...';

              return (
                <button
                  key={news.id}
                  onClick={() => onNewsClick(news.id)}
                  className="w-full bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all text-left"
                >
                  <div className="flex gap-3 p-3">
                    {news.image && (
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
                        <img
                          src={news.image}
                          alt={title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        {news.isPinned && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-medium">
                            📌 {t('announcement')}
                          </span>
                        )}
                        <span className="px-2 py-0.5 bg-accent text-accent-foreground rounded text-xs">
                          {news.category}
                        </span>
                      </div>
                      <h3 className="text-sm font-medium mb-1 line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {preview}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
