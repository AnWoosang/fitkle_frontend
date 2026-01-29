import { useState, useEffect } from 'react';
import { GameBoardProps } from '../common/types';
import { NunchiGameState } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';

/**
 * 눈치게임 보드 컴포넌트
 */
export function NunchiGameBoard({
  room,
  players,
  gameState,
  currentPlayerId,
  onAction,
  isMyTurn = true,
}: GameBoardProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const state = gameState as NunchiGameState;

  const myPlayer = players.find(p => p.id === currentPlayerId);
  const currentNumber = state?.current_number || 0;
  const nextNumber = currentNumber + 1;
  const hasCalledThisRound = state?.called_player_ids?.includes(currentPlayerId) || false;

  const handleCallNumber = async () => {
    if (!myPlayer?.is_alive || !isMyTurn || hasCalledThisRound) return;

    await onAction({
      type: 'call_number',
      payload: { number: nextNumber },
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
            <span className="number-label">{t.currentNumber}</span>
            <span className="number-value">{currentNumber}</span>
          </div>

          {myPlayer?.is_alive ? (
            <div className="next-number">
              <p>
                {t.nextNumber}: <strong>{nextNumber}</strong>
              </p>
            </div>
          ) : (
            <div className="eliminated-notice">
              <p>💀 {t.youAreEliminated}</p>
            </div>
          )}
        </div>
      </div>

      {myPlayer?.is_alive && (
        <button
          className="call-button"
          onClick={handleCallNumber}
          disabled={!isMyTurn || hasCalledThisRound}
        >
          <span className="call-number">{nextNumber}</span>
          <span className="call-text">
            {hasCalledThisRound ? t.alreadyCalled : t.callOut}
          </span>
        </button>
      )}
    </div>
  );
}
