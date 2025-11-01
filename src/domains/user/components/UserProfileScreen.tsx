import { Star, Calendar, Users, MessageCircle, Shield, CheckCircle, Mail } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { EventCard } from '@/domains/event/components/EventCard';
import { events } from '@/data/events';
import { BackButton } from '@/shared/components/BackButton';

interface UserProfileScreenProps {
  userId: string;
  onBack: () => void;
  onEventClick: (eventId: string) => void;
  onChatClick?: (userId: string) => void;
}

interface Review {
  id: string;
  userName: string;
  userCountry: string;
  rating: number;
  date: string;
  comment: string;
  eventName: string;
}

export function UserProfileScreen({ userId, onBack, onEventClick, onChatClick }: UserProfileScreenProps) {
  // Mock user data - 실제로는 props나 context에서 가져와야 함
  const user = {
    id: userId || 'jiyoung-park',
    name: 'Jiyoung Park',
    country: '🇰🇷',
    avatar: '',
    initials: 'JY',
    rating: 4.9,
    reviewsCount: 23,
    hostedEvents: 25,
    attendedEvents: 87,
    totalMembers: 150,
    activeYears: 2,
    bio: '안녕하세요! 서울에서 3년째 살고 있는 지영입니다. 다양한 나라에서 온 친구들과 함께 즐거운 시간을 보내는 걸 좋아해요. 특히 카페 모임과 문화 체험 활동을 좋아합니다. 모든 분들이 환영받는 따뜻한 분위기를 만들기 위해 노력하고 있어요!',
    interests: ['카페 모임', '문화 체험', '언어 교환', '브런치'],
    languages: ['한국어', 'English', '日本語'],
    responseRate: 98,
    responseTime: '1시간 이내',
    verified: true,
    joinedDate: '2023년 1월',
    email: 'jiyoung@example.com',
  };

  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Sarah Johnson',
      userCountry: '🇺🇸',
      rating: 5,
      date: '1주 전',
      comment: '지영님과 함께한 브런치 모임이 정말 좋았어요! 친절하고 배려심 많으신 분입니다.',
      eventName: '강남 브런치 & 수다 모임',
    },
    {
      id: '2',
      userName: 'Emma Watson',
      userCountry: '🇬🇧',
      rating: 5,
      date: '2주 전',
      comment: 'Amazing person! Very friendly and welcoming. Made great friends at the meetup.',
      eventName: '카페 모임',
    },
    {
      id: '3',
      userName: 'Maria Garcia',
      userCountry: '🇪🇸',
      rating: 4,
      date: '3주 전',
      comment: '좋은 사람이에요. 다음에도 함께하고 싶어요!',
      eventName: '한국 문화 체험',
    },
    {
      id: '4',
      userName: 'Lisa Chen',
      userCountry: '🇨🇳',
      rating: 5,
      date: '1개월 전',
      comment: '非常好的朋友！很热情，认识了很多新朋友。',
      eventName: '언어 교환 모임',
    },
  ];

  // Filter events
  const upcomingEvents = events.slice(0, 3);
  const pastEvents = events.slice(3, 6);

  return (
    <div className="flex flex-col h-full bg-background overflow-y-auto overscroll-contain pb-6">
      {/* Header with Back Button */}
      <div className="sticky top-0 left-0 right-0 z-20 px-4 lg:px-8 xl:px-12 pt-4 pb-3 bg-gradient-to-b from-background via-background to-transparent backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3 lg:max-w-5xl lg:mx-auto">
          <BackButton onClick={onBack} className="bg-card" />
          <h1 className="text-xl">{t('profile')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 lg:px-8 xl:px-12 space-y-5 mt-3 lg:max-w-5xl lg:mx-auto lg:w-full">
        {/* User Info Card */}
        <div className="bg-card rounded-2xl p-5 border border-border/50">
          <div className="flex items-start gap-4 mb-4">
            <div className="relative">
              <Avatar className="w-20 h-20 border-2 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {user.initials}
                </AvatarFallback>
              </Avatar>
              {user.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center border-2 border-background">
                  <CheckCircle className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl truncate">{user.name} {user.country}</h2>
              </div>
              <div className="flex items-center gap-1.5 mb-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{user.rating}</span>
                <span className="text-sm text-muted-foreground">({user.reviewsCount} {t('reviewsCount')})</span>
              </div>
              {user.verified && (
                <Badge variant="secondary" className="bg-primary/10 text-primary border-0 gap-1">
                  <Shield className="w-3 h-3" />
                  {t('verified')}
                </Badge>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-background/60 rounded-lg border border-border/50">
              <div className="flex items-center justify-center mb-1">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <p className="font-semibold text-lg">{user.hostedEvents}</p>
              <p className="text-xs text-muted-foreground">{t('hostedEventsCount')}</p>
            </div>
            <div className="text-center p-3 bg-background/60 rounded-lg border border-border/50">
              <div className="flex items-center justify-center mb-1">
                <Users className="w-4 h-4 text-primary" />
              </div>
              <p className="font-semibold text-lg">{user.attendedEvents}</p>
              <p className="text-xs text-muted-foreground">{t('attended')}</p>
            </div>
            <div className="text-center p-3 bg-background/60 rounded-lg border border-border/50">
              <div className="flex items-center justify-center mb-1">
                <MessageCircle className="w-4 h-4 text-primary" />
              </div>
              <p className="font-semibold text-lg">{user.responseRate}%</p>
              <p className="text-xs text-muted-foreground">{t('responseRate')}</p>
            </div>
          </div>

          {/* Chat Button */}
          {onChatClick && (
            <Button 
              onClick={() => onChatClick(user.id)}
              className="w-full h-11 gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              {t('sendMessage')}
            </Button>
          )}
        </div>

        {/* About Section */}
        <div>
          <h3 className="mb-3">{t('about')}</h3>
          <div className="bg-card rounded-xl p-4 border border-border">
            <p className="text-sm text-muted-foreground leading-relaxed">{user.bio}</p>
          </div>
        </div>

        {/* Interests */}
        <div>
          <h3 className="mb-3">{t('interests')}</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, idx) => (
              <Badge key={idx} variant="outline" className="bg-accent/50 border-primary/20">
                {interest}
              </Badge>
            ))}
          </div>
        </div>

        {/* Languages */}
        <div>
          <h3 className="mb-3">{t('languages')}</h3>
          <div className="flex flex-wrap gap-2">
            {user.languages.map((lang, idx) => (
              <Badge key={idx} variant="outline" className="bg-muted border-border">
                {lang}
              </Badge>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>{t('reviews')} ({reviews.length})</h3>
            <button className="text-sm text-primary">{t('viewAllReviews')}</button>
          </div>
          <div className="space-y-3">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="bg-card rounded-xl p-4 border border-border">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                        {review.userName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">{review.userName} {review.userCountry}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{review.date}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                <p className="text-xs text-muted-foreground italic">"{review.eventName}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3>{t('upcomingEvents')} ({upcomingEvents.length})</h3>
            <button className="text-sm text-primary">{t('viewAll')}</button>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                onClick={() => onEventClick(event.id)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
