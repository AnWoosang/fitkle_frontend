'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PlayerList } from '@/components/PlayerList';
import { GameRulesModal } from '@/components/GameRulesModal';
import { GameResultModal } from '@/components/GameResultModal';
import { NicknameModal } from '@/components/NicknameModal';
import { HostSelectingGameModal } from '@/components/HostSelectingGameModal';
import { GameCountdown } from '@/components/GameCountdown';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslation } from '@/i18n/translations';
import { supabase } from '@/lib/supabase';
import { getGame } from '@/games/registry';
import { useGameEngine } from '@/games/common/useGameEngine';
import { GameType, Room } from '@/types/game';
import { TwoTruthsRoomWrapper } from '@/components/TwoTruthsRoomWrapper';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const t = useTranslation(language);

  const code = params?.code as string;
  const [gameType, setGameType] = useState<GameType | null>(null);

  // playerId를 동기적으로 초기화
  const [playerId] = useState<string>(() => {
    if (typeof window === 'undefined') return 'loading';

    let id = sessionStorage.getItem('playerId');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('playerId', id);
    }
    return id;
  });

  const [playerName, setPlayerName] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    return sessionStorage.getItem('playerName') || '';
  });

  const [showNicknameModal, setShowNicknameModal] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem('playerName');
  });

  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);

  // 페이지 마운트 시 playerName 상태 강제 재검증 (레이스 컨디션 방지)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedName = sessionStorage.getItem('playerName');
    if (!storedName && !showNicknameModal) {
      console.log('⚠️ playerName이 없는데 닉네임 모달이 닫혀있음 - 강제 열기');
      setShowNicknameModal(true);
    }
  }, []);

  // 게임 타입 가져오기 및 실시간 구독
  useEffect(() => {
    const fetchGameType = async () => {
      // @ts-ignore
      const { data: room } = await supabase
        .from('rooms')
        .select('game_type')
        .eq('code', code)
        .single();

      if (room?.game_type) {
        console.log('🎮 게임 타입 설정:', room.game_type);
        setGameType(room.game_type as GameType);

        // INFO_ONLY 게임인 경우 규칙 페이지로 리다이렉트
        const gameMetadata = require('@/types/game').GAME_REGISTRY[room.game_type];
        if (gameMetadata?.implementationType === 'INFO_ONLY') {
          console.log('📖 INFO_ONLY 게임 감지 - 규칙 페이지로 이동');
          router.push(`/room/${code}/rules`);
          return;
        }
      }
    };

    fetchGameType();

    // 실시간으로 게임 타입 및 카운트다운 변경 감지
    const channel = supabase
      .channel(`room-game-type-${code}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `code=eq.${code}`,
        },
        (payload: any) => {
          console.log('🔄 방 업데이트 감지:', payload);

          // game_type이 null로 변경된 경우 (게임 선택 모드)
          if (payload.new?.game_type === null) {
            console.log('🎮 게임 타입이 null로 변경됨 - 게임 선택 모드');
            setGameType(null);
          } else if (payload.new?.game_type) {
            console.log('🎮 게임 타입 변경됨:', payload.new.game_type);
            setGameType(payload.new.game_type as GameType);

            // INFO_ONLY 게임인 경우 규칙 페이지로 리다이렉트
            const gameMetadata = require('@/types/game').GAME_REGISTRY[payload.new.game_type];
            if (gameMetadata?.implementationType === 'INFO_ONLY') {
              console.log('📖 INFO_ONLY 게임 감지 - 규칙 페이지로 이동');
              router.push(`/room/${code}/rules`);
              return;
            }
          }
          // 카운트다운 시작 감지 (게임이 이미 playing 상태이므로 모달은 자동으로 닫힘)
          if (payload.new?.countdown_started_at && !payload.old?.countdown_started_at) {
            console.log('⏱️  카운트다운 시작 감지!');
            // 게임 화면 위에 카운트다운 오버레이 표시
            setShowCountdown(true);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [code, router]);

  // 게임 엔트리 가져오기
  const gameEntry = gameType ? getGame(gameType) : null;
  const game = gameEntry?.game;
  const GameBoard = gameEntry?.components.GameBoard;

  // 게임 엔진 사용 (Two Truths는 자체 hook 사용하므로 제외)
  const {
    room,
    players,
    gameState,
    gameStatus,
    error,
    isLoading,
    hostLeft,
    performAction,
    startGame,
    resetGame,
    toggleReady,
    cleanup,
  } = useGameEngine({
    game: gameType === GameType.TWO_TRUTHS ? null : (game || null),
    roomCode: code || '',
    playerId: playerId,
    playerName: playerName,
  });

  // 방에 입장하면 게임 규칙 모달 표시
  useEffect(() => {
    if (room && gameStatus === 'waiting' && !isLoading && playerName && !showNicknameModal) {
      setShowRulesModal(true);
    }
  }, [room, gameStatus, isLoading, playerName, showNicknameModal]);

  // 게임 상태에 따라 모달 표시/숨김
  useEffect(() => {
    console.log('🎮 게임 상태 변경:', gameStatus);

    if (gameStatus === 'game_selection') {
      // 게임 선택 모드일 때는 모든 게임 모달 즉시 닫기
      console.log('📋 게임 선택 모드 - 모든 모달 닫기');
      setShowResultModal(false);
      setShowRulesModal(false);
    } else if (gameStatus === 'playing') {
      setShowRulesModal(false);
      setShowResultModal(false);
    } else if (gameStatus === 'finished') {
      setShowResultModal(true);
      setShowRulesModal(false);
    } else if (gameStatus === 'waiting') {
      // 대기 상태로 돌아오면 결과 모달 닫기
      setShowResultModal(false);
      // 규칙 모달은 waiting 상태일 때 표시
      if (room && !isLoading && playerName && !showNicknameModal) {
        setShowRulesModal(true);
      }
    }
  }, [gameStatus, room, isLoading, playerName, showNicknameModal]);

  // 호스트가 방을 나갔을 때 자동 리다이렉트
  useEffect(() => {
    if (hostLeft) {
      const timer = setTimeout(() => {
        if (cleanup) {
          cleanup(); // WebSocket 정리
        }
        sessionStorage.removeItem('playerId');
        sessionStorage.removeItem('playerName');
        router.push('/');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hostLeft, router, cleanup]);

  // 닉네임 제출 핸들러
  const handleNicknameSubmit = async (nickname: string) => {
    if (!playerId) return;

    setPlayerName(nickname);
    sessionStorage.setItem('playerName', nickname);

    try {
      // room이 없으면 직접 로드 (TWO_TRUTHS의 경우)
      let roomId = room?.id;
      if (!roomId) {
        // @ts-ignore
        const { data: roomData } = await supabase
          .from('rooms')
          .select('id')
          .eq('code', code)
          .single();

        if (!roomData) {
          console.error('방을 찾을 수 없습니다.');
          return;
        }
        roomId = roomData.id;
      }

      // 이미 DB에 존재하는 플레이어인지 확인
      // @ts-ignore
      const { data: existingPlayer } = await supabase
        .from('players')
        .select('id')
        .eq('id', playerId)
        .single();

      if (existingPlayer) {
        // 이미 존재하면 닉네임만 업데이트
        // @ts-ignore
        await supabase
          .from('players')
          .update({ nickname: nickname })
          .eq('id', playerId);
      } else {
        // 새 플레이어 생성
        // @ts-ignore
        await supabase.from('players').insert({
          id: playerId,
          room_id: roomId,
          nickname: nickname,
          is_alive: true,
          is_ready: false,
          score: 0,
        });
      }

      setShowNicknameModal(false);
    } catch (err) {
      console.error('플레이어 생성 실패:', err);
    }
  };

  const handleRestartGame = async () => {
    try {
      if (!room) return;

      console.log('🔄 게임 다시 시작 - 게임 선택 모드로 전환');

      // 방 상태를 game_selection으로 변경
      // @ts-ignore
      await supabase
        .from('rooms')
        .update({
          status: 'game_selection',
        })
        .eq('id', room.id);

      // 모든 플레이어 초기화
      // @ts-ignore
      await supabase
        .from('players')
        .update({
          is_alive: true,
          is_ready: false,
          score: 0,
          turn_order: null,
        })
        .eq('room_id', room.id);

      // 게임 상태 삭제
      // @ts-ignore
      await supabase
        .from('game_states')
        .delete()
        .eq('room_id', room.id);

      // 이벤트 삭제 (새 게임을 위해)
      // @ts-ignore
      await supabase
        .from('events')
        .delete()
        .eq('room_id', room.id);

      // 호스트는 게임 선택 페이지로 이동
      router.push(`/room/${code}/select-game`);
    } catch (err) {
      console.error('게임 재시작 실패:', err);
    }
  };

  const handleStartGame = async () => {
    // 눈치게임인 경우 카운트다운 표시
    if (gameType === GameType.NUNCHI) {
      // 1. 게임을 시작하여 게임 상태를 'playing'으로 변경 (모달이 자동으로 닫히고 게임 렌더링됨)
      await startGame();

      // 2. 게임이 렌더링된 후 Supabase에 카운트다운 시작 시간 저장 (모든 클라이언트에게 동기화)
      const { error } = await supabase
        .from('rooms')
        .update({ countdown_started_at: new Date().toISOString() } as any)
        .eq('code', code);

      if (error) {
        console.error('❌ 카운트다운 시작 업데이트 실패:', error);
      } else {
        console.log('✅ 카운트다운 시작 시간 업데이트 완료');
      }

      // 3. 호스트도 카운트다운 표시 (게임 화면 위에 오버레이)
      setShowCountdown(true);
    } else {
      // 다른 게임은 바로 시작
      await startGame();
    }
  };

  const handleCountdownComplete = async () => {
    setShowCountdown(false);

    // 카운트다운 완료 후 countdown_started_at 리셋 (다음 게임을 위해)
    await supabase
      .from('rooms')
      .update({ countdown_started_at: null } as any)
      .eq('code', code);

    // 게임은 이미 시작된 상태이므로 startGame() 호출하지 않음
  };

  const handleLeaveRoom = async () => {
    try {
      console.log('🚪 방 나가기 - WebSocket 정리 시작');

      // WebSocket 연결 정리 (useGameEngine 사용 시)
      if (gameType !== GameType.TWO_TRUTHS && cleanup) {
        cleanup();
      }

      // room이 없으면 직접 로드 (TWO_TRUTHS의 경우)
      let roomData = room;
      if (!roomData) {
        // @ts-ignore
        const { data } = await supabase
          .from('rooms')
          .select('*')
          .eq('code', code)
          .single();

        if (!data) {
          console.error('방을 찾을 수 없습니다.');
          // 방을 못 찾아도 세션 정리하고 홈으로
          sessionStorage.removeItem('playerId');
          sessionStorage.removeItem('playerName');
          router.push('/');
          return;
        }
        roomData = data as Room;
      }

      const isHost = roomData.host_id === playerId;

      if (isHost) {
        // @ts-ignore
        await supabase
          .from('rooms')
          .update({ is_deleted: true })
          .eq('id', roomData.id);
      }

      // @ts-ignore
      await supabase
        .from('players')
        .delete()
        .eq('id', playerId);

      sessionStorage.removeItem('playerId');
      sessionStorage.removeItem('playerName');
      router.push('/');
    } catch (err) {
      console.error('방 나가기 실패:', err);
      // 에러가 발생해도 세션 정리하고 홈으로
      sessionStorage.removeItem('playerId');
      sessionStorage.removeItem('playerName');
      router.push('/');
    }
  };

  // 게임 선택 모드일 때는 일반 페이지에서 처리
  if (gameStatus !== 'game_selection') {
    // Two Truths 게임은 별도 wrapper 사용
    if (gameType === GameType.TWO_TRUTHS && playerName) {
      return (
        <>
          {showNicknameModal && (
            <NicknameModal onSubmit={handleNicknameSubmit} />
          )}
          {!showNicknameModal && (
            <TwoTruthsRoomWrapper
              roomCode={code}
              playerId={playerId}
              playerName={playerName}
              onLeave={handleLeaveRoom}
            />
          )}
        </>
      );
    }
  }

  const isHost = room?.host_id === playerId;
  const myPlayer = players.find((p) => p.id === playerId);
  const alivePlayers = players.filter((p) => p.is_alive);
  const nonHostPlayers = players.filter((p) => p.id !== room?.host_id);
  const allPlayersReady = nonHostPlayers.length > 0 && nonHostPlayers.every((p) => p.is_ready);
  const minPlayers = game?.minPlayers || 3;
  const canStart = isHost && gameStatus === 'waiting' && players.length >= minPlayers && allPlayersReady;

  // 게임 선택 모드일 때
  if (gameStatus === 'game_selection') {
    if (isHost) {
      // 호스트는 이미 게임 선택 페이지로 리다이렉트됨
      return null;
    } else {
      // 플레이어는 호스트가 게임을 선택할 때까지 대기
      return <HostSelectingGameModal />;
    }
  }

  if (isLoading || !gameType || !game || !GameBoard) {
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
          <h2>{game.name[language] || game.name.ko}</h2>
          <div className="room-code" onClick={() => {
            if (room?.code) {
              navigator.clipboard.writeText(room.code);
              alert(t.codeCopied);
            }
          }} title={t.clickToCopy}>
            {t.roomCode}: <span>{room?.code}</span> 📋
          </div>
        </div>
        <button className="btn btn-small btn-ghost" onClick={handleLeaveRoom}>
          {t.leaveRoom}
        </button>
      </header>

      <main className="game-content">
        {/* WAITING 상태 */}
        {gameStatus === 'waiting' && (
          <div className="status-waiting">
            <h3>⏳ {t.waitingStatus}</h3>
            <p>{t.waitingForHost}</p>
            {isHost && players.length < minPlayers && (
              <p className="hint">
                {t.minimumPlayers} ({t.currentPlayers}: {players.length})
              </p>
            )}
          </div>
        )}

        {/* PLAYING 상태 - 동적 게임 보드 */}
        {gameStatus === 'playing' && room && (
          <>
            <GameBoard
              room={room}
              players={players}
              gameState={gameState}
              currentPlayerId={playerId}
              onAction={performAction}
              isMyTurn={true}
            />
          </>
        )}

        {/* FINISHED 상태 */}
        {gameStatus === 'finished' && (
          <div className="status-finished">
            <h3>🎉 {t.gameOver}</h3>
            <p>{t.allEliminated}</p>
            <p className="hint">{t.noWinners}</p>
          </div>
        )}

        {/* Start game button */}
        {gameStatus === 'waiting' && isHost && (
          <button
            className="btn btn-large btn-primary"
            onClick={handleStartGame}
            disabled={!canStart}
          >
            {players.length < minPlayers ? t.waitingForPlayers : t.startGame}
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

      {/* 닉네임 입력 모달 */}
      {showNicknameModal && (
        <NicknameModal onSubmit={handleNicknameSubmit} />
      )}

      {/* 게임 규칙 모달 */}
      {showRulesModal && (
        <GameRulesModal
          isHost={isHost}
          onReady={toggleReady}
          onStart={handleStartGame}
          canStart={canStart}
          isReady={myPlayer?.is_ready || false}
          roomCode={room?.code}
          onLeave={handleLeaveRoom}
          gameType={gameType}
        />
      )}

      {/* 게임 결과 모달 */}
      {showResultModal && (
        <GameResultModal
          players={players}
          currentPlayerId={playerId}
          isHost={isHost}
          onRestart={handleRestartGame}
          onLeave={handleLeaveRoom}
        />
      )}

      {/* 게임 시작 카운트다운 */}
      {showCountdown && (
        <GameCountdown onComplete={handleCountdownComplete} />
      )}
    </div>
  );
}
