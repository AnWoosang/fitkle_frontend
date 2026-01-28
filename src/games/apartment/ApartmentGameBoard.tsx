import { GameBoardProps } from '../common/types';
import { ApartmentGameState } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';

/**
 * 아파트 게임 보드 컴포넌트
 */
export function ApartmentGameBoard({
  room,
  players,
  gameState,
  currentPlayerId,
  onAction,
  isMyTurn = true,
}: GameBoardProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const state = gameState as ApartmentGameState;

  const myPlayer = players.find(p => p.id === currentPlayerId);

  const handleDefeat = async () => {
    if (!myPlayer?.is_alive || !isMyTurn) return;

    await onAction({
      type: 'declare_defeat',
      payload: {},
      playerId: currentPlayerId,
      playerName: myPlayer.nickname,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="nunchi-game-area">
      <div className="game-status">
        <div className="status-playing">
          <div className="rules-display" style={{
            padding: '24px',
            background: '#1e293b',
            borderRadius: '12px',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '1.2rem' }}>{t.apartmentRulesTitle}</h3>
            <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>{t.apartmentRule1}</li>
              <li>{t.apartmentRule2}</li>
              <li>{t.apartmentRule3}</li>
              <li>{t.apartmentRule4}</li>
              <li>{t.apartmentRule5}</li>
              <li style={{ color: '#f87171', fontWeight: 'bold' }}>{t.apartmentRule6}</li>
            </ul>

            <div style={{
              marginTop: '20px',
              padding: '12px',
              background: '#334155',
              borderRadius: '8px'
            }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '0.95rem' }}>
                {t.apartmentExampleTitle}
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '0.9rem' }}>
                <li>{t.apartmentExample1}</li>
                <li>{t.apartmentExample2}</li>
                <li>{t.apartmentExample3}</li>
              </ul>
            </div>
          </div>

          {myPlayer?.is_alive ? (
            <div style={{ textAlign: 'center', marginTop: '24px' }}>
              <p style={{ marginBottom: '16px', fontSize: '1.1rem', color: '#94a3b8' }}>
                {t.apartmentGameInProgress}
              </p>
            </div>
          ) : (
            <div className="eliminated-notice">
              <p>{t.apartmentYouAreEliminated}</p>
            </div>
          )}
        </div>
      </div>

      {myPlayer?.is_alive && (
        <div style={{ marginTop: '24px' }}>
          <button
            className="call-button"
            onClick={handleDefeat}
            disabled={!isMyTurn}
            style={{
              width: '100%',
              background: isMyTurn
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(107, 114, 128, 0.08)',
              border: isMyTurn
                ? '1.5px solid rgba(239, 68, 68, 0.4)'
                : '1.5px solid rgba(107, 114, 128, 0.2)',
              color: isMyTurn ? '#ef4444' : '#6b7280',
              boxShadow: 'none',
              padding: '14px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: isMyTurn ? 'pointer' : 'not-allowed',
              opacity: isMyTurn ? 1 : 0.5,
              transition: 'all 0.2s ease',
              borderRadius: '8px'
            }}
            onMouseEnter={(e) => {
              if (isMyTurn) {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.18)';
                e.currentTarget.style.border = '1.5px solid rgba(239, 68, 68, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (isMyTurn) {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
                e.currentTarget.style.border = '1.5px solid rgba(239, 68, 68, 0.4)';
              }
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              ✕ {t.apartmentDefeat}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
