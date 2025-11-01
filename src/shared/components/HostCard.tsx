import { Star, CheckCircle2 } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';

interface HostCardProps {
  name: string;
  country: string;
  rating: number;
  reviewCount: number;
  bio: string;
  stats: {
    label: string;
    value: string | number;
  }[];
  onClick?: () => void;
  isVerified?: boolean;
}

export function HostCard({ name, country, rating, reviewCount, bio, stats, onClick, isVerified = true }: HostCardProps) {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-4 bg-card rounded-lg border border-border text-left ${
        onClick ? 'hover:bg-accent/50 hover:border-primary/30 transition-all cursor-pointer' : ''
      }`}
    >
      <Avatar className="w-14 h-14">
        <AvatarFallback className="bg-primary text-primary-foreground">
          {name.split(' ').map(n => n[0]).join('').toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-semibold">{name} {country}</p>
          {isVerified && (
            <CheckCircle2 className="w-4 h-4 text-primary fill-primary flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-sm">{rating} ({reviewCount}개 리뷰)</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {bio}
        </p>
        <div className="flex flex-wrap gap-2">
          {stats.map((stat, idx) => (
            <Badge key={idx} variant="outline" className="text-xs">
              {stat.label} {stat.value}
            </Badge>
          ))}
        </div>
      </div>
    </Component>
  );
}
