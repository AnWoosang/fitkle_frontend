import { GameBoardProps } from '../common/types';
import { NunchiGameState } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';
import { AIHostMissionCard } from '../common/AIHostMissionCard';
import { MISSION_POOL } from '../common/aiHostMissionPool';

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
  const isFirstTurn = currentNumber === 0 && state?.turn_count === 0; // 게임 시작 후 아무도 아직 숫자를 외치지 않은 상태
  const isFirstTurnPlayer = state?.first_turn_player_id === currentPlayerId; // 내가 첫 턴 플레이어인지
  const firstTurnPlayer = players.find(p => p.id === state?.first_turn_player_id); // 첫 턴 플레이어 정보

  // 현재 턴의 미션 가져오기 (아직 숫자를 외치지 않은 경우에만)
  const currentMissionId = !hasCalledThisRound && state?.current_mission_id
    ? state.current_mission_id
    : null;
  const myMission = currentMissionId ? MISSION_POOL.find(m => m.id === currentMissionId) : null;

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
      {/* 첫 턴 경고 메시지 */}
      {isFirstTurn && myPlayer?.is_alive && firstTurnPlayer && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: isFirstTurnPlayer ? '#d4edda' : '#fff3cd',
          border: `2px solid ${isFirstTurnPlayer ? '#28a745' : '#ffc107'}`,
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: isFirstTurnPlayer ? '#155724' : '#856404' }}>
            {isFirstTurnPlayer ? (
              <>
                🎯 {language === 'ko' ? `당신이 첫 번째로 1을 외쳐야 합니다! AI 호스트 미션을 완수하고 일어나서 외치세요!` :
                    language === 'en' ? 'You must call 1 first! Complete the AI host mission and stand up!' :
                    language === 'ja' ? 'あなたが最初に1を叫ぶ必要があります！AIホストミッションを完了して立ち上がって叫んでください！' :
                    language === 'zh' ? '你必须第一个喊1！完成AI主持人任务并站起来喊！' :
                    '¡Debes decir 1 primero! ¡Completa la misión del anfitrión de IA y ponte de pie!'}
              </>
            ) : (
              <>
                ⚠️ {language === 'ko' ? `${firstTurnPlayer.nickname}님이 첫 번째로 1을 외쳐야 합니다!` :
                    language === 'en' ? `${firstTurnPlayer.nickname} must call 1 first!` :
                    language === 'ja' ? `${firstTurnPlayer.nickname}さんが最初に1を叫ぶ必要があります！` :
                    language === 'zh' ? `${firstTurnPlayer.nickname}必须第一个喊1！` :
                    `¡${firstTurnPlayer.nickname} debe decir 1 primero!`}
              </>
            )}
          </p>
        </div>
      )}

      {/* AI 호스트 미션 카드 - 아직 숫자를 외치지 않은 경우에만 표시 */}
      {myMission && myPlayer?.is_alive && !hasCalledThisRound && (
        <div style={{ marginBottom: '20px' }}>
          <AIHostMissionCard mission={myMission} language={language} />
        </div>
      )}

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
          disabled={
            !isMyTurn ||
            hasCalledThisRound ||
            (isFirstTurn && !isFirstTurnPlayer) // 첫 턴이고 내가 지정된 플레이어가 아니면 비활성화
          }
        >
          <span className="call-number">{nextNumber}</span>
          <span className="call-text">
            {hasCalledThisRound
              ? t.alreadyCalled
              : (isFirstTurn && !isFirstTurnPlayer)
              ? (language === 'ko' ? '대기 중...' :
                 language === 'en' ? 'Waiting...' :
                 language === 'ja' ? '待機中...' :
                 language === 'zh' ? '等待中...' :
                 'Esperando...')
              : t.callOut}
          </span>
        </button>
      )}
    </div>
  );
}
