import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import type { Room, Player } from '@/types/game';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { IGame, GameAction } from './types';

interface UseGameEngineProps {
  roomCode: string;
  playerId: string;
  playerName: string;
  game: IGame | null;
}

interface UseGameEngineReturn<TState = any> {
  room: Room | null;
  players: Player[];
  gameState: TState | null;
  gameStatus: 'waiting' | 'playing' | 'finished' | 'game_selection';
  error: string | null;
  isLoading: boolean;
  hostLeft: boolean;
  performAction: (action: GameAction) => Promise<void>;
  startGame: () => Promise<void>;
  resetGame: () => Promise<void>;
  toggleReady: () => Promise<void>;
  cleanup: () => void;
}

/**
 * 공통 게임 엔진 훅
 * 모든 게임에서 공통으로 사용하는 로직을 처리
 */
export function useGameEngine<TState = any>({
  roomCode,
  playerId,
  playerName,
  game,
}: UseGameEngineProps): UseGameEngineReturn<TState> {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameState, setGameState] = useState<TState | null>(null);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished' | 'game_selection'>('waiting');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hostLeft, setHostLeft] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const loadPlayersTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 방 정보 로드
  const loadRoom = useCallback(async () => {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('code', roomCode)
      .single();

    if (error) {
      setError('방을 찾을 수 없습니다.');
      return null;
    }

    const roomData = data as Room & { is_deleted?: boolean };
    if (roomData.is_deleted) {
      setHostLeft(true);
      return null;
    }

    setRoom(roomData);
    setGameStatus(roomData.status as any);
    return roomData;
  }, [roomCode]);

  // 플레이어 목록 로드
  const loadPlayers = useCallback(async (roomId: string) => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('room_id', roomId)
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('플레이어 로드 실패:', error);
      return;
    }

    setPlayers(data || []);
  }, []);

  // Debounced loadPlayers - 중복 호출 방지
  const debouncedLoadPlayers = useCallback((roomId: string) => {
    // Clear existing timeout
    if (loadPlayersTimeoutRef.current) {
      clearTimeout(loadPlayersTimeoutRef.current);
    }

    // Set new timeout
    loadPlayersTimeoutRef.current = setTimeout(() => {
      loadPlayers(roomId);
    }, 50); // 50ms debounce
  }, [loadPlayers]);

  // 게임 상태 로드
  const loadGameState = useCallback(async (roomId: string) => {
    if (!game) {
      // game이 null이면 조용히 리턴 (TWO_TRUTHS처럼 자체 hook을 사용하는 경우)
      return;
    }

    try {
      const { data, error } = await supabase
        .from('game_states')
        .select('*')
        .eq('room_id', roomId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('게임 상태 로드 실패:', error);
        // 에러가 발생해도 초기 상태로 계속 진행
        const initialState = game.createInitialState();
        setGameState(initialState);
        return;
      }

      if (data) {
        setGameState(data.state as TState);
      } else {
        // 게임 상태가 없으면 초기 상태 생성
        const initialState = game.createInitialState();
        setGameState(initialState);

        // DB에 저장 시도 (실패해도 무시)
        try {
          await supabase.from('game_states').insert({
            room_id: roomId,
            state: initialState,
          });
        } catch (insertError) {
          console.warn('게임 상태 저장 실패 (무시):', insertError);
        }
      }
    } catch (err) {
      console.error('게임 상태 로드 중 예외 발생:', err);
      // 예외 발생 시에도 초기 상태로 계속
      const initialState = game.createInitialState();
      setGameState(initialState);
    }
  }, [game]);

  // 게임 시작
  const startGame = useCallback(async () => {
    if (!room || !gameState || !game) return;

    const canStart = game.canStart(players, gameState);
    if (!canStart) {
      alert(`게임을 시작할 수 없습니다. 최소 ${game.minPlayers}명이 필요합니다.`);
      return;
    }

    const newState = game.onStart(players, gameState);

    // 게임 상태 업데이트
    await supabase.from('game_states').update({ state: newState }).eq('room_id', room.id);

    // 방 상태 업데이트
    await supabase.from('rooms').update({ status: 'playing' }).eq('id', room.id);

    // 플레이어 상태 초기화
    await supabase.from('players').update({ is_alive: true, is_ready: false }).eq('room_id', room.id);

    // 브로드캐스트
    channelRef.current?.send({
      type: 'broadcast',
      event: 'game_start',
      payload: { type: 'game_start' },
    });
  }, [room, players, gameState, game]);

  // 게임 리셋
  const resetGame = useCallback(async () => {
    if (!room || !game) return;

    const newState = game.onReset(players);

    await supabase.from('game_states').update({ state: newState }).eq('room_id', room.id);
    await supabase.from('players').update({ is_alive: true, is_ready: false }).eq('room_id', room.id);
    await supabase.from('rooms').update({ status: 'waiting' }).eq('id', room.id);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'game_reset',
      payload: { type: 'game_reset' },
    });
  }, [room, players, game]);

  // 준비 상태 토글
  const toggleReady = useCallback(async () => {
    if (!room) return;

    const myPlayer = players.find((p) => p.id === playerId);
    if (!myPlayer) return;

    const newReadyState = !myPlayer.is_ready;

    // Optimistic Update for immediate UI feedback
    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === playerId ? { ...p, is_ready: newReadyState } : p
      )
    );

    // Update database
    const { error } = await supabase
      .from('players')
      .update({ is_ready: newReadyState })
      .eq('id', playerId);

    if (error) {
      console.error('❌ Ready 상태 업데이트 실패:', error);
      // Rollback optimistic update on error
      setPlayers(prevPlayers =>
        prevPlayers.map(p =>
          p.id === playerId ? { ...p, is_ready: !newReadyState } : p
        )
      );
      return;
    }

    // Immediately refetch to ensure consistency (postgres_changes will also trigger)
    await loadPlayers(room.id);
  }, [room, players, playerId, playerName, loadPlayers]);

  // 게임 액션 수행
  const performAction = useCallback(async (action: GameAction) => {
    if (!room || !gameState || gameStatus !== 'playing' || !game) return;

    try {
      // 게임별 로직 처리
      const result = game.handleEvent(action, players, gameState);

      // 게임 상태 업데이트
      await supabase.from('game_states').update({ state: result.newState }).eq('room_id', room.id);

      // 플레이어 상태 업데이트 (모두 병렬로 실행하고 완료 대기)
      if (result.updatedPlayers) {
        const updatePromises = result.updatedPlayers
          .filter(playerUpdate => playerUpdate.id)
          .map(playerUpdate =>
            supabase.from('players').update(playerUpdate).eq('id', playerUpdate.id!)
          );

        await Promise.all(updatePromises);
        console.log('✅ All player updates completed');
      }

      // 이벤트 기록
      await supabase.from('events').insert({
        room_id: room.id,
        type: action.type,
        player_id: action.playerId,
        player_name: action.playerName,
      });

      // 브로드캐스트
      if (result.broadcastEvent) {
        const eventType = result.broadcastEvent.type || action.type;
        console.log('📡 Broadcasting event:', eventType, result.broadcastEvent);
        channelRef.current?.send({
          type: 'broadcast',
          event: eventType,
          payload: result.broadcastEvent,
        });
      }

      // 플레이어 상태를 다시 로드한 후 게임 종료 확인
      const { data: updatedPlayers } = await supabase
        .from('players')
        .select('*')
        .eq('room_id', room.id)
        .order('joined_at', { ascending: true });

      console.log('📊 Reloaded players after update:', {
        total: updatedPlayers?.length,
        alive: updatedPlayers?.filter(p => p.is_alive).length,
        dead: updatedPlayers?.filter(p => !p.is_alive).length
      });

      if (updatedPlayers) {
        const isGameEnd = game.checkGameEnd(updatedPlayers, result.newState);
        console.log('🎮 게임 종료 체크:', {
          isGameEnd,
          alivePlayers: updatedPlayers.filter(p => p.is_alive).length,
          totalPlayers: updatedPlayers.length
        });

        if (isGameEnd) {
          console.log('🎉 게임 종료! game_end 이벤트 발행');
          await supabase.from('rooms').update({ status: 'finished' }).eq('id', room.id);

          channelRef.current?.send({
            type: 'broadcast',
            event: 'game_end',
            payload: { type: 'game_end' },
          });
        }
      }
    } catch (err) {
      console.error('액션 수행 실패:', err);
      setError('액션 수행에 실패했습니다.');
    }
  }, [room, players, gameState, gameStatus, game]);

  // 초기화 및 구독 설정
  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        // game이 null이면 초기화하지 않음 (TWO_TRUTHS 등 자체 hook 사용)
        if (!game) {
          setIsLoading(false);
          return;
        }

        const roomData = await loadRoom();
        if (!roomData || !mounted) return;

        await Promise.all([
          loadPlayers(roomData.id),
          loadGameState(roomData.id),
        ]);

        // Realtime 구독
        const channel = supabase.channel(`room:${roomData.id}`, {
          config: { broadcast: { self: true } },
        });

        // 방 변경사항 구독
        channel.on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'rooms', filter: `id=eq.${roomData.id}` },
          (payload) => {
            if (mounted) {
              const newRoom = payload.new as Room & { is_deleted?: boolean };
              if (newRoom.is_deleted) {
                setHostLeft(true);
              } else {
                setRoom(newRoom);
                setGameStatus(newRoom.status);
              }
            }
          }
        );

        // 플레이어 변경사항 구독 (debounced로 중복 호출 방지)
        channel.on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'players', filter: `room_id=eq.${roomData.id}` },
          () => {
            if (mounted) {
              console.log('👥 Players 테이블 변경 감지 - debounced 리프레시');
              debouncedLoadPlayers(roomData.id);
            }
          }
        );

        // 게임 상태 변경사항 구독
        channel.on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'game_states', filter: `room_id=eq.${roomData.id}` },
          (payload) => {
            if (mounted) {
              const newState = (payload.new as any).state as TState;
              setGameState(newState);
            }
          }
        );

        // 브로드캐스트 이벤트 구독
        channel.on('broadcast', { event: '*' }, (payload) => {
          if (mounted) {
            console.log('Broadcast event:', payload);
          }
        });

        // game_start 이벤트 구독
        channel.on('broadcast', { event: 'game_start' }, () => {
          if (mounted) {
            console.log('🎮 Game started!');
            setGameStatus('playing');
            loadRoom();
            loadPlayers(roomData.id);
          }
        });

        // game_reset 이벤트 구독
        channel.on('broadcast', { event: 'game_reset' }, () => {
          if (mounted) {
            console.log('🔄 Game reset!');
            setGameStatus('waiting');
            loadRoom();
            loadPlayers(roomData.id);
            if (room) {
              loadGameState(room.id);
            }
          }
        });

        // game_end 이벤트 구독
        channel.on('broadcast', { event: 'game_end' }, () => {
          if (mounted) {
            console.log('🎉 Game ended!');
            setGameStatus('finished');
            loadRoom();
            loadPlayers(roomData.id);
          }
        });

        // player_ready broadcast는 제거 - postgres_changes만 사용하여 레이스 컨디션 방지

        // player_eliminated 이벤트 구독
        channel.on('broadcast', { event: 'player_eliminated' }, (payload: any) => {
          if (mounted && roomData) {
            console.log('💀 Player eliminated:', payload.payload);
            loadPlayers(roomData.id);
          }
        });

        await channel.subscribe();
        channelRef.current = channel;

        setIsLoading(false);
      } catch (err) {
        console.error('초기화 실패:', err);
        setError('방 로드에 실패했습니다.');
        setIsLoading(false);
      }
    };

    initialize();

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
      // Cleanup debounce timeout
      if (loadPlayersTimeoutRef.current) {
        clearTimeout(loadPlayersTimeoutRef.current);
      }
    };
  }, [roomCode, game, loadRoom, loadPlayers, loadGameState, debouncedLoadPlayers]);

  // game이 로드되면 게임 상태 다시 로드
  useEffect(() => {
    if (game && room && !gameState) {
      loadGameState(room.id);
    }
  }, [game, room, gameState, loadGameState]);

  // WebSocket 연결 정리 함수
  const cleanup = useCallback(() => {
    console.log('🧹 WebSocket 연결 정리 시작');

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    console.log('✅ WebSocket 연결 정리 완료');
  }, []);

  return {
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
  };
}
