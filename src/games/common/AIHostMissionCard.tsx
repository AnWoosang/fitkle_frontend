import { useTranslation } from '@/i18n/translations';
import type { Language } from '@/contexts/LanguageContext';

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
}

/**
 * AI 호스트 미션 카드 컴포넌트
 *
 * 참가자별로 랜덤하게 부여되는 비언어적 행동 미션을 표시합니다.
 * 웃음과 행동을 통해 자연스럽게 아이스 브레이킹을 유도합니다.
 */
export function AIHostMissionCard({ mission, language }: AIHostMissionCardProps) {
  const t = useTranslation(language);

  if (!mission) {
    return null;
  }

  return (
    <div
      className="ai-host-mission-card"
      style={{
        marginBottom: '20px',
        padding: '16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        width: '100%',
      }}
    >
      {/* 제목 (로봇 이모지 제거됨) */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '12px',
        }}
      >
        <h4
          style={{
            margin: 0,
            fontSize: '0.9rem',
            fontWeight: 'bold',
            color: '#fff',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          {t.aiHostMissionTitle}
        </h4>
      </div>

      {/* 미션 내용 */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          borderRadius: '8px',
          padding: '12px',
        }}
      >
        {/* 왼쪽: GIF */}
        <div
          style={{
            flex: '0 0 100px',
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
              maxHeight: '100px',
              objectFit: 'contain',
              borderRadius: '6px',
              border: '2px solid #e0e0e0',
            }}
          />
        </div>

        {/* 오른쪽: 미션 설명 */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {/* 제스처 설명 */}
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: '#667eea',
                textTransform: 'uppercase',
              }}
            >
              {t.aiHostGestureLabel}
            </span>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '0.85rem',
                color: '#333',
                lineHeight: '1.4',
              }}
            >
              {t[mission.gesture as keyof typeof t] as string}
            </p>
          </div>

          {/* 말투 (선택적) */}
          {mission.speechStyle && (
            <div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  color: '#f59e0b',
                  textTransform: 'uppercase',
                }}
              >
                {t.aiHostSpeechStyleLabel}
              </span>
              <p
                style={{
                  margin: '4px 0 0 0',
                  fontSize: '0.85rem',
                  color: '#333',
                  lineHeight: '1.4',
                }}
              >
                {t[mission.speechStyle as keyof typeof t] as string}
              </p>
            </div>
          )}

          {/* 행동 */}
          <div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 'bold',
                color: '#10b981',
                textTransform: 'uppercase',
              }}
            >
              {t.aiHostActionLabel}
            </span>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '0.85rem',
                color: '#333',
                lineHeight: '1.4',
                fontWeight: '600',
              }}
            >
              {t[mission.action as keyof typeof t] as string}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
