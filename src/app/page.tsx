'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { HomeScreen } from '@/domains/home';
import { useUIStore } from '@/shared/store';
import { toast } from 'sonner';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openLoginModal, openSignupModal } = useUIStore();

  // OAuth 에러 처리
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      let errorMessage = '로그인에 실패했습니다.';

      switch (error) {
        case 'oauth_failed':
          errorMessage = '소셜 로그인에 실패했습니다. 다시 시도해주세요.';
          break;
        case 'no_auth_code':
          errorMessage = '로그인이 취소되었습니다.';
          break;
        case 'callback_error':
          errorMessage = '로그인 처리 중 오류가 발생했습니다.';
          break;
        case 'member_check_failed':
          errorMessage = '회원 정보 확인에 실패했습니다.';
          break;
      }

      // URL에서 에러 파라미터 제거
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('error');
      window.history.replaceState({}, '', newUrl.pathname + newUrl.search);

      // 로그인 모달 열기
      openLoginModal();

      // 모달이 열린 후 toast 표시 (약간의 딜레이)
      setTimeout(() => {
        toast.error(errorMessage);
      }, 100);
    }
  }, [searchParams, openLoginModal]);

  const handleEventClick = (eventId: string) => {
    router.push(`/events/${eventId}`);
  };

  const handleGroupClick = (groupId: string) => {
    router.push(`/groups/${groupId}`);
  };

  const handleBrowseAllClick = () => {
    router.push('/events');
  };

  const handleFindEventsClick = () => {
    router.push('/events');
  };

  const handleExploreGroupsClick = () => {
    router.push('/groups');
  };

  const handleNewsClick = (newsId: string) => {
    router.push(`/news/${newsId}`);
  };

  const handleMyEventsClick = () => {
    router.push('/my-events');
  };

  const handleSignupClick = () => {
    openSignupModal();
  };

  const handleCategoryClick = (categoryId: string) => {
    // 카테고리 ID로 explore 페이지로 이동
    router.push(`/explore?category=${categoryId}`);
  };

  const handleNewsViewMoreClick = () => {
    router.push('/news');
  };

  return (
    <HomeScreen
      onEventClick={handleEventClick}
      onGroupClick={handleGroupClick}
      onBrowseAllClick={handleBrowseAllClick}
      onFindEventsClick={handleFindEventsClick}
      onExploreGroupsClick={handleExploreGroupsClick}
      onNewsClick={handleNewsClick}
      onMyEventsClick={handleMyEventsClick}
      onSignupClick={handleSignupClick}
      onCategoryClick={handleCategoryClick}
      onNewsViewMoreClick={handleNewsViewMoreClick}
    />
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
