import { useTranslation } from '@/i18n/translations';
import type { Language } from '@/contexts/LanguageContext';
import type { AIHostMission } from './AIHostMissionCard';

interface CompactAIHostMissionCardProps {
  mission: AIHostMission | null;
  language: Language;
  playerName?: string;
  isMyMission?: boolean;
}

/**
 * 게임 보드 내에 표시되는 컴팩트한 AI 호스트 미션 카드
 * 플레이어 목록과 게임 보드 사이에 표시되어 현재 미션을 상기시킵니다.
 */
export function CompactAIHostMissionCard({
  mission,
  language,
  playerName,
  isMyMission = true
}: CompactAIHostMissionCardProps) {
  const t = useTranslation(language);

  if (!mission) {
    return null;
  }

  return (
    <div
      style={{
        marginTop: '20px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
        borderRadius: '12px',
        border: '2px solid rgba(139, 92, 246, 0.3)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* 헤더 */}
      <div style={{
        marginBottom: '12px',
        textAlign: 'center'
      }}>
        <h4 style={{
          margin: 0,
          fontSize: '0.9rem',
          fontWeight: 'bold',
          color: '#a78bfa',
        }}>
          🎭 {isMyMission ? t.aiHostMissionTitle : `${playerName}${language === 'ko' ? '님의 미션' : "'s Mission"}`}
        </h4>
      </div>

      {/* GIF와 미션 내용 - 세로 배치 */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* 큰 GIF */}
        <div style={{
          width: '100%',
          maxWidth: '200px',
          aspectRatio: '1',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        }}>
          <img
            src={mission.gifUrl}
            alt="미션 동작"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>

        {/* 미션 설명 */}
        {isMyMission && (
          <div style={{ width: '100%', textAlign: 'center' }}>
            <p style={{
              margin: 0,
              fontSize: '0.95rem',
              fontWeight: '500',
              color: '#e9d5ff',
              lineHeight: '1.5'
            }}>
              {t[mission.action as keyof typeof t] as string}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
