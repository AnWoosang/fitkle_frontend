"use client";

import { ExploreScreen } from './ExploreScreen';

interface WebHomeScreenProps {
  onEventClick: (eventId: string) => void;
  onGroupClick: (groupId: string) => void;
  searchQuery?: string;
  onBack?: () => void;
  showBackButton?: boolean;
}

export function WebHomeScreen({ onEventClick, onGroupClick, searchQuery, onBack, showBackButton }: WebHomeScreenProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* ExploreScreen with all tabs */}
      <ExploreScreen 
        onEventClick={onEventClick} 
        onGroupClick={onGroupClick}
        initialSearchQuery={searchQuery}
        onBack={showBackButton ? onBack : undefined}
      />
    </div>
  );
}
