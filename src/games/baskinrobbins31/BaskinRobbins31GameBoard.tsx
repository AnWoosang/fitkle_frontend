import { useState, useEffect } from 'react';
import { GameBoardProps } from '../common/types';
import { BaskinRobbins31GameState } from './types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';
import { AIHostMissionCard } from '../common/AIHostMissionCard';
import { CompactAIHostMissionCard } from '../common/CompactAIHostMissionCard';
import { MISSION_POOL } from '../common/aiHostMissionPool';

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
  lastEvent,
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

  // 현재 턴의 미션 가져오기 (모든 플레이어가 볼 수 있음)
  const currentMissionId = state?.current_mission_id
    ? state.current_mission_id
    : null;
  const currentMission = currentMissionId ? MISSION_POOL.find(m => m.id === currentMissionId) : null;

  // 현재 턴에서 클릭한 횟수 (로컬 상태)
  const [clickCount, setClickCount] = useState(0);
  const [tempNumber, setTempNumber] = useState(currentNumber);

  // 미션 표시 상태 (턴이 바뀌면 자동으로 리셋됨)
  const [showMission, setShowMission] = useState(true);

  // 토스트 메시지 상태
  const [toast, setToast] = useState<{
    message: string;
    show: boolean;
  }>({ message: '', show: false });

  // 턴이 바뀌면 클릭 카운트 초기화 및 미션 다시 표시
  useEffect(() => {
    setClickCount(0);
    setTempNumber(currentNumber);
    setShowMission(true); // 턴이 바뀌면 미션 다시 표시
  }, [currentTurnPlayerId, currentNumber]);

  // 브로드캐스트 이벤트 구독 (player_eliminated) - 본인이 탈락했을 때만 메시지 표시
  useEffect(() => {
    if (!lastEvent || lastEvent.type !== 'player_eliminated') return;

    const event = lastEvent;
    // 탈락한 사람이 본인인지 확인
    if (event.player_id !== currentPlayerId) return;

    let message = '';
    if (event.reason === 'same_count_as_previous') {
      // 이전 사람과 같은 개수 선택
      const count = event.previous_count;
      message = language === 'ko' ? `이전 플레이어와 같은 개수(${count}개)를 선택해서 탈락했습니다! 다음엔 다른 개수를 선택하세요.` :
                language === 'en' ? `You were eliminated for choosing the same count (${count}) as the previous player! Choose a different count next time.` :
                language === 'ja' ? `前のプレイヤーと同じ個数(${count}個)を選んで脱落しました！次は違う個数を選んでください。` :
                language === 'zh' ? `你选择了与前一个玩家相同的数量(${count}个)被淘汰了！下次选择不同的数量。` :
                language === 'es' ? `¡Fuiste eliminado por elegir la misma cantidad (${count}) que el jugador anterior! Elige una cantidad diferente la próxima vez.` :
                `Bạn đã bị loại vì chọn cùng số lượng (${count}) với người chơi trước! Hãy chọn số lượng khác lần sau.`;
    } else if (event.reason === 'said_31') {
      // 31을 말함
      message = language === 'ko' ? `31을 말해서 탈락했습니다! 게임을 잘 계산해야 합니다.` :
                language === 'en' ? `You were eliminated for saying 31! You need to calculate better.` :
                language === 'ja' ? `31を言って脱落しました！もっとよく計算する必要があります。` :
                language === 'zh' ? `你说了31被淘汰了！需要更好地计算。` :
                language === 'es' ? `¡Fuiste eliminado por decir 31! Necesitas calcular mejor.` :
                `Bạn đã bị loại vì nói 31! Bạn cần tính toán tốt hơn.`;
    }

    if (message) {
      setToast({ message, show: true });
      // 3초 후 토스트 숨기기
      setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  }, [lastEvent, currentPlayerId, language]);

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
      {/* 토스트 메시지 */}
      {toast.show && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 9999,
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
            color: '#fff',
            padding: '20px 32px',
            borderRadius: '16px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            textAlign: 'center',
            minWidth: '320px',
            maxWidth: '90%',
            border: '3px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          💥 {toast.message}
        </div>
      )}

      {/* AI 호스트 미션 오버레이 - 현재 턴 플레이어에게만 표시 */}
      {currentMission && isMyTurn && showMission && (
        <AIHostMissionCard
          mission={currentMission}
          language={language}
          playerName={myPlayer?.nickname}
          isMyMission={true}
          onClose={() => setShowMission(false)}
        />
      )}


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

      {/* 컴팩트 AI 호스트 미션 카드 - 내 턴일 때만 표시 */}
      {currentMission && isMyTurn && (
        <CompactAIHostMissionCard
          mission={currentMission}
          language={language}
          playerName={myPlayer?.nickname}
          isMyMission={true}
        />
      )}
    </div>
  );
}
