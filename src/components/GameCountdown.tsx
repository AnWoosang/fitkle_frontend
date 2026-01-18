'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';

interface GameCountdownProps {
  onComplete: () => void;
}

/**
 * 게임 시작 전 5초 카운트다운 컴포넌트
 */
export function GameCountdown({ onComplete }: GameCountdownProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const [count, setCount] = useState(5);

  useEffect(() => {
    if (count === 0) {
      onComplete();
      return;
    }

    const timer = setTimeout(() => {
      setCount(count - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="countdown-overlay">
      <div className="countdown-content">
        <div className="countdown-number">{count}</div>
        <p className="countdown-text">{t.gameStartingSoon || '게임이 곧 시작됩니다...'}</p>
      </div>
    </div>
  );
}
