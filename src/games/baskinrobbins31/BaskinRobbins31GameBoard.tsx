import { GameBoardProps } from '../common/types';
import { BaskinRobbins31GameState } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';

/**
 * 베스킨라빈스31 게임 보드 컴포넌트
 */
export function BaskinRobbins31GameBoard({
  room,
  players,
  gameState,
  currentPlayerId,
  onAction,
  isMyTurn: _isMyTurn, // 무시하고 직접 계산
}: GameBoardProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const state = gameState as BaskinRobbins31GameState;

  const myPlayer = players.find(p => p.id === currentPlayerId);
  const currentNumber = state?.current_number || 0;
  const currentTurnPlayerId = state?.current_turn_player_id;
  const currentTurnPlayer = players.find(p => p.id === currentTurnPlayerId);

  // 현재 턴이 나인지 직접 계산
  const isMyTurn = room.status === 'playing' && currentTurnPlayerId === currentPlayerId && myPlayer?.is_alive;

  const handleCallNumbers = async (count: 1 | 2 | 3) => {
    if (!myPlayer?.is_alive || !isMyTurn) return;

    const numbers = Array.from({ length: count }, (_, i) => currentNumber + i + 1);

    await onAction({
      type: 'call_numbers',
      payload: { numbers },
      playerId: currentPlayerId,
      playerName: myPlayer.nickname,
      timestamp: Date.now(),
    });
  };

  return (
    <div className="baskinrobbins31-game-area">
      <div className="game-status">
        <div className="status-playing">
          <div className="current-number">
            <span className="number-label">{t.currentNumber}</span>
            <span className="number-value">{currentNumber}</span>
          </div>

          {currentTurnPlayer && (
            <div className="current-turn">
              <p>
                {t.currentTurn}: <strong>{currentTurnPlayer.nickname}</strong>
              </p>
            </div>
          )}

          {myPlayer?.is_alive ? (
            isMyTurn ? (
              <div className="my-turn-notice">
                <p>✨ {t.yourTurn}</p>
              </div>
            ) : (
              <div className="waiting-notice">
                <p>⏳ {t.waitingForTurn}</p>
              </div>
            )
          ) : (
            <div className="eliminated-notice">
              <p>💀 {t.youAreEliminated}</p>
            </div>
          )}
        </div>
      </div>

      {myPlayer?.is_alive && (
        <div className="number-buttons-vertical">
          <button
            className="call-button-rect call-one"
            onClick={() => handleCallNumbers(1)}
            disabled={!isMyTurn}
          >
            <span className="call-number">{currentNumber + 1}</span>
            <span className="call-text">{t.callOne}</span>
          </button>

          <button
            className="call-button-rect call-two"
            onClick={() => handleCallNumbers(2)}
            disabled={!isMyTurn || currentNumber + 2 > 31}
          >
            <span className="call-number">
              {currentNumber + 1}, {currentNumber + 2}
            </span>
            <span className="call-text">{t.callTwo}</span>
          </button>

          <button
            className="call-button-rect call-three"
            onClick={() => handleCallNumbers(3)}
            disabled={!isMyTurn || currentNumber + 3 > 31}
          >
            <span className="call-number">
              {currentNumber + 1}, {currentNumber + 2}, {currentNumber + 3}
            </span>
            <span className="call-text">{t.callThree}</span>
          </button>
        </div>
      )}
    </div>
  );
}
