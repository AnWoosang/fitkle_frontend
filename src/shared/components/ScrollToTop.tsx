'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 페이지 전환 시 스크롤을 최상단으로 이동시키는 컴포넌트
 *
 * Next.js App Router에서 페이지 전환 시 스크롤이 유지되는 문제를 해결합니다.
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    // 페이지 경로가 변경될 때마다 스크롤을 최상단으로 이동
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
