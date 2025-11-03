"use client";

import { newsPosts } from '@/data/news';
import { AppLogo } from '@/shared/components/AppLogo';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Sparkles, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Slider from 'react-slick';

interface DashboardHomeScreenProps {
  onEventClick: (eventId: string) => void;
  onGroupClick: (groupId: string) => void;
  onBrowseAllClick: () => void;
  onFindEventsClick: () => void;
  onExploreGroupsClick: () => void;
  onNewsClick?: (newsId: string) => void;
}

export function DashboardHomeScreen({
  onEventClick,
  onGroupClick,
  onBrowseAllClick,
  onFindEventsClick,
  onExploreGroupsClick,
  onNewsClick
}: DashboardHomeScreenProps) {
  const t = useTranslations('home');
  // Mock top picks events
  const topPicksEvents = [
    {
      id: '1',
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Tue, Oct 21',
      time: '1:00 PM GMT+9',
      title: 'Café Flow – gentle accountability and cozy focus to...',
      organizer: 'Seoul Creative Community Meetup...',
      rating: '5.0',
      attendees: 2,
      tag: '☕ Gentle accountability and cozy focus'
    },
    {
      id: '2',
      image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Sat, Oct 28',
      time: '12:00 PM GMT+9',
      title: 'Halloween Weekend Games!',
      organizer: 'English-speaking BoardGamers and...',
      rating: '4.9',
      attendees: 2,
      tag: '🎃 HALLOWEEN'
    },
    {
      id: '3',
      image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Sat, Oct 26',
      time: '4:00 AM GMT+9',
      title: '[온라인] 원어민 호스트와 함께하는 "모꼬" 영어토론토론 / Free English Debate Club',
      organizer: '영어로 자유로운 토론을 모꼬...',
      rating: '4.4',
      attendees: 4,
      tag: 'Online',
      isOnline: true
    },
    {
      id: '4',
      image: 'https://images.unsplash.com/photo-1543603819-cb2d1c267265?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Wed, Oct 22',
      time: '6:00 PM GMT+9',
      title: 'K-Pop Dance Class for Beginners',
      organizer: 'Seoul Dance Academy',
      rating: '4.8',
      attendees: 15,
      tag: '💃 Dance & Music'
    },
    {
      id: '5',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Thu, Oct 23',
      time: '7:00 PM GMT+9',
      title: 'Korean Food Cooking Class - Kimchi & Bulgogi',
      organizer: 'Culinary Exchange Seoul',
      rating: '4.9',
      attendees: 8,
      tag: '🍜 Cooking'
    },
    {
      id: '6',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Fri, Oct 24',
      time: '9:00 AM GMT+9',
      title: 'Hiking at Bukhansan National Park',
      organizer: 'Seoul Outdoor Adventurers',
      rating: '5.0',
      attendees: 20,
      tag: '🏔️ Outdoor'
    },
    {
      id: '7',
      image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Sat, Oct 25',
      time: '3:00 PM GMT+9',
      title: 'Book Club: Modern Korean Literature',
      organizer: 'Seoul Readers Society',
      rating: '4.7',
      attendees: 12,
      tag: '📚 Books'
    },
    {
      id: '8',
      image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
      date: 'Sun, Oct 26',
      time: '11:00 AM GMT+9',
      title: 'Yoga & Meditation in Hangang Park',
      organizer: 'Mindful Seoul Community',
      rating: '4.9',
      attendees: 18,
      tag: '🧘 Wellness'
    }
  ];

  // Custom arrow components for slider
  const CustomPrevArrow = ({ onClick }: any) => (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors -ml-5"
    >
      <ChevronLeft className="w-5 h-5 text-gray-700" />
    </button>
  );

  const CustomNextArrow = ({ onClick }: any) => (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors -mr-5"
    >
      <ChevronRight className="w-5 h-5 text-gray-700" />
    </button>
  );

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-24 xl:px-32 2xl:px-40 py-8">
          <div className="space-y-8">
              {/* Top Picks for You */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="flex items-center gap-2">
                    {t('topPicks')}
                    <Sparkles className="w-6 h-6 text-primary" />
                  </h2>
                  <button
                    onClick={onBrowseAllClick}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    {t('browseAll')}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Event Cards Slider */}
                <div className="relative px-8">
                  <Slider {...sliderSettings}>
                    {topPicksEvents.map((event) => (
                      <div key={event.id} className="px-2">
                        <button
                          onClick={() => onEventClick(event.id)}
                          className="w-full bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all text-left group"
                        >
                          <div className="relative aspect-[16/9]">
                            <img
                              src={event.image}
                              alt={event.title}
                              className="w-full h-full object-cover"
                            />
                            {event.isOnline && (
                              <div className="absolute top-3 right-3 px-2 py-1 bg-white/95 rounded-md text-xs">
                                🌐 Online
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-muted-foreground mb-2">
                              {event.date} · {event.time}
                            </p>
                            <h3 className="mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {event.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                              by {event.organizer}
                            </p>
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                <span>⭐</span>
                                <span>{event.rating}</span>
                              </div>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <Users className="w-3 h-3" />
                                <span>{event.attendees} attendees</span>
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>

              {/* From Groups You're Part Of */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="flex items-center gap-2">
                    {t('fromGroups')}
                    <span className="text-2xl">🎉</span>
                  </h2>
                  <select className="px-3 py-1.5 border border-border rounded-lg text-sm bg-background">
                    <option>{t('today')}</option>
                    <option>{t('thisWeek')}</option>
                    <option>{t('thisMonth')}</option>
                  </select>
                </div>

                {/* Empty State */}
                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-4 opacity-50">
                    <img
                      src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                      alt="Empty state"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <p className="text-muted-foreground mb-4">
                    {t('joinGroupsMessage')}
                  </p>
                  <Button
                    onClick={onExploreGroupsClick}
                    variant="outline"
                    className="mx-auto"
                  >
                    {t('exploreGroups')}
                  </Button>
                </div>
              </div>

              {/* Fitkle News */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="flex items-center gap-2">
                    {t('fitkleNews')}
                    <span className="text-2xl">📰</span>
                  </h2>
                </div>

                {/* News Cards */}
                <div className="space-y-4">
                  {newsPosts.map((news) => {
                    const title = news.titleKo;
                    const content = news.contentKo;
                    const preview = content.substring(0, 150) + '...';
                    
                    return (
                      <button
                        key={news.id}
                        onClick={() => onNewsClick?.(news.id)}
                        className="w-full bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all text-left group"
                      >
                        <div className="flex gap-4">
                          {news.image && (
                            <div className="w-32 h-32 flex-shrink-0">
                              <img
                                src={news.image}
                                alt={title}
                                className="w-full h-full object-cover rounded-xl"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {news.isPinned && (
                                <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                                  📌 {t('pinned')}
                                </span>
                              )}
                              <span className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs capitalize">
                                {t('announcement')}
                              </span>
                            </div>
                            <h3 className="text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                              {title}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                              {preview}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{news.author}</span>
                              <span>•</span>
                              <span>{new Date(news.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                              {news.readTime && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {news.readTime}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden px-4 py-6 space-y-6">
        {/* Mobile Header with Logo */}
        <div className="mb-2">
          <AppLogo />
        </div>

        {/* Top Picks for You */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2">
              {t('topPicks')}
              <Sparkles className="w-5 h-5 text-primary" />
            </h2>
            <button
              onClick={onBrowseAllClick}
              className="text-sm text-primary hover:underline"
            >
              {t('browseAll')}
            </button>
          </div>

          {/* Event Cards Horizontal Scroll */}
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {topPicksEvents.map((event) => (
              <button
                key={event.id}
                onClick={() => onEventClick(event.id)}
                className="flex-shrink-0 w-[280px] bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all text-left"
              >
                <div className="relative aspect-[16/9]">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  {event.isOnline && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-white/95 rounded-md text-xs">
                      🌐 Online
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    {event.date} · {event.time}
                  </p>
                  <h3 className="text-sm mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                    by {event.organizer}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <span>⭐</span>
                      <span>{event.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span>{event.attendees}</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* From Groups You're Part Of */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="flex items-center gap-2">
              {t('fromGroups')}
              <span className="text-xl">🎉</span>
            </h2>
          </div>

          {/* Empty State */}
          <div className="bg-card border border-border rounded-2xl p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-3 opacity-50">
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
                alt="Empty state"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {t('joinGroupsMessage')}
            </p>
            <Button
              onClick={onExploreGroupsClick}
              variant="outline"
            >
              {t('exploreGroups')}
            </Button>
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

          {/* News Cards */}
          <div className="space-y-3">
            {newsPosts.map((news) => {
              const title = news.titleKo;
              const content = news.contentKo;
              const preview = content.substring(0, 100) + '...';
              
              return (
                <button
                  key={news.id}
                  onClick={() => onNewsClick?.(news.id)}
                  className="w-full bg-card border border-border rounded-2xl p-4 hover:shadow-lg transition-all text-left"
                >
                  {news.image && (
                    <div className="w-full h-40 mb-3">
                      <img
                        src={news.image}
                        alt={title}
                        className="w-full h-full object-cover rounded-xl"
                      />
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-2">
                    {news.isPinned && (
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                        📌 {t('pinned')}
                      </span>
                    )}
                    <span className="px-2 py-1 bg-accent text-accent-foreground rounded-md text-xs capitalize">
                      {t('announcement')}
                    </span>
                  </div>
                  <h3 className="text-base mb-2 line-clamp-2">
                    {title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {preview}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{news.author}</span>
                    <span>•</span>
                    <span>{new Date(news.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}</span>
                    {news.readTime && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {news.readTime}
                        </span>
                      </>
                    )}
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
