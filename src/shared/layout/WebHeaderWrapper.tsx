'use client';

import { useRouter } from 'next/navigation';
import { WebHeader } from './WebHeader';
import { useMediaQuery } from '@/shared/hooks';

export function WebHeaderWrapper() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    return null;
  }

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleMessagesClick = () => {
    router.push('/messages');
  };

  const handleProfileClick = () => {
    router.push('/profile');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSearch = (query: string, location: string) => {
    console.log('Search:', query, location);
    // TODO: Implement search functionality
  };

  const handleMyEventsClick = () => {
    router.push('/my-events');
  };

  const handleMyGroupsClick = () => {
    router.push('/my-groups');
  };

  const handleMyCreatedEventsClick = () => {
    router.push('/my-events?filter=created');
  };

  const handleMyJoinedEventsClick = () => {
    router.push('/my-events?filter=joined');
  };

  const handleMySavedEventsClick = () => {
    router.push('/my-events?filter=saved');
  };

  const handleMyCreatedGroupsClick = () => {
    router.push('/my-groups?filter=created');
  };

  const handleMyJoinedGroupsClick = () => {
    router.push('/my-groups?filter=joined');
  };

  const handleCreateGroupClick = () => {
    router.push('/groups/create');
  };

  const handleCreateEventClick = () => {
    router.push('/events/create');
  };

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  const handleReportClick = () => {
    console.log('Report');
    // TODO: Implement report functionality
  };

  const handleLogoutClick = () => {
    console.log('Logout');
    router.push('/login');
  };

  return (
    <WebHeader
      onLogoClick={handleLogoClick}
      onMessagesClick={handleMessagesClick}
      onProfileClick={handleProfileClick}
      onLoginClick={handleLoginClick}
      onSearch={handleSearch}
      onMyEventsClick={handleMyEventsClick}
      onMyGroupsClick={handleMyGroupsClick}
      onMyCreatedEventsClick={handleMyCreatedEventsClick}
      onMyJoinedEventsClick={handleMyJoinedEventsClick}
      onMySavedEventsClick={handleMySavedEventsClick}
      onMyCreatedGroupsClick={handleMyCreatedGroupsClick}
      onMyJoinedGroupsClick={handleMyJoinedGroupsClick}
      onCreateGroupClick={handleCreateGroupClick}
      onCreateEventClick={handleCreateEventClick}
      onSettingsClick={handleSettingsClick}
      onReportClick={handleReportClick}
      onLogoutClick={handleLogoutClick}
      isLoggedIn={true}
    />
  );
}
