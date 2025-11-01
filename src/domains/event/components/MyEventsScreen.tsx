import { Calendar, Clock, CheckCircle, History } from 'lucide-react';
import { events } from '@/data/events';
import { EventCard } from '@/domains/event/components/EventCard';
import { MobileLayout } from '@/shared/layout';

interface MyEventsScreenProps {
  onEventClick: (eventId: string) => void;
}

export function MyEventsScreen({ onEventClick }: MyEventsScreenProps) {
  const upcomingEvents = events.slice(0, 3);
  const pastEvents = events.slice(10, 13);

  return (
    <MobileLayout contentClassName="px-4 py-4">
      {/* Stats Section */}
      <div className="mb-6 p-5 rounded-2xl bg-card border border-border/50 shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 rounded-xl bg-white/50">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <p className="text-xl text-primary mb-1">3</p>
              <p className="text-xs text-muted-foreground leading-tight">{t('upcomingEvents')}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-white/50">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-xl text-green-600 mb-1">24</p>
              <p className="text-xs text-muted-foreground leading-tight">{t('attended')}</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-muted/30">
              <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-accent-rose/30 flex items-center justify-center">
                <History className="w-5 h-5 text-accent-rose-dark" />
              </div>
              <p className="text-xl text-accent-rose-dark mb-1">18</p>
              <p className="text-xs text-muted-foreground leading-tight">{t('newFriends')}</p>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              <h3>{t('upcomingEvents')}</h3>
            </div>
            <span className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full">
              {upcomingEvents.length}
            </span>
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <EventCard
                  key={event.id}
                  {...event}
                  onClick={() => onEventClick(event.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-gradient-to-br from-secondary/50 to-muted/30 rounded-2xl border border-border/50">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
              <p className="text-muted-foreground mb-3">{t('noUpcomingEvents')}</p>
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
                {t('browseEvents')}
              </button>
            </div>
          )}
        </div>

        {/* Past Events */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-muted-foreground" />
              <h3>{t('pastEvents')}</h3>
            </div>
            <button className="text-sm text-primary">{t('viewAll')}</button>
          </div>
          <div className="space-y-3">
            {pastEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => onEventClick(event.id)}
                className="bg-card rounded-xl overflow-hidden border border-border/50 cursor-pointer opacity-80 hover:opacity-100 transition-all hover:shadow-md"
              >
                <div className="flex gap-4 p-4">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
                    <img 
                      src={event.image} 
                      alt={event.title}
                      className="w-full h-full object-cover grayscale-[20%]"
                    />
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-5 h-5 text-green-500 fill-green-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <span className="inline-block text-xs px-2.5 py-0.5 bg-secondary text-muted-foreground rounded-lg mb-2">
                      {t('completed')}
                    </span>
                    <p className="mb-2 line-clamp-2 text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </MobileLayout>
  );
}
