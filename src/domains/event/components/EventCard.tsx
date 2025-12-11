"use client";

import { useState, memo } from 'react';
import { Users, Star, Clock, MapPin, Heart } from 'lucide-react';
import { formatDateTime } from '@/shared/utils/dateFormat';

interface EventCardProps {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;  // 장소 (선택적)
  hostName?: string;  // 호스트 이름 (선택적)
  attendees: number;
  maxAttendees: number;
  image: string;
  category: string;
  isHot?: boolean;
  isNew?: boolean;
  groupId?: string;
  onClick: (id: string) => void;
}

export const EventCard = memo(function EventCard({
  id,
  title,
  date,
  time,
  location,
  hostName,
  attendees,
  maxAttendees,
  image,
  category,
  isHot: _isHot,
  isNew: _isNew,
  groupId: _groupId,
  onClick
}: EventCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const percentage = (attendees / maxAttendees) * 100;
  const isAlmostFull = percentage >= 80;

  return (
    <div
      onClick={() => onClick(id)}
      className="bg-card rounded-xl overflow-hidden shadow-sm border border-border/50 cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
    >
      {/* Image - 위 */}
      <div className="relative w-full h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Category Tag - 이미지 위 좌상단 */}
        <div className="absolute top-2 left-2">
          <span className="inline-block text-xs px-2 py-1 bg-white/90 backdrop-blur-sm text-primary rounded font-medium uppercase shadow-sm">
            {category}
          </span>
        </div>
        {/* Like Button - 이미지 위 우상단 */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm shadow-sm flex items-center justify-center hover:bg-white transition-colors"
          aria-label="Like"
        >
          <Heart className={`w-4 h-4 transition-colors ${isLiked ? 'fill-primary text-primary' : 'text-primary'}`} />
        </button>
      </div>

      {/* Content - 아래 */}
      <div className="p-4">
        {/* Title */}
        <h3 className="mb-2 line-clamp-2 text-base font-semibold leading-tight">{title}</h3>

        {/* Host Name */}
        {hostName && (
          <div className="text-xs text-muted-foreground mb-1 truncate">
            by {hostName}
          </div>
        )}

        {/* Date and Time */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{formatDateTime(date, time)}</span>
        </div>

        {/* Location */}
        {location && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        )}

        {/* Bottom row: Rating and Attendees */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">4.8</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-3.5 h-3.5 flex-shrink-0" />
            <span className={isAlmostFull ? 'text-orange-600 font-medium' : ''}>
              {attendees}/{maxAttendees} attendees
            </span>
          </div>
        </div>
      </div>
    </div>
  );
});
