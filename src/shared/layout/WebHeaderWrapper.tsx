'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { WebHeader } from './WebHeader';
import { useAuthUtils, useLogout } from '@/domains/auth/hooks/useAuthQueries';
import { useUIStore } from '@/shared/store';

export function WebHeaderWrapper() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated } = useAuthUtils();
  const { mutate: logoutMutation } = useLogout();
  const { openLoginModal } = useUIStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // WebHeader를 완전히 숨겨야 하는 페이지들
  const hideHeaderPaths = [
    '/signup',
    '/signup-success',
    '/complete-profile',
    '/auth/callback',
  ];

  // 법률 페이지들 (모바일에서만 숨김)
  const legalPaths = [
    '/legal/terms-of-service',
    '/legal/privacy-policy',
    '/legal/location-terms',
  ];

  if (!mounted) {
    return null;
  }

  // 현재 경로가 완전히 헤더를 숨겨야 하는 경로인지 확인
  if (hideHeaderPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  // 법률 페이지에서는 모바일에서만 숨김
  const isLegalPage = legalPaths.some((path) => pathname.startsWith(path));
  const headerClassName = isLegalPage ? 'hidden md:block' : '';

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
    openLoginModal();
  };

  const handleSearch = (query: string, location: string) => {
    const params = new URLSearchParams();
    if (query) params.set('query', query);
    // "모든 지역", "All Regions", "전체 지역" 모두 체크
    if (location && location !== '모든 지역' && location !== 'All Regions' && location !== '전체 지역') {
      params.set('location', location);
    }

    console.log('[WebHeaderWrapper] Search params:', { query, location, url: `/explore?${params.toString()}` });
    router.push(`/explore?${params.toString()}`);
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
    logoutMutation();
  };

  return (
    <div className={headerClassName}>
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
        isLoggedIn={isAuthenticated}
        user={user}
      />
    </div>
  );
}
