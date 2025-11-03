"use client";

import { Footer } from '@/shared/components';
import { DashboardHomeScreen } from './DashboardHomeScreen';
import { ExploreScreen } from './ExploreScreen';
import { HomeScreen } from './HomeScreen';

interface WebHomeScreenProps {
  onEventClick: (eventId: string) => void;
  onGroupClick: (groupId: string) => void;
  onBrowseAllClick: () => void;
  onFindEventsClick?: () => void;
  onExploreGroupsClick?: () => void;
  onNewsClick?: (newsId: string) => void;
  searchQuery?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function WebHomeScreen({ onEventClick, onGroupClick, onBrowseAllClick, onFindEventsClick, onExploreGroupsClick, onNewsClick, searchQuery, onBack, showBackButton }: WebHomeScreenProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHomeScreen
        onEventClick={onEventClick}
        onGroupClick={onGroupClick}
        onBrowseAllClick={onBrowseAllClick}
        onFindEventsClick={onFindEventsClick || (() => {})}
        onExploreGroupsClick={onExploreGroupsClick || (() => {})}
        onNewsClick={onNewsClick}
      />
      <Footer />
    </div>
  );
}
