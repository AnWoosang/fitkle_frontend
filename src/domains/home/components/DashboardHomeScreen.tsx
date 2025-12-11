"use client";

import { Button } from '@/shared/components/ui/button';
import { ArrowRight, Sparkles, ChevronLeft, ChevronRight, Calendar, CheckCircle2, Users, TrendingUp, Plus } from 'lucide-react';
import { useEvents, useMyEvents, useTrendingEvents } from '@/domains/event/hooks';
import { EventCard } from '@/domains/event/components/EventCard';
import { useMyGroups } from '@/domains/group/hooks/useMyGroups';
import { GroupCard } from '@/domains/group/components/GroupCard';
import { useAuthUtils } from '@/domains/auth/hooks/useAuthQueries';
import { useNews } from '@/domains/home/hooks';
import { FloatingImagesHero } from './FloatingImagesHero';
import { CategoryGrid } from './CategoryGrid';
import { HeroSection } from './HeroSection';
import { CtaCard } from './CtaCard';
import { HowItWorksFlow } from './HowItWorksFlow';
import { NewsCategoryBadge } from './NewsCategoryBadge';
import Slider from 'react-slick';
import type { Settings } from 'react-slick';

interface DashboardHomeScreenProps {
  onEventClick: (eventId: string) => void;
  onGroupClick: (groupId: string) => void;
  onBrowseAllClick: () => void;
  onFindEventsClick: () => void;
  onExploreGroupsClick: () => void;
  onNewsClick?: (newsId: string) => void;
  onMyEventsClick: () => void;
  onSignupClick?: () => void;
  onCategoryClick?: (categoryId: string) => void;
  onNewsViewMoreClick?: () => void;
}

// 커스텀 화살표 컴포넌트
interface ArrowProps {
  onClick?: () => void;
}

function NextArrow({ onClick }: ArrowProps) {
  return (
    <button
      onClick={onClick}
      className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors -mr-5"
      aria-label="Next"
    >
      <ChevronRight className="w-5 h-5 text-gray-700" />
    </button>
  );
}

function PrevArrow({ onClick }: ArrowProps) {
  return (
    <button
      onClick={onClick}
      className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors -ml-5"
      aria-label="Previous"
    >
      <ChevronLeft className="w-5 h-5 text-gray-700" />
    </button>
  );
}

export function DashboardHomeScreen({
  onEventClick,
  onGroupClick,
  onBrowseAllClick,
  onFindEventsClick,
  onExploreGroupsClick,
  onNewsClick,
  onMyEventsClick,
  onSignupClick,
  onCategoryClick,
  onNewsViewMoreClick
}: DashboardHomeScreenProps) {
  const { isAuthenticated } = useAuthUtils();
  const { data: allEvents = [], isLoading } = useEvents();

  // 인증된 사용자만 호출
  const { data: myEvents = [] } = useMyEvents({
    enabled: isAuthenticated,
  });
  const { data: trendingEvents = [] } = useTrendingEvents();
  const { data: myGroups = [] } = useMyGroups({
    enabled: isAuthenticated,
  });

  // 뉴스 데이터 불러오기
  const { data: newsPosts = [] } = useNews();

  // Get top picks events from Supabase (상위 8개)
  const topPicksEvents = allEvents.slice(0, 8);

  // Slider settings - Top picks용
  const topPicksSliderSettings: Settings = {
    dots: false,
    infinite: topPicksEvents.length > 4, // 이벤트가 충분할 때만 무한 루프
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: topPicksEvents.length > 4,
        }
      },
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          infinite: topPicksEvents.length > 4,
        }
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: topPicksEvents.length > 3,
        }
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: topPicksEvents.length > 2,
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: topPicksEvents.length > 2,
        }
      }
    ]
  };

  // Slider settings - My events용 (다가오는 이벤트)
  const myEventsSliderSettings: Settings = {
    dots: false,
    infinite: myEvents.length > 4, // 이벤트가 충분할 때만 무한 루프
    speed: 500,
    slidesToShow: Math.min(4, myEvents.length), // 실제 이벤트 개수만큼만 표시
    slidesToScroll: Math.min(4, myEvents.length),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1536, // 2xl
        settings: {
          slidesToShow: Math.min(4, myEvents.length),
          slidesToScroll: Math.min(4, myEvents.length),
          infinite: myEvents.length > 4,
        }
      },
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: Math.min(4, myEvents.length),
          slidesToScroll: Math.min(4, myEvents.length),
          infinite: myEvents.length > 4,
        }
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: Math.min(3, myEvents.length),
          slidesToScroll: Math.min(3, myEvents.length),
          infinite: myEvents.length > 3,
        }
      },
      {
        breakpoint: 768, // md
        settings: {
          slidesToShow: Math.min(2, myEvents.length),
          slidesToScroll: Math.min(2, myEvents.length),
          infinite: myEvents.length > 2,
        }
      },
      {
        breakpoint: 640, // sm
        settings: {
          slidesToShow: Math.min(2, myEvents.length),
          slidesToScroll: Math.min(2, myEvents.length),
          infinite: myEvents.length > 2,
        }
      }
    ]
  };

  // Show loading state to prevent hydration mismatch
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center text-muted-foreground">Loading...</div>
        </div>
      </div>
    );
  }

  // 비로그인 사용자: 랜딩 페이지 표시
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background pb-8">
        <div className="max-w-[1600px] mx-auto px-8 lg:px-24 xl:px-32 2xl:px-40 py-8">
          <div className="space-y-12">
            {/* Hero Section with Floating Images */}
            <FloatingImagesHero onSignupClick={onSignupClick || (() => {})} />
{/* 이번 주 인기 이벤트 - 비로그인 사용자도 표시 */}
{trendingEvents.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    이번 주 인기 이벤트
                  </h2>
                </div>

                <div className="relative -mx-2">
                  <Slider {...topPicksSliderSettings}>
                    {trendingEvents.map((event) => (
                      <div key={event.id} className="px-2">
                        <EventCard
                          id={event.id}
                          title={event.title}
                          date={event.date}
                          time={event.time}
                          hostName={event.hostName || 'Organizer'}
                          location={event.streetAddress}
                          attendees={event.attendees}
                          maxAttendees={event.maxAttendees}
                          image={event.image}
                          category={event.categoryCode || ''}
                          onClick={() => onEventClick(event.id)}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>
            )}

            {/* Hero Section - 오늘 뭐 할까? */}
            <HeroSection onFindEventsClick={onFindEventsClick} />

            {/* Category Grid */}
            <CategoryGrid onCategoryClick={onCategoryClick || onFindEventsClick} />

            {/* How It Works Flow */}
            <HowItWorksFlow />

            {/* Fitkle 뉴스 - 비로그인 사용자도 표시 */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="flex items-center gap-2">
                  <span className="text-2xl">📰</span>
                  Fitkle 뉴스
                </h2>
                <button
                  onClick={onNewsViewMoreClick}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  View More
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {newsPosts.slice(0, 3).map((news) => {
                  const title = news.title;

                  return (
                    <button
                      key={news.id}
                      onClick={() => onNewsClick?.(news.id)}
                      className="w-full bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all text-left group"
                    >
                      <div className="flex gap-4">
                        {news.thumbnailImageUrl && (
                          <div className="w-24 h-24 flex-shrink-0">
                            <img
                              src={news.thumbnailImageUrl}
                              alt={title}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {news.isNew && (
                              <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                                🆕 NEW
                              </span>
                            )}
                            <NewsCategoryBadge category={news.category} />
                          </div>
                          <h3 className="text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                            {title}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{news.author}</span>
                            <span>•</span>
                            <span>
                              {news.createdAt
                                ? new Date(news.createdAt).toLocaleDateString('ko-KR', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })
                                : '날짜 없음'
                              }
                            </span>
                            {news.likeCount !== undefined && news.likeCount > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  ❤️ {news.likeCount}
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

            {/* CTA Card */}
            <CtaCard onSignupClick={onSignupClick || (() => {})} />
          </div>
        </div>
      </div>
    );
  }

  // 로그인 사용자: 기존 대시보드 표시
  return (
    <div className="min-h-screen bg-background pb-8">
      <div className="max-w-[1600px] mx-auto px-8 lg:px-24 xl:px-32 2xl:px-40 py-8">
          <div className="space-y-8">
              {/* Upcoming Events (RSVP한 이벤트) - 인증된 사용자만 표시 */}
              {isAuthenticated && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="flex items-center gap-2">
                    <Calendar className="w-6 h-6 text-primary" />
                    다가오는 이벤트
                  </h2>
                  <button
                    onClick={onMyEventsClick}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    전체보기
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* My Events Slider or Empty State */}
                {myEvents.length > 0 ? (
                  myEvents.length >= 4 ? (
                    // 4개 이상: 슬라이더 사용
                    <div className="relative -mx-2">
                      <Slider {...myEventsSliderSettings}>
                        {myEvents.slice(0, 8).map((event) => (
                          <div key={event.id} className="px-2">
                            <div className="relative">
                              <EventCard
                                id={event.id}
                                title={event.title}
                                date={event.date}
                                time={event.time}
                                hostName={event.hostName || 'Organizer'}
                                location={event.streetAddress}
                                attendees={event.attendees}
                                maxAttendees={event.maxAttendees}
                                image={event.image}
                                category={event.categoryCode || ''}
                                onClick={() => onEventClick(event.id)}
                              />
                              {/* 참석 확정 뱃지 */}
                              <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" />
                                참석 확정
                              </div>
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                  ) : (
                    // 3개 이하: 그리드 레이아웃 사용
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {myEvents.map((event) => (
                        <div key={event.id} className="relative">
                          <EventCard
                            id={event.id}
                            title={event.title}
                            date={event.date}
                            time={event.time}
                            hostName={event.hostName || 'Organizer'}
                            location={event.streetAddress}  
                            attendees={event.attendees}
                            maxAttendees={event.maxAttendees}
                            image={event.image}
                            category={event.categoryCode || ''}
                            onClick={() => onEventClick(event.id)}
                          />
                          {/* 참석 확정 뱃지 */}
                          <div className="absolute top-2 right-2 z-10 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            참석 확정
                          </div>
                        </div>
                      ))}
                      {/* 더 많은 이벤트 찾기 카드 */}
                      <button
                        onClick={onBrowseAllClick}
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-primary hover:bg-primary/5 transition-all group"
                      >
                        <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                          <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                            <Plus className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                          <p className="font-semibold text-gray-700 group-hover:text-primary transition-colors mb-1">
                            더 많은 이벤트 찾기
                          </p>
                          <p className="text-sm text-gray-500">
                            새로운 이벤트를 둘러보세요
                          </p>
                        </div>
                      </button>
                    </div>
                  )
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-12 text-center">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">
                      예정된 이벤트가 없어요
                    </p>
                    <Button
                      onClick={onBrowseAllClick}
                      variant="outline"
                      className="mx-auto"
                    >
                      이벤트 둘러보기
                    </Button>
                  </div>
                )}
              </div>
              )}

              {/* 추천 이벤트 */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    추천 이벤트
                  </h2>
                  <button
                    onClick={onBrowseAllClick}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    전체보기
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Event Cards Slider */}
                <div className="relative -mx-2">
                  <Slider {...topPicksSliderSettings}>
                    {topPicksEvents.map((event) => (
                      <div key={event.id} className="px-2">
                        <EventCard
                          id={event.id}
                          title={event.title}
                          date={event.date}
                          time={event.time}
                          hostName={event.hostName || 'Organizer'}
                          location={event.streetAddress}
                          attendees={event.attendees}
                          maxAttendees={event.maxAttendees}
                          image={event.image}
                          category={event.categoryCode || ''}
                          onClick={() => onEventClick(event.id)}
                        />
                      </div>
                    ))}
                  </Slider>
                </div>
              </div>

              {/* 내 그룹 - 인증된 사용자만 표시 */}
              {isAuthenticated && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="flex items-center gap-2">
                    <Users className="w-6 h-6 text-primary" />
                    내 그룹
                    <span className="text-muted-foreground text-sm ml-1">({myGroups.length})</span>
                  </h2>
                  <button
                    onClick={onExploreGroupsClick}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    전체보기
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* My Groups Slider or Empty State */}
                {myGroups.length > 0 ? (
                  myGroups.length >= 4 ? (
                    // 4개 이상: 슬라이더 사용
                    <div className="relative -mx-2">
                      <Slider {...topPicksSliderSettings}>
                        {myGroups.slice(0, 8).map((group) => (
                          <div key={group.id} className="px-2">
                            <GroupCard
                              id={group.id}
                              name={group.name}
                              description={group.description}
                              members={group.members || 0}
                              image={group.image || ''}
                              category={group.categoryCode || ''}
                              eventCount={group.eventCount || 0}
                              onClick={() => onGroupClick(group.id)}
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  ) : (
                    // 3개 이하: 그리드 레이아웃 사용
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {myGroups.map((group) => (
                        <GroupCard
                          key={group.id}
                          id={group.id}
                          name={group.name}
                          description={group.description}
                          members={group.members || 0}
                          image={group.image || ''}
                          category={group.categoryCode || ''}
                          eventCount={group.eventCount || 0}
                          onClick={() => onGroupClick(group.id)}
                        />
                      ))}
                      {/* 더 많은 그룹 찾기 카드 */}
                      <button
                        onClick={onExploreGroupsClick}
                        className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:border-primary hover:bg-primary/5 transition-all group"
                      >
                        <div className="flex flex-col items-center justify-center h-full min-h-[200px]">
                          <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-primary/10 flex items-center justify-center mb-4 transition-colors">
                            <Plus className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                          </div>
                          <p className="font-semibold text-gray-700 group-hover:text-primary transition-colors mb-1">
                            더 많은 그룹 찾기
                          </p>
                          <p className="text-sm text-gray-500">
                            새로운 그룹을 둘러보세요
                          </p>
                        </div>
                      </button>
                    </div>
                  )
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-12 text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground mb-4">
                      아직 가입한 그룹이 없어요
                    </p>
                    <Button
                      onClick={onExploreGroupsClick}
                      variant="outline"
                      className="mx-auto"
                    >
                      그룹 둘러보기
                    </Button>
                  </div>
                )}
              </div>
              )}

              {/* 이번 주 인기 이벤트 */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    이번 주 인기 이벤트
                  </h2>
                </div>

                {/* Trending Events Slider */}
                {trendingEvents.length > 0 ? (
                  <div className="relative -mx-2">
                    <Slider {...topPicksSliderSettings}>
                      {trendingEvents.map((event) => (
                        <div key={event.id} className="px-2">
                          <EventCard
                            id={event.id}
                            title={event.title}
                            date={event.date}
                            time={event.time}
                            hostName={event.hostName || 'Organizer'}
                            location={event.streetAddress}  
                            attendees={event.attendees}
                            maxAttendees={event.maxAttendees}
                            image={event.image}
                            category={event.categoryCode || ''}
                            onClick={() => onEventClick(event.id)}
                          />
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-12 text-center">
                    <TrendingUp className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      이번 주 인기 이벤트가 없어요
                    </p>
                  </div>
                )}
              </div>

              {/* Fitkle 뉴스 */}
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="flex items-center gap-2">
                    <span className="text-2xl">📰</span>
                    Fitkle 뉴스
                  </h2>
                  <button
                    onClick={onNewsViewMoreClick}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    View More
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* News Cards */}
                <div className="space-y-4">
                  {newsPosts.slice(0, 3).map((news) => {
                    const title = news.title;

                    return (
                      <button
                        key={news.id}
                        onClick={() => onNewsClick?.(news.id)}
                        className="w-full bg-card border border-border rounded-2xl p-5 hover:shadow-lg transition-all text-left group"
                      >
                        <div className="flex gap-4">
                          {news.thumbnailImageUrl && (
                            <div className="w-24 h-24 flex-shrink-0">
                              <img
                                src={news.thumbnailImageUrl}
                                alt={title}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              {news.isNew && (
                                <span className="px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                                  🆕 NEW
                                </span>
                              )}
                              <NewsCategoryBadge category={news.category} />
                            </div>
                            <h3 className="text-lg mb-3 group-hover:text-primary transition-colors line-clamp-2">
                              {title}
                            </h3>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>{news.author}</span>
                              <span>•</span>
                              <span>
                                {news.createdAt
                                  ? new Date(news.createdAt).toLocaleDateString('ko-KR', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })
                                  : '날짜 없음'
                                }
                              </span>
                              {news.likeCount !== undefined && news.likeCount > 0 && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    ❤️ {news.likeCount}
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
  );
}
