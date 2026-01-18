import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Room, Player, GameBroadcastEvent, PlayerPresence } from '../types/game';
import type { RealtimeChannel } from '@supabase/supabase-js';

const COLLISION_THRESHOLD_MS = 500;

interface UseNunchiGameProps {
  roomCode: string;
  playerId: string;
  playerName: string;
}

interface UseNunchiGameReturn {
  room: Room | null;
  players: Player[];
  currentNumber: number;
  isMyTurn: boolean;
  gameStatus: 'waiting' | 'playing' | 'finished' | 'game_selection';
  lastEvent: GameBroadcastEvent | null;
  error: string | null;
  isLoading: boolean;
  hostLeft: boolean;
  callNumber: () => Promise<void>;
  startGame: () => Promise<void>;
  resetGame: () => Promise<void>;
  toggleReady: () => Promise<void>;
  presenceState: Record<string, PlayerPresence[]>;
}

export function useNunchiGame({
  roomCode,
  playerId,
  playerName,
}: UseNunchiGameProps): UseNunchiGameReturn {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentNumber, setCurrentNumber] = useState(0);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'finished' | 'game_selection'>('waiting');
  const [lastEvent, setLastEvent] = useState<GameBroadcastEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hostLeft, setHostLeft] = useState(false);
  const [presenceState, setPresenceState] = useState<Record<string, PlayerPresence[]>>({});
  const [hasCalledThisRound, setHasCalledThisRound] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);
  const pendingCallRef = useRef<{ number: number; timestamp: number } | null>(null);

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

    // 삭제된 방인지 체크
    const roomData = data as Room & { is_deleted?: boolean };
    if (roomData.is_deleted) {
      setHostLeft(true);
      return null;
    }

    setRoom(roomData);
    setCurrentNumber(roomData.current_number);
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

  // 숫자 부르기
  const callNumber = useCallback(async () => {
    if (!room || gameStatus !== 'playing') return;

    const myPlayer = players.find((p) => p.id === playerId);
    if (!myPlayer?.is_alive || hasCalledThisRound) return;

    const nextNumber = currentNumber + 1;
    const timestamp = Date.now();

    // 버튼 비활성화
    setHasCalledThisRound(true);

    pendingCallRef.current = { number: nextNumber, timestamp };

    const event: GameBroadcastEvent = {
      type: 'number_called',
      player_id: playerId,
      player_name: playerName,
      number: nextNumber,
      timestamp,
    };

    // Broadcast
    channelRef.current?.send({
      type: 'broadcast',
      event: 'number_called',
      payload: event,
    });

    // events 테이블에 기록
    await supabase.from('events').insert({
      room_id: room.id,
      type: 'number_called',
      player_id: playerId,
      player_name: playerName,
      number: nextNumber,
    });
  }, [room, gameStatus, players, playerId, playerName, currentNumber, hasCalledThisRound]);

  // 게임 시작
  const startGame = useCallback(async () => {
    if (!room) return;

    setHasCalledThisRound(false);

    await supabase.from('events').delete().eq('room_id', room.id);
    await supabase.from('players').update({ is_alive: true, is_ready: false }).eq('room_id', room.id);
    await supabase.from('rooms').update({ status: 'playing', current_number: 0 }).eq('id', room.id);

    // 게임 시작 이벤트 기록
    await supabase.from('events').insert({
      room_id: room.id,
      type: 'game_started',
    });

    channelRef.current?.send({
      type: 'broadcast',
      event: 'game_start',
      payload: { type: 'game_start' },
    });
  }, [room]);

  // 게임 리셋 (대기 상태로)
  const resetGame = useCallback(async () => {
    if (!room) return;

    setHasCalledThisRound(false);

    await supabase.from('events').delete().eq('room_id', room.id);
    await supabase.from('players').update({ is_alive: true, is_ready: false }).eq('room_id', room.id);
    await supabase.from('rooms').update({ status: 'waiting', current_number: 0 }).eq('id', room.id);

    channelRef.current?.send({
      type: 'broadcast',
      event: 'game_start',
      payload: { type: 'game_start' },
    });
  }, [room]);

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

    // Immediately refetch to ensure consistency
    await loadPlayers(room.id);
  }, [room, players, playerId, playerName, loadPlayers]);

  // 초기화 및 구독 설정
  useEffect(() => {
    let mounted = true;

    // 숫자 호출 이벤트 처리
    const handleNumberCalled = async (event: GameBroadcastEvent, roomData: Room) => {
      if (event.type !== 'number_called') return;

      const { player_id, player_name, number, timestamp } = event;

      if (player_id === playerId && pendingCallRef.current) {
        pendingCallRef.current = null;
      }

      // 동시 호출 체크
      const { data: recentEvents } = await supabase
        .from('events')
        .select('*')
        .eq('room_id', roomData.id)
        .eq('type', 'number_called')
        .eq('number', number);

      const collisions = recentEvents?.filter((e) => {
        if (e.player_id === player_id) return false;
        const timeDiff = Math.abs(new Date(e.created_at).getTime() - timestamp);
        return timeDiff < COLLISION_THRESHOLD_MS;
      });

      const hasCollision = (collisions?.length ?? 0) > 0;
      const collisionPlayerIds = [player_id, ...(collisions?.map((c) => c.player_id) ?? [])].filter((id): id is string => id !== null);

      if (hasCollision) {
        // 충돌! 관련 플레이어들 탈락
        // @ts-ignore
        await supabase.from('players').update({ is_alive: false }).in('id', collisionPlayerIds);

        // 모든 충돌 플레이어에 대한 이벤트 발송 및 기록
        const { data: allPlayers } = await supabase.from('players').select('*').eq('room_id', roomData.id);

        for (const collidedPlayerId of collisionPlayerIds) {
          const collidedPlayer = allPlayers?.find(p => p.id === collidedPlayerId);
          if (collidedPlayer) {
            // events 테이블에 기록
            await supabase.from('events').insert({
              room_id: roomData.id,
              type: 'player_eliminated',
              player_id: collidedPlayer.id,
              player_name: collidedPlayer.nickname,
              reason: 'collision',
            });

            channelRef.current?.send({
              type: 'broadcast',
              event: 'player_eliminated',
              payload: {
                type: 'player_eliminated',
                player_id: collidedPlayer.id,
                player_name: collidedPlayer.nickname,
                reason: 'collision',
              },
            });
          }
        }

        // 충돌 발생 시 즉시 게임 종료 (탈락자가 발생했으므로)
        // 눈치게임은 탈락자가 발생하는 순간 게임이 끝남
        await supabase.from('rooms').update({ status: 'finished' }).eq('id', roomData.id);

        // 게임 종료 이벤트 기록
        await supabase.from('events').insert({
          room_id: roomData.id,
          type: 'game_finished',
        });

        channelRef.current?.send({
          type: 'broadcast',
          event: 'game_end',
          payload: {
            type: 'game_end',
            winner_id: null,
            winner_name: null,
          },
        });

        setGameStatus('finished');
        await loadPlayers(roomData.id);
        return;
      } else {
        // 정상 호출 - 다음 라운드를 위해 버튼 다시 활성화
        setCurrentNumber(number);
        setHasCalledThisRound(false);
        await supabase.from('rooms').update({ current_number: number }).eq('id', roomData.id);
      }

      await loadPlayers(roomData.id);

      // 게임 종료 조건 체크
      const { count: totalPlayers } = await supabase
        .from('players')
        .select('*', { count: 'exact', head: true })
        .eq('room_id', roomData.id);

      // 패배 조건: 현재 숫자가 n-1에 도달하면 숫자를 외치지 않은 마지막 한 명이 탈락하고 게임 종료
      const shouldEnd = number === (totalPlayers || 0) - 1;

      if (shouldEnd) {
        // 이번 게임에서 숫자를 외친 플레이어 목록 조회
        const { data: calledEvents } = await supabase
          .from('events')
          .select('player_id')
          .eq('room_id', roomData.id)
          .eq('type', 'number_called');

        const calledPlayerIds = calledEvents?.map(e => e.player_id) || [];

        // 전체 플레이어 조회
        const { data: allPlayers } = await supabase
          .from('players')
          .select('*')
          .eq('room_id', roomData.id);

        // 숫자를 외치지 않은 플레이어 찾기
        const playersWhoDidntCall = allPlayers?.filter(p => !calledPlayerIds.includes(p.id)) || [];

        if (playersWhoDidntCall.length > 0) {
          // 숫자를 외치지 않은 플레이어만 탈락시킴 (탈락자 발생!)
          const eliminatedPlayerIds = playersWhoDidntCall.map(p => p.id);
          await supabase.from('players').update({ is_alive: false }).in('id', eliminatedPlayerIds);

          // events 테이블에 기록 및 브로드캐스트
          for (const lastPlayer of playersWhoDidntCall) {
            await supabase.from('events').insert({
              room_id: roomData.id,
              type: 'player_eliminated',
              player_id: lastPlayer.id,
              player_name: lastPlayer.nickname,
              reason: 'last_standing',
            });

            channelRef.current?.send({
              type: 'broadcast',
              event: 'player_eliminated',
              payload: {
                type: 'player_eliminated',
                player_id: lastPlayer.id,
                player_name: lastPlayer.nickname,
                reason: 'last_standing',
              },
            });
          }

          // 탈락자가 발생했으므로 즉시 게임 종료 (눈치게임 규칙)
          await supabase.from('rooms').update({ status: 'finished' }).eq('id', roomData.id);

          // 게임 종료 이벤트 기록
          await supabase.from('events').insert({
            room_id: roomData.id,
            type: 'game_finished',
          });

          channelRef.current?.send({
            type: 'broadcast',
            event: 'game_end',
            payload: {
              type: 'game_end',
              winner_id: null,
              winner_name: null,
            },
          });

          setGameStatus('finished');
        }
      }

      setLastEvent(event);
    };

    const setup = async () => {
      setIsLoading(true);
      const roomData = await loadRoom();

      if (!roomData || !mounted) {
        setIsLoading(false);
        return;
      }

      await loadPlayers(roomData.id);

      // Supabase Realtime
      const channel = supabase.channel(`room:${roomData.id}`, {
        config: { presence: { key: playerId } },
      });

      channel
        .on('broadcast', { event: 'number_called' }, ({ payload }) => {
          handleNumberCalled(payload as GameBroadcastEvent, roomData);
        })
        .on('broadcast', { event: 'game_start' }, () => {
          setGameStatus('playing');
          setCurrentNumber(0);
          setHasCalledThisRound(false);
          loadPlayers(roomData.id);
        })
        .on('broadcast', { event: 'game_end' }, ({ payload }) => {
          setGameStatus('finished');
          setLastEvent(payload as GameBroadcastEvent);
        })
        .on('broadcast', { event: 'player_eliminated' }, ({ payload }) => {
          setLastEvent(payload as GameBroadcastEvent);
          loadPlayers(roomData.id);
        })
        .on('broadcast', { event: 'player_ready' }, () => {
          loadPlayers(roomData.id);
        })
        .on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState<PlayerPresence>();
          setPresenceState(state);
        })
        .subscribe(async (status) => {
          if (status === 'SUBSCRIBED') {
            await channel.track({
              id: playerId,
              nickname: playerName,
              is_alive: true,
              online_at: new Date().toISOString(),
            });
          }
        });

      channelRef.current = channel;
      setIsLoading(false);
    };

    setup();

    return () => {
      mounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode, playerId, playerName]);

  // DB 변경 감지
  useEffect(() => {
    if (!room) return;

    const subscription = supabase
      .channel(`db_changes:${room.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${room.id}`,
        },
        (payload) => {
          const newRoom = payload.new as Room & { is_deleted?: boolean };

          // 호스트가 방을 나가서 soft delete된 경우
          if (newRoom.is_deleted) {
            setHostLeft(true);
            setRoom(null);
            return;
          }

          setRoom(newRoom);
          setCurrentNumber(newRoom.current_number);
          setGameStatus(newRoom.status);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'players',
          filter: `room_id=eq.${room.id}`,
        },
        () => {
          // 플레이어 변경 시 목록 새로고침
          loadPlayers(room.id);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [room?.id, loadPlayers]);

  const myPlayer = players.find((p) => p.id === playerId);
  const isMyTurn = gameStatus === 'playing' && (myPlayer?.is_alive ?? false) && !hasCalledThisRound;

  return {
    room,
    players,
    currentNumber,
    isMyTurn,
    gameStatus,
    lastEvent,
    error,
    isLoading,
    hostLeft,
    callNumber,
    startGame,
    resetGame,
    toggleReady,
    presenceState,
  };
}
