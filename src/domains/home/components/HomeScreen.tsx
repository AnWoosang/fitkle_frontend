"use client";

import { Footer } from '@/shared/components';
import { DashboardHomeScreen } from './DashboardHomeScreen';

interface HomeScreenProps {
  onEventClick: (eventId: string) => void;
  onGroupClick: (groupId: string) => void;
  onBrowseAllClick: () => void;
  onFindEventsClick?: () => void;
  onExploreGroupsClick?: () => void;
  onNewsClick?: (newsId: string) => void;
  onMyEventsClick: () => void;
  onSignupClick?: () => void;
  onCategoryClick?: (categoryId: string) => void;
  onNewsViewMoreClick?: () => void;
  searchQuery?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function HomeScreen({ onEventClick, onGroupClick, onBrowseAllClick, onFindEventsClick, onExploreGroupsClick, onNewsClick, onMyEventsClick, onSignupClick, onCategoryClick, onNewsViewMoreClick }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHomeScreen
        onEventClick={onEventClick}
        onGroupClick={onGroupClick}
        onBrowseAllClick={onBrowseAllClick}
        onFindEventsClick={onFindEventsClick || (() => {})}
        onExploreGroupsClick={onExploreGroupsClick || (() => {})}
        onNewsClick={onNewsClick}
        onMyEventsClick={onMyEventsClick}
        onSignupClick={onSignupClick}
        onCategoryClick={onCategoryClick}
        onNewsViewMoreClick={onNewsViewMoreClick}
      />
      <Footer />
    </div>
  );
}
