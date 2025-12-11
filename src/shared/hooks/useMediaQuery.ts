'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  // SSR 호환성: 초기값을 undefined로 설정하여 hydration 에러 방지
  const [matches, setMatches] = useState<boolean>(() => {
    // 서버 사이드에서는 false를 반환 (모바일로 기본 설정)
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    // 클라이언트 사이드에서만 실행
    const media = window.matchMedia(query);

    // 초기 값 설정
    setMatches(media.matches);

    // 리스너 등록
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);

    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
