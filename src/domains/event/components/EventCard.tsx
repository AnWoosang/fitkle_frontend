import { Calendar, MapPin, Users } from 'lucide-react';
import { groups } from '@/data/groups';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  attendees: number;
  maxAttendees: number;
  image: string;
  category: string;
  isHot?: boolean;
  isNew?: boolean;
  groupId?: string;
  onClick: () => void;
}

export function EventCard({
  title,
  date,
  time,
  location,
  attendees,
  maxAttendees,
  image,
  category,
  isHot,
  isNew,
  groupId,
  onClick
}: EventCardProps) {
  const percentage = (attendees / maxAttendees) * 100;
  const isAlmostFull = percentage >= 80;
  
  const getGroupName = (groupId?: string) => {
    if (!groupId) return null;
    const group = groups.find(g => g.id === groupId);
    return group?.name || null;
  };
  
  const groupName = getGroupName(groupId);

  return (
    <div 
      onClick={onClick}
      className="bg-card rounded-xl overflow-hidden shadow-sm border border-border/50 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
    >
      <div className="flex gap-4 p-4">
        {/* Image */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden shadow-sm">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="mb-2 flex items-center gap-1.5">
            <span className="inline-block text-xs px-2.5 py-0.5 bg-primary/10 text-primary rounded-lg">
              {category}
            </span>
            {isHot && (
              <span className="text-[10px] px-1.5 py-0.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 rounded border border-orange-200">
                HOT
              </span>
            )}
            {isNew && (
              <span className="text-[10px] px-1.5 py-0.5 bg-accent-rose/30 text-accent-rose-dark rounded">
                NEW
              </span>
            )}
          </div>
          
          <h3 className="mb-2 line-clamp-2 text-sm leading-tight">{title}</h3>
          
          <div className="mt-auto space-y-1.5">
            {/* Date and Location on the same row */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{date}</span>
              </div>
              <span className="text-muted-foreground/50">•</span>
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            </div>
            
            {/* Group name below */}
            {groupName && (
              <div className="text-xs text-muted-foreground/80">
                {groupName}
              </div>
            )}
            
            <div className="flex items-center gap-1.5 pt-0.5">
              <Users className="w-3.5 h-3.5 flex-shrink-0 text-muted-foreground" />
              <span className={`text-xs ${isAlmostFull ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
                {attendees}/{maxAttendees} 명
                {isAlmostFull && ' 🔥'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
