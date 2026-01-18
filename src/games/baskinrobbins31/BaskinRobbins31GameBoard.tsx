import { useState, useEffect } from 'react';
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

  // 이전 턴에서 말한 숫자 개수 (1, 2, 3 중 하나)
  const previousCount = state?.numbers_in_current_turn?.length || 0;

  // 현재 턴이 나인지 직접 계산
  const isMyTurn = room.status === 'playing' && currentTurnPlayerId === currentPlayerId && myPlayer?.is_alive;

  // 현재 턴에서 클릭한 횟수 (로컬 상태)
  const [clickCount, setClickCount] = useState(0);
  const [tempNumber, setTempNumber] = useState(currentNumber);

  // 턴이 바뀌면 클릭 카운트 초기화
  useEffect(() => {
    setClickCount(0);
    setTempNumber(currentNumber);
  }, [currentTurnPlayerId, currentNumber]);

  const handleNumberClick = () => {
    if (!isMyTurn || clickCount >= 3) return;

    setClickCount(prev => prev + 1);
    setTempNumber(prev => prev + 1);
  };

  const handleConfirm = async () => {
    if (!myPlayer?.is_alive || !isMyTurn || clickCount === 0) return;

    const numbers = Array.from({ length: clickCount }, (_, i) => currentNumber + i + 1);

    await onAction({
      type: 'call_numbers',
      payload: { numbers },
      playerId: currentPlayerId,
      playerName: myPlayer.nickname,
      timestamp: Date.now(),
    });

    // 확정 후 초기화
    setClickCount(0);
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
        <div className="baskinrobbins31-controls">
          <div className="temp-number-display">
            <p className="temp-label">{t.tempNumber}</p>
            <p className="temp-value">{tempNumber}</p>
            <p className="click-count">
              {t.clickedTimes}: {clickCount}/3
            </p>
          </div>

          <div className="action-buttons">
            <button
              className="number-click-button"
              onClick={handleNumberClick}
              disabled={!isMyTurn || clickCount >= 3 || tempNumber >= 31}
            >
              <span className="button-icon">➕</span>
              <span className="button-text">{t.addNumber}</span>
            </button>

            <button
              className="confirm-button"
              onClick={handleConfirm}
              disabled={!isMyTurn || clickCount === 0}
            >
              <span className="button-icon">✓</span>
              <span className="button-text">{t.confirm}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
