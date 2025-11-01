'use client';

import { useRouter } from 'next/navigation';
import { ProfileScreen } from '@/domains/user';
import { ResponsiveLayout } from '@/shared/layout';

export default function ProfilePage() {
  const router = useRouter();

  const handleBack = () => {
    router.push('/');
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
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

  const handleSettingsClick = () => {
    router.push('/settings');
  };

  const handleLogout = () => {
    console.log('Logout');
    router.push('/login');
  };

  return (
    <ResponsiveLayout
      mobileLayoutProps={{
        showBackButton: true,
        onBack: handleBack,
        title: 'Profile',
      }}
      webLayoutProps={{
        maxWidth: 'default',
      }}
      mobileContent={
        <ProfileScreen
          onBack={handleBack}
          onEditProfile={handleEditProfile}
          onMyCreatedEventsClick={handleMyCreatedEventsClick}
          onMyJoinedEventsClick={handleMyJoinedEventsClick}
          onMySavedEventsClick={handleMySavedEventsClick}
          onMyCreatedGroupsClick={handleMyCreatedGroupsClick}
          onMyJoinedGroupsClick={handleMyJoinedGroupsClick}
          onSettingsClick={handleSettingsClick}
          onLogout={handleLogout}
        />
      }
      webContent={
        <ProfileScreen
          onBack={handleBack}
          onEditProfile={handleEditProfile}
          onMyCreatedEventsClick={handleMyCreatedEventsClick}
          onMyJoinedEventsClick={handleMyJoinedEventsClick}
          onMySavedEventsClick={handleMySavedEventsClick}
          onMyCreatedGroupsClick={handleMyCreatedGroupsClick}
          onMyJoinedGroupsClick={handleMyJoinedGroupsClick}
          onSettingsClick={handleSettingsClick}
          onLogout={handleLogout}
        />
      }
    />
  );
}
