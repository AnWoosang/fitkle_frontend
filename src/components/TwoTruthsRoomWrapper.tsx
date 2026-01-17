'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PlayerList } from '@/components/PlayerList';
import { GameRulesModal } from '@/components/GameRulesModal';
import { GameResultModal } from '@/components/GameResultModal';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';
import { supabase } from '@/lib/supabase';
import { useTwoTruthsGame } from '@/hooks/useTwoTruthsGame';
import { TwoTruthsGameBoard } from '@/games/two-truths/TwoTruthsGameBoard';
import { GameType } from '@/types/game';

interface TwoTruthsRoomWrapperProps {
  roomCode: string;
  playerId: string;
  playerName: string;
  onLeave: () => void;
}

export function TwoTruthsRoomWrapper({
  roomCode,
  playerId,
  playerName,
  onLeave,
}: TwoTruthsRoomWrapperProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const t = useTranslation(language);

  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  const {
    room,
    players,
    gameStatus,
    currentTurn,
    currentTurnPlayer,
    myStatement,
    currentStatements,
    myVote,
    hasSubmittedStatements,
    hasVoted,
    error,
    isLoading,
    hostLeft,
    connectionStatus,
    submitStatements,
    castVote,
    startGame,
    resetGame,
    toggleReady,
    cleanup,
  } = useTwoTruthsGame({
    roomCode,
    playerId,
    playerName,
  });

  // 방에 입장하면 게임 규칙 모달 표시
  useEffect(() => {
    if (room && gameStatus === 'waiting' && !isLoading && playerName) {
      setShowRulesModal(true);
    }
  }, [room, gameStatus, isLoading, playerName]);

  // 게임 상태에 따라 모달 표시/숨김
  useEffect(() => {
    if (gameStatus === 'playing') {
      setShowRulesModal(false);
      setShowResultModal(false);
    } else if (gameStatus === 'finished') {
      setShowResultModal(true);
      setShowRulesModal(false);
    }
  }, [gameStatus]);

  // 호스트가 방을 나갔을 때 자동 리다이렉트
  useEffect(() => {
    if (hostLeft) {
      const timer = setTimeout(() => {
        cleanup(); // WebSocket 정리
        sessionStorage.removeItem('playerId');
        sessionStorage.removeItem('playerName');
        router.push('/');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hostLeft, router, cleanup]);

  // 방 나가기 핸들러 (WebSocket 정리 포함)
  const handleLeaveWithCleanup = useCallback(() => {
    console.log('🚪 방 나가기 - WebSocket 정리 시작');
    cleanup(); // WebSocket 연결 정리
    onLeave(); // 부모 컴포넌트의 나가기 로직 실행
  }, [cleanup, onLeave]);

  const isHost = room?.host_id === playerId;
  const myPlayer = players.find((p) => p.id === playerId);
  const alivePlayers = players.filter((p) => p.is_alive);
  const nonHostPlayers = players.filter((p) => p.id !== room?.host_id);
  const allPlayersReady = nonHostPlayers.length > 0 && nonHostPlayers.every((p) => p.is_ready);
  const minPlayers = 3;

  // 디버깅: 준비 상태 변화 추적
  useEffect(() => {
    console.log('🔍 준비 상태 디버깅:', {
      language,
      myPlayerId: playerId,
      myPlayerReady: myPlayer?.is_ready,
      readyButtonText: myPlayer?.is_ready ? t.readyButton : t.notReadyButton,
      allPlayers: players.map(p => ({ id: p.id, nickname: p.nickname, is_ready: p.is_ready }))
    });
  }, [myPlayer?.is_ready, language, playerId, players, t.readyButton, t.notReadyButton]);

  // 모든 플레이어가 진술을 제출했는지 확인
  const [allStatementsSubmitted, setAllStatementsSubmitted] = useState(false);

  useEffect(() => {
    if (!room || gameStatus !== 'waiting') return;

    const checkStatements = async () => {
      const { data: statements } = await supabase
        .from('events')
        .select('player_id')
        .eq('room_id', room.id)
        .eq('type', 'statement_submitted');

      const submittedPlayerIds = new Set(statements?.map(s => s.player_id) || []);
      // 호스트를 제외한 모든 플레이어가 제출했는지 확인 (호스트는 게임 시작 시 자동 제출)
      const nonHostPlayers = players.filter(p => p.id !== room?.host_id);
      const allSubmitted = nonHostPlayers.length > 0 && nonHostPlayers.every(p => submittedPlayerIds.has(p.id));
      setAllStatementsSubmitted(allSubmitted);
    };

    checkStatements();

    // players 또는 hasSubmittedStatements가 변경될 때마다 재확인
  }, [room, players, gameStatus, hasSubmittedStatements]);

  const canStart = isHost && gameStatus === 'waiting' && players.length >= minPlayers && allPlayersReady && allStatementsSubmitted;
  const isMyTurnToBeGuessed = currentTurnPlayer?.id === playerId;

  if (isLoading) {
    return (
      <div className="game-room loading">
        <div className="spinner"></div>
        <p>{t.connectingToRoom}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="game-room error">
        <h2>⚠️ {t.error}</h2>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => router.push('/')}>
          {t.backToLobby}
        </button>
      </div>
    );
  }

  if (hostLeft) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>👋 {t.hostLeftTitle}</h2>
          </div>
          <div className="modal-body">
            <p>{t.hostLeftMessage}</p>
            <p className="hint">{t.redirectingToLobby}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="game-room">
      <header className="room-header">
        <div className="room-info">
          <h2>{t.TWO_TRUTHS}</h2>
          <div className="room-code" onClick={() => {
            if (room?.code) {
              navigator.clipboard.writeText(room.code);
              alert(t.codeCopied);
            }
          }} title={t.clickToCopy}>
            {t.roomCode}: <span>{room?.code}</span> 📋
          </div>
          {/* 연결 상태 표시 */}
          {connectionStatus === 'disconnected' && (
            <div style={{
              fontSize: '0.85rem',
              color: '#ff6b6b',
              marginTop: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              ⚠️ 연결 끊김 - 폴링 모드로 동작 중
            </div>
          )}
          {connectionStatus === 'connecting' && (
            <div style={{
              fontSize: '0.85rem',
              color: '#ffa500',
              marginTop: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              🔄 연결 중...
            </div>
          )}
        </div>
        <button className="btn btn-small btn-ghost" onClick={handleLeaveWithCleanup}>
          {t.leaveRoom}
        </button>
      </header>

      <main className="game-content">
        {/* WAITING 상태 */}
        {gameStatus === 'waiting' && (
          <div className="status-waiting">
            <h3>⏳ {t.waitingStatus}</h3>
            {!hasSubmittedStatements ? (
              <p>진술을 작성해주세요!</p>
            ) : (
              <p>{t.waitingForHost}</p>
            )}
            {isHost && players.length < minPlayers && (
              <p className="hint">
                {t.minimumPlayers} ({t.currentPlayers}: {players.length})
              </p>
            )}
          </div>
        )}

        {/* GameBoard - playing 상태에서만 표시 */}
        {gameStatus === 'playing' && (
          <TwoTruthsGameBoard
            players={players}
            currentTurn={currentTurn}
            currentTurnPlayer={currentTurnPlayer}
            currentStatements={currentStatements}
            hasSubmittedStatements={hasSubmittedStatements}
            hasVoted={hasVoted}
            isMyTurnToBeGuessed={isMyTurnToBeGuessed}
            playerId={playerId}
            gameStatus={gameStatus}
            onSubmitStatements={submitStatements}
            onCastVote={castVote}
          />
        )}

        {/* FINISHED 상태 */}
        {gameStatus === 'finished' && (
          <div className="status-finished">
            <h3>🎉 {t.gameOver}</h3>
            {alivePlayers.length > 0 && (
              <>
                <p>{t.winner}: <strong>{alivePlayers[0]?.nickname}</strong></p>
              </>
            )}
          </div>
        )}

        {/* Start game button */}
        {gameStatus === 'waiting' && isHost && hasSubmittedStatements && (
          <button
            className="btn btn-large btn-primary"
            onClick={startGame}
            disabled={!canStart}
          >
            {!canStart
              ? players.length < minPlayers
                ? t.waitingForPlayers
                : '모든 플레이어가 준비될 때까지 기다려주세요'
              : t.startGame}
          </button>
        )}

        {/* Ready button for non-host */}
        {gameStatus === 'waiting' && !isHost && hasSubmittedStatements && (
          <button
            className="btn btn-large btn-primary"
            onClick={toggleReady}
          >
            {myPlayer?.is_ready ? t.readyButton : t.notReadyButton}
          </button>
        )}
      </main>

      {/* Player list */}
      <aside className="players-sidebar">
        <PlayerList
          players={players}
          currentPlayerId={playerId}
          hostId={room?.host_id || ''}
          gameStatus={gameStatus}
        />
        <div className="player-count">
          {gameStatus === 'playing' && (
            <span>{t.alive}: {alivePlayers.length} / {players.length}</span>
          )}
          {gameStatus === 'waiting' && (
            <span>{t.participants}: {players.length}</span>
          )}
        </div>
      </aside>

      {/* 게임 규칙 모달 */}
      {showRulesModal && (
        <GameRulesModal
          isHost={isHost}
          onReady={toggleReady}
          onStart={startGame}
          canStart={canStart}
          isReady={myPlayer?.is_ready || false}
          roomCode={room?.code}
          onLeave={handleLeaveWithCleanup}
          gameType={GameType.TWO_TRUTHS}
          hasSubmittedStatements={hasSubmittedStatements}
          onSubmitStatements={submitStatements}
          myStatement={myStatement}
        />
      )}

      {/* 게임 결과 모달 */}
      {showResultModal && (
        <GameResultModal
          players={players}
          currentPlayerId={playerId}
          onLeave={handleLeaveWithCleanup}
        />
      )}
    </div>
  );
}
