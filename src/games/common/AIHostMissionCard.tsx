import { useTranslation } from '@/i18n/translations';
import type { Language } from '@/contexts/LanguageContext';
import { useState } from 'react';

export interface AIHostMission {
  id: string;
  gifUrl: string;
  gesture: string;      // 번역 키 (예: 'mission_gesture_wave_arms')
  action: string;       // 번역 키 (예: 'mission_action_speak_loudly')
  speechStyle?: string; // 번역 키 (선택적)
}

interface AIHostMissionCardProps {
  mission: AIHostMission | null;
  language: Language;
  playerName?: string; // 현재 미션을 수행하는 플레이어 이름
  isMyMission?: boolean; // 내 미션인지 여부
  onClose?: () => void; // 닫기 콜백
}

/**
 * AI 호스트 미션 카드 컴포넌트
 *
 * 참가자별로 랜덤하게 부여되는 비언어적 행동 미션을 표시합니다.
 * 웃음과 행동을 통해 자연스럽게 아이스 브레이킹을 유도합니다.
 */
export function AIHostMissionCard({ mission, language, playerName, isMyMission = true, onClose }: AIHostMissionCardProps) {
  const t = useTranslation(language);
  const [isVisible, setIsVisible] = useState(true);

  if (!mission || !isVisible) {
    return null;
  }

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  // 제목 텍스트 결정
  const getTitleText = () => {
    if (isMyMission) {
      return t.aiHostMissionTitle;
    }
    if (playerName) {
      return language === 'ko' ? `${playerName}님의 AI 호스트 미션` :
             language === 'en' ? `${playerName}'s AI Host Mission` :
             language === 'ja' ? `${playerName}さんのAIホストミッション` :
             language === 'zh' ? `${playerName}的AI主持人任务` :
             language === 'es' ? `Misión de ${playerName}` :
             `Nhiệm vụ của ${playerName}`;
    }
    return t.aiHostMissionTitle;
  };

  return (
    <div
      className="ai-host-mission-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      {/* 닫기 버튼 */}
      <button
        onClick={handleClose}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'rgba(255, 255, 255, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          borderRadius: '50%',
          width: '48px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: '24px',
          color: '#fff',
          fontWeight: 'bold',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        ✕
      </button>

      {/* 제목 */}
      <div
        style={{
          marginBottom: '24px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
          }}
        >
          {getTitleText()}
        </h2>
      </div>

      {/* 큰 GIF 이미지 */}
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={mission.gifUrl}
          alt="미션 동작"
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: '400px',
            objectFit: 'contain',
            borderRadius: '16px',
            border: '4px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        />
      </div>

      {/* 메시지 - 내 미션일 때만 표시 */}
      {isMyMission && (
        <div
          style={{
            textAlign: 'center',
            maxWidth: '500px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#fff',
              lineHeight: '1.6',
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}
          >
            {t[mission.action as keyof typeof t] as string}
          </p>
        </div>
      )}
    </div>
  );
}
