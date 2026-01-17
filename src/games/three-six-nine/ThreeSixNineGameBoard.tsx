import { GameBoardProps } from '../common/types';
import { ThreeSixNineGameState, ThreeSixNineActionType } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';

/**
 * 숫자에서 3, 6, 9의 개수를 세는 함수
 */
function countClaps(num: number): number {
  const str = num.toString();
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    const digit = str[i];
    if (digit === '3' || digit === '6' || digit === '9') {
      count++;
    }
  }

  return count;
}

/**
 * 369 게임 보드 컴포넌트
 */
export function ThreeSixNineGameBoard({
  room,
  players,
  gameState,
  currentPlayerId,
  onAction,
  isMyTurn = true,
}: GameBoardProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const state = gameState as ThreeSixNineGameState;

  const myPlayer = players.find(p => p.id === currentPlayerId);
  const currentNumber = state?.current_number || 0;
  const nextNumber = currentNumber + 1;
  const requiredClaps = countClaps(nextNumber);

  // 현재 턴인 플레이어 찾기
  const alivePlayers = players.filter(p => p.is_alive);
  const currentTurnIndex = currentNumber % alivePlayers.length;
  const currentTurnPlayer = alivePlayers[currentTurnIndex];
  const isMyActualTurn = currentTurnPlayer?.id === currentPlayerId;

  const handleAction = async (actionType: ThreeSixNineActionType) => {
    if (!myPlayer?.is_alive || !isMyActualTurn) return;

    await onAction({
      type: 'player_action',
      payload: { actionType, expectedNumber: nextNumber },
      playerId: currentPlayerId,
      playerName: myPlayer.nickname,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="nunchi-game-area">
      <div className="game-status">
        <div className="status-playing">
          <div className="current-number">
            <span className="number-label">
              {t.currentNumber}
            </span>
            <span className="number-value">{currentNumber}</span>
          </div>

          {myPlayer?.is_alive ? (
            <div className="next-number">
              {isMyActualTurn ? (
                <p style={{ color: '#4caf50', fontWeight: 'bold', marginTop: '8px' }}>
                  🎯 {t.game369YourTurn}
                </p>
              ) : (
                <p style={{ color: '#9e9e9e', fontSize: '0.9em', marginTop: '8px' }}>
                  {currentTurnPlayer?.nickname || ''}{t.game369PlayerTurn}
                </p>
              )}
            </div>
          ) : (
            <div className="eliminated-notice">
              <p>💀 {t.youAreEliminated}</p>
            </div>
          )}
        </div>
      </div>

      {myPlayer?.is_alive && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <button
            className="call-button"
            onClick={() => handleAction('say_number')}
            disabled={!isMyActualTurn}
            style={{
              fontSize: '1.2rem',
              padding: '24px 16px',
              opacity: isMyActualTurn ? 1 : 0.5,
              cursor: isMyActualTurn ? 'pointer' : 'not-allowed',
            }}
          >
            <span className="call-number" style={{ fontSize: '2rem' }}>{nextNumber}</span>
            <span className="call-text" style={{ fontSize: '0.85rem', display: 'block', marginTop: '8px' }}>
              {t.game369SayNumber}
            </span>
          </button>

          <button
            className="call-button"
            onClick={() => handleAction('clap_once')}
            disabled={!isMyActualTurn}
            style={{
              fontSize: '1.5rem',
              padding: '24px 16px',
              opacity: isMyActualTurn ? 1 : 0.5,
              cursor: isMyActualTurn ? 'pointer' : 'not-allowed',
            }}
          >
            <span>👏</span>
            <span style={{ fontSize: '0.85rem', display: 'block', marginTop: '8px' }}>
              {t.game369ClapOnce}
            </span>
          </button>

          <button
            className="call-button"
            onClick={() => handleAction('clap_twice')}
            disabled={!isMyActualTurn}
            style={{
              fontSize: '1.5rem',
              padding: '24px 16px',
              opacity: isMyActualTurn ? 1 : 0.5,
              cursor: isMyActualTurn ? 'pointer' : 'not-allowed',
            }}
          >
            <span>👏👏</span>
            <span style={{ fontSize: '0.85rem', display: 'block', marginTop: '8px' }}>
              {t.game369ClapTwice}
            </span>
          </button>

          <button
            className="call-button"
            onClick={() => handleAction('clap_thrice')}
            disabled={!isMyActualTurn}
            style={{
              fontSize: '1.5rem',
              padding: '24px 16px',
              opacity: isMyActualTurn ? 1 : 0.5,
              cursor: isMyActualTurn ? 'pointer' : 'not-allowed',
            }}
          >
            <span>👏👏👏</span>
            <span style={{ fontSize: '0.85rem', display: 'block', marginTop: '8px' }}>
              {t.game369ClapThrice}
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
