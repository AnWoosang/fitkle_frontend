import { events } from '@/data/events';
import { groups } from '@/data/groups';
import { newsPosts } from '@/data/news';
import { EventCard } from '@/domains/event/components/EventCard';
import { MobileLayout } from '@/shared/layout';
import { Bookmark, Calendar, History, Megaphone, Users } from 'lucide-react';

interface HomeScreenProps {
  onEventClick: (eventId: string) => void;
  onGroupClick: (groupId: string) => void;
  onNewsClick: (newsId: string) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function HomeScreen({ onEventClick, onGroupClick, onNewsClick, onBack, showBackButton }: HomeScreenProps) {
  const upcomingEvents = events.slice(0, 3);
  const savedEvents = events.filter(e => e.id === '2' || e.id === '5');

  const getNewsTitle = (post: typeof newsPosts[0]) => post.titleKo;
  const getNewsContent = (post: typeof newsPosts[0]) => post.contentKo;

  const categoryLabels: Record<string, string> = {
    announcement: '공지',
    update: '업데이트',
    event: '이벤트',
    community: '커뮤니티',
  };

  return (
    <div className="lg:min-h-screen lg:bg-background">
      <MobileLayout 
        headerClassName="bg-primary/5 backdrop-blur-sm border-b border-primary/10"
        contentClassName="px-4 py-6 space-y-8"
        showBackButton={showBackButton}
        onBack={onBack}
      >
        {/* Upcoming Events Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg">다가오는 이벤트</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {upcomingEvents.length}개 이벤트
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(event => (
                <EventCard
                  key={event.id}
                  {...event}
                  onClick={() => onEventClick(event.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">예정된 이벤트가 없습니다</p>
              </div>
            )}
          </div>
        </section>

        {/* Saved Events Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-accent-rose/30 rounded-lg flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-accent-rose-dark" />
              </div>
              <h2 className="text-lg">저장한 이벤트</h2>
            </div>
            <span className="text-sm text-muted-foreground">
              {savedEvents.length}
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {savedEvents.length > 0 ? (
              savedEvents.map(event => (
                <EventCard
                  key={event.id}
                  {...event}
                  onClick={() => onEventClick(event.id)}
                />
              ))
            ) : (
              <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
                <Bookmark className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">저장한 이벤트가 없습니다</p>
              </div>
            )}
          </div>
        </section>

        {/* Recent Activity Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <History className="w-4 h-4 text-blue-600" />
              </div>
              <h2 className="text-lg">최근 활동</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {events.slice(3, 5).map(event => (
              <EventCard
                key={event.id}
                {...event}
                onClick={() => onEventClick(event.id)}
              />
            ))}
          </div>
        </section>

        {/* Popular Groups Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-green-600" />
              </div>
              <h2 className="text-lg">인기 그룹</h2>
            </div>
          </div>
          <div className="space-y-3">
            {groups.filter(g => g.members > 500).slice(0, 3).length > 0 ? (
              groups.filter(g => g.members > 500).slice(0, 3).map((group) => (
                <button
                  key={group.id}
                  onClick={() => onGroupClick(group.id)}
                  className="w-full bg-card rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-all text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={group.image}
                        alt={group.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 truncate">{group.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                        {group.description}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4 text-primary" />
                          <span>{group.members.toLocaleString()}</span>
                        </div>
                        <span>•</span>
                        <span>{group.eventsCount}개 이벤트</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-12 bg-card rounded-2xl border border-border/50">
                <Users className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">그룹이 없습니다</p>
              </div>
            )}
          </div>
        </section>

        {/* Fitkle News Section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <Megaphone className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-lg">Fitkle News</h2>
            </div>
          </div>
          <div className="space-y-3">
            {newsPosts.slice(0, 3).map(post => {
              const content = getNewsContent(post);
              const title = getNewsTitle(post);
              const preview = content.split('\n\n')[0]; // First paragraph as preview
              
              return (
                <button
                  key={post.id}
                  onClick={() => onNewsClick(post.id)}
                  className="w-full bg-gradient-to-br from-primary/5 to-primary/[0.02] rounded-2xl p-5 border border-primary/20 hover:border-primary/30 hover:shadow-md transition-all text-left"
                >
                  <div className="flex items-start gap-3 mb-3">
                    {post.isPinned && (
                      <div className="px-2 py-0.5 bg-primary/10 rounded-md">
                        <span className="text-[10px] text-primary uppercase tracking-wide">
                          고정
                        </span>
                      </div>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(post.date).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  
                  <h3 className="mb-3">{title}</h3>
                  
                  <div className="text-sm text-foreground/80 leading-relaxed line-clamp-3">
                    {preview}...
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-primary/10">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.author}</span>
                      <span className="px-2 py-1 bg-primary/5 rounded-md text-primary">
                        {categoryLabels[post.category] || post.category}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </MobileLayout>
    </div>
  );
}
