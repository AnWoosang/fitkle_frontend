import { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Room, Player, PlayerPresence } from '../types/game';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface StatementData {
  truth1: string;
  truth2: string;
  lie: string;
  lie_index: number;
}

interface VoteData {
  voted_index: number;
  target_player_id: string;
  is_correct: boolean;
  turn_number: number;
}

interface TwoTruthsBroadcastEvent {
  type: 'statements_submitted' | 'vote_cast' | 'turn_revealed' | 'game_start' | 'game_end' | 'player_ready';
  player_id?: string;
  player_name?: string;
  turn_number?: number;
  winner_id?: string | null;
  winner_name?: string | null;
  is_ready?: boolean;
}

interface UseTwoTruthsGameProps {
  roomCode: string;
  playerId: string;
  playerName: string;
}

interface UseTwoTruthsGameReturn {
  room: Room | null;
  players: Player[];
  gameStatus: 'waiting' | 'preparing' | 'playing' | 'revealing' | 'finished';
  currentTurn: number;
  currentTurnPlayerId: string | null;
  currentTurnPlayer: Player | null;
  myStatement: StatementData | null;
  currentStatements: string[] | null;
  myVote: VoteData | null;
  hasSubmittedStatements: boolean;
  hasVoted: boolean;
  error: string | null;
  isLoading: boolean;
  hostLeft: boolean;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  submitStatements: (truth1: string, truth2: string, lie: string) => Promise<void>;
  castVote: (statementIndex: number) => Promise<void>;
  startGame: () => Promise<void>;
  resetGame: () => Promise<void>;
  toggleReady: () => Promise<void>;
  presenceState: Record<string, PlayerPresence[]>;
  cleanup: () => void;
}

export function useTwoTruthsGame({
  roomCode,
  playerId,
  playerName,
}: UseTwoTruthsGameProps): UseTwoTruthsGameReturn {
  const [room, setRoom] = useState<Room | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'preparing' | 'playing' | 'revealing' | 'finished'>('waiting');
  const [currentTurn, setCurrentTurn] = useState(0);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>(null);
  const [myStatement, setMyStatement] = useState<StatementData | null>(null);
  const [currentStatements, setCurrentStatements] = useState<string[] | null>(null);
  const [myVote, setMyVote] = useState<VoteData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hostLeft, setHostLeft] = useState(false);
  const [presenceState, setPresenceState] = useState<Record<string, PlayerPresence[]>>({});
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');

  const channelRef = useRef<RealtimeChannel | null>(null);
  const currentTurnPlayerIdRef = useRef<string | null>(null);
  const processingVoteRef = useRef<boolean>(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;

  // ref 동기화
  useEffect(() => {
    currentTurnPlayerIdRef.current = currentTurnPlayerId;
  }, [currentTurnPlayerId]);

  // 안전한 브로드캐스트 전송 (웹소켓 연결 상태 확인)
  const safeBroadcast = useCallback((event: string, payload: any) => {
    if (connectionStatus === 'connected' && channelRef.current) {
      channelRef.current.send({
        type: 'broadcast',
        event,
        payload,
      });
    } else {
      // 웹소켓이 끊긴 상태에서는 broadcast 하지 않음
      // 폴링으로 다른 클라이언트가 DB 변경을 감지함
      console.log(`⚠️ 웹소켓 끊김 - ${event} 브로드캐스트 스킵 (폴링으로 동기화)`);
    }
  }, [connectionStatus]);

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

    const roomData = data as Room & { is_deleted?: boolean; current_turn?: number; current_turn_player_id?: string };
    if (roomData.is_deleted) {
      setHostLeft(true);
      return null;
    }

    setRoom(roomData);
    setCurrentTurn(roomData.current_turn || 0);
    setCurrentTurnPlayerId(roomData.current_turn_player_id || null);
    setGameStatus(roomData.status === 'waiting' ? 'waiting' : roomData.status === 'playing' ? 'playing' : 'finished');
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

  // 내 진술 로드 (events 테이블에서)
  const loadMyStatement = useCallback(async (roomId: string) => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('room_id', roomId)
      .eq('player_id', playerId)
      .eq('type', 'statement_submitted')
      .maybeSingle();

    if (error) {
      console.error('진술 로드 실패:', error);
      return;
    }

    if (data && data.data) {
      setMyStatement(data.data as unknown as StatementData);
    } else {
      setMyStatement(null);
    }
  }, [playerId]);

  // 현재 턴의 진술 로드
  const loadCurrentTurnStatements = useCallback(async (roomId: string, turnPlayerId: string | null) => {
    if (!turnPlayerId) {
      setCurrentStatements(null);
      return;
    }

    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('room_id', roomId)
      .eq('player_id', turnPlayerId)
      .eq('type', 'statement_submitted')
      .maybeSingle();

    if (error || !data || !data.data) {
      setCurrentStatements(null);
      return;
    }

    const statementData = data.data as unknown as StatementData;
    const statements = [statementData.truth1, statementData.truth2, statementData.lie];
    const shuffled: string[] = [];
    const lie_index = statementData.lie_index;

    // lie_index에 맞춰서 섞기
    for (let i = 0; i < 3; i++) {
      if (i === lie_index) {
        shuffled[i] = statementData.lie;
      } else if (shuffled.filter(s => s).length === 0) {
        shuffled[i] = statementData.truth1;
      } else {
        shuffled[i] = statementData.truth2;
      }
    }

    setCurrentStatements(shuffled);
  }, []);

  // 내 투표 로드
  const loadMyVote = useCallback(async (roomId: string, turnPlayerId: string) => {
    console.log('🗳️ loadMyVote 호출:', { roomId, turnPlayerId, myPlayerId: playerId, currentTurn });

    // 현재 게임 세션의 시작 시간 가져오기 (room.updated_at)
    const { data: roomData } = await supabase
      .from('rooms')
      .select('updated_at')
      .eq('id', roomId)
      .single();

    const gameSessionStart = roomData?.updated_at;

    // target_player_id 기반으로 투표 조회 (최신 것만)
    const { data: allVotes } = await supabase
      .from('events')
      .select('*')
      .eq('room_id', roomId)
      .eq('player_id', playerId)
      .eq('type', 'vote_cast')
      .order('created_at', { ascending: false }); // 최신순 정렬

    console.log('📊 전체 투표 조회 결과:', allVotes);

    // 현재 게임 세션의 투표만 필터링 (게임 시작 이후)
    const recentVotes = gameSessionStart
      ? (allVotes as any[])?.filter((vote: any) => vote.created_at > gameSessionStart)
      : allVotes;

    // 현재 턴 플레이어 AND 현재 턴 번호에 대한 내 투표 찾기
    const myVoteForThisTurn = (recentVotes as any[])?.find((vote: any) => {
      const voteData = vote.data as VoteData;
      const targetMatch = voteData.target_player_id === turnPlayerId;
      // turn_number가 없는 구버전 투표는 무시
      const hasTurnNumber = voteData.turn_number !== undefined && voteData.turn_number !== null;
      const turnMatch = hasTurnNumber && voteData.turn_number === currentTurn;
      console.log('🔍 투표 데이터 확인:', {
        voteData,
        voteCreatedAt: vote.created_at,
        gameSessionStart,
        targetPlayerId: voteData.target_player_id,
        currentTurnPlayerId: turnPlayerId,
        voteTurnNumber: voteData.turn_number,
        currentTurnNumber: currentTurn,
        hasTurnNumber,
        targetMatch,
        turnMatch,
        bothMatch: targetMatch && turnMatch
      });
      return targetMatch && turnMatch;
    });

    console.log('✅ 이번 턴 투표 결과:', myVoteForThisTurn);

    if (myVoteForThisTurn && myVoteForThisTurn.data) {
      console.log('✓ 투표 있음 - hasVoted will be true');
      setMyVote(myVoteForThisTurn.data as VoteData);
    } else {
      console.log('✗ 투표 없음 - hasVoted will be false');
      setMyVote(null);
    }
  }, [playerId, currentTurn]);

  // 진술 제출
  const submitStatements = useCallback(async (truth1: string, truth2: string, lie: string) => {
    if (!room) return;

    const lie_index = Math.floor(Math.random() * 3);
    const statementData: StatementData = { truth1, truth2, lie, lie_index };

    // Optimistic Update
    setMyStatement(statementData);

    // @ts-ignore
    await supabase.from('events').insert({
      room_id: room.id,
      player_id: playerId,
      player_name: playerName,
      type: 'statement_submitted',
      data: statementData as any,
    });

    safeBroadcast('statements_submitted', {
      type: 'statements_submitted',
      player_id: playerId,
      player_name: playerName,
    });
  }, [room, playerId, playerName, safeBroadcast]);

  // 투표하기
  const castVote = useCallback(async (statementIndex: number) => {
    if (!room || !currentStatements || !currentTurnPlayerId) return;

    // 정답 확인
    const { data: statementEvent } = await supabase
      .from('events')
      .select('*')
      .eq('room_id', room.id)
      .eq('player_id', currentTurnPlayerId)
      .eq('type', 'statement_submitted')
      .single();

    const statementData = statementEvent?.data as unknown as StatementData;
    const is_correct = statementData ? statementIndex === statementData.lie_index : false;

    const voteData: VoteData = {
      voted_index: statementIndex,
      target_player_id: currentTurnPlayerId,
      is_correct,
      turn_number: currentTurn,
    };

    // Optimistic Update
    setMyVote(voteData);

    // @ts-ignore
    await supabase.from('events').insert({
      room_id: room.id,
      player_id: playerId,
      player_name: playerName,
      type: 'vote_cast',
      data: voteData as any,
      turn_number: currentTurn,
    });

    safeBroadcast('vote_cast', {
      type: 'vote_cast',
      player_id: playerId,
      player_name: playerName,
      turn_number: currentTurn,
    });

    // 모든 투표 완료 체크
    await checkAllVoted(room.id, currentTurnPlayerId, currentTurn);
  }, [room, currentStatements, currentTurnPlayerId, currentTurn, playerId, playerName, safeBroadcast]);

  // 모든 투표 완료 체크 (target_player_id + turn_number 기반)
  const checkAllVoted = useCallback(async (roomId: string, turnPlayerId: string, turnNumber: number) => {
    // 중복 실행 방지
    if (processingVoteRef.current) {
      console.log('이미 투표 처리 중입니다.');
      return;
    }

    // 현재 게임 세션 시작 시간 가져오기
    const { data: roomData } = await supabase
      .from('rooms')
      .select('updated_at')
      .eq('id', roomId)
      .single();

    const gameSessionStart = roomData?.updated_at;

    // 해당 턴 플레이어에 대한 투표 조회 (data.target_player_id 확인)
    const { data: allVotes } = await supabase
      .from('events')
      .select('*')
      .eq('room_id', roomId)
      .eq('type', 'vote_cast');

    // 현재 게임 세션의 투표만 필터링
    const recentVotes = gameSessionStart
      ? (allVotes as any[])?.filter((vote: any) => vote.created_at > gameSessionStart)
      : allVotes;

    // 이번 턴의 투표만 필터링 (data.target_player_id가 turnPlayerId이고 turn_number가 일치하는 것)
    const votes = (recentVotes as any[])?.filter((vote: any) => {
      const voteData = vote.data as VoteData;
      const hasTurnNumber = voteData.turn_number !== undefined && voteData.turn_number !== null;
      return voteData.target_player_id === turnPlayerId && hasTurnNumber && voteData.turn_number === turnNumber;
    });

    // 생존자 조회
    const { data: survivors } = await supabase
      .from('players')
      .select('*')
      .eq('room_id', roomId)
      .eq('is_alive', true);

    // 턴 플레이어가 생존자인지 확인
    const isTurnPlayerAlive = (survivors as Player[])?.some(p => p.id === turnPlayerId);
    if (!isTurnPlayerAlive) {
      // 턴 플레이어가 이미 탈락한 경우 - 다음 턴으로
      console.error('턴 플레이어가 이미 탈락했습니다.');
      return;
    }

    // 본인(턴 플레이어) 제외한 생존자 수
    const expectedVotes = (survivors?.length || 0) - 1;

    console.log('📊 투표 완료 체크:', {
      turnNumber,
      turnPlayerId,
      totalVotes: votes?.length || 0,
      expectedVotes,
      survivors: survivors?.length || 0,
      allVotesCount: allVotes?.length || 0,
      filteredVotes: votes?.map((v: any) => ({
        player_id: v.player_id,
        turn_number: v.data.turn_number,
        target: v.data.target_player_id
      }))
    });

    if ((votes?.length || 0) >= expectedVotes) {
      console.log('✅ 모든 투표 완료! 결과 처리 시작');
      processingVoteRef.current = true;
      try {
        await processVoteResults(roomId, turnPlayerId, turnNumber);
      } finally {
        processingVoteRef.current = false;
      }
    } else {
      console.log('⏳ 아직 투표 대기 중...', {
        received: votes?.length || 0,
        needed: expectedVotes
      });
    }
  }, []);

  // 투표 결과 처리
  const processVoteResults = useCallback(async (roomId: string, turnPlayerId: string, turnNumber: number) => {
    // 현재 게임 세션 시작 시간 가져오기
    const { data: roomData } = await supabase
      .from('rooms')
      .select('updated_at')
      .eq('id', roomId)
      .single();

    const gameSessionStart = roomData?.updated_at;

    // 해당 턴 플레이어에 대한 투표만 조회
    const { data: allVotes } = await supabase
      .from('events')
      .select('*')
      .eq('room_id', roomId)
      .eq('type', 'vote_cast');

    // 현재 게임 세션의 투표만 필터링
    const recentVotes = gameSessionStart
      ? (allVotes as any[])?.filter((vote: any) => vote.created_at > gameSessionStart)
      : allVotes;

    const votes = (recentVotes as any[])?.filter((vote: any) => {
      const voteData = vote.data as VoteData;
      const hasTurnNumber = voteData.turn_number !== undefined && voteData.turn_number !== null;
      return voteData.target_player_id === turnPlayerId && hasTurnNumber && voteData.turn_number === turnNumber;
    });

    // 진술자의 lie_index 가져오기
    const { data: statementEvent } = await supabase
      .from('events')
      .select('*')
      .eq('room_id', roomId)
      .eq('player_id', turnPlayerId)
      .eq('type', 'statement_submitted')
      .single();

    const statementData = statementEvent?.data as unknown as StatementData;
    if (!statementData) {
      console.error('진술 데이터를 찾을 수 없습니다.');
      return;
    }

    // 각 진술별 투표 수 집계
    const voteCounts = [0, 0, 0];
    votes?.forEach((vote: any) => {
      const voteData = vote.data as VoteData;
      voteCounts[voteData.voted_index]++;
    });

    // 최다 득표 찾기
    const maxVotes = Math.max(...voteCounts);
    const winningIndices = voteCounts
      .map((count, index) => (count === maxVotes ? index : null))
      .filter(i => i !== null) as number[];

    // 진술자의 거짓말이 최다 득표를 받았는지 확인 (동점이 아니고)
    const isTurnPlayerEliminated = winningIndices.length === 1 && winningIndices[0] === statementData.lie_index;

    if (isTurnPlayerEliminated) {
      // 진술자(턴 플레이어) 탈락 - 거짓말이 들통남
      await supabase
        .from('players')
        .update({ is_alive: false } as any)
        .eq('id', turnPlayerId);

      const { data: turnPlayer } = await supabase
        .from('players')
        .select('*')
        .eq('id', turnPlayerId)
        .single();

      if (turnPlayer) {
        await supabase.from('events').insert({
          room_id: roomId,
          type: 'player_eliminated',
          player_id: turnPlayerId,
          player_name: (turnPlayer as any).nickname,
          reason: 'lie_caught',
        } as any);
      }
    }

    // 생존자 체크
    const { data: survivors } = await supabase
      .from('players')
      .select('*')
      .eq('room_id', roomId)
      .eq('is_alive', true)
      .order('joined_at', { ascending: true });

    // 생존자가 1명 이하면 게임 종료
    if ((survivors?.length || 0) <= 1) {
      const winner = survivors?.[0] || null;
      await supabase.from('rooms').update({ status: 'finished' }).eq('id', roomId);

      await supabase.from('events').insert({
        room_id: roomId,
        type: 'game_finished',
      });

      safeBroadcast('game_end', {
        type: 'game_end',
        winner_id: winner?.id || null,
        winner_name: winner?.nickname || null,
      });

      setGameStatus('finished');
      return;
    }

    // 다음 턴 결정: 생존자만 순환
    // 전체 플레이어 목록 가져오기 (순서 유지)
    const { data: allPlayersData } = await supabase
      .from('players')
      .select('*')
      .eq('room_id', roomId)
      .order('joined_at', { ascending: true });

    const allPlayers = allPlayersData as Player[];

    if (!allPlayers || allPlayers.length === 0) {
      console.error('플레이어 목록을 가져올 수 없습니다.');
      return;
    }

    // 현재 턴 플레이어의 인덱스 찾기
    const currentTurnIndex = allPlayers.findIndex(p => p.id === turnPlayerId);
    if (currentTurnIndex === -1) {
      console.error('현재 턴 플레이어를 찾을 수 없습니다.');
      return;
    }

    // 현재 턴 플레이어 다음부터 순환하면서 첫 생존자 찾기
    let nextTurnPlayer: Player | null = null;
    for (let i = 1; i <= allPlayers.length; i++) {
      const checkIndex = (currentTurnIndex + i) % allPlayers.length;
      const checkPlayer = allPlayers[checkIndex];

      // 생존자인지 확인 (survivors 리스트에 있는지)
      if ((survivors as Player[])?.some(s => s.id === checkPlayer.id)) {
        nextTurnPlayer = checkPlayer;
        break;
      }
    }

    if (!nextTurnPlayer) {
      console.error('다음 턴 플레이어를 찾을 수 없습니다.');
      return;
    }

    // 다음 턴 플레이어의 인덱스 (전체 플레이어 목록 기준)
    const nextTurn = allPlayers.findIndex(p => p.id === nextTurnPlayer!.id);

    // 다음 턴 시작 - current_turn_player_id 추가
    await supabase.from('rooms').update({
      current_turn: nextTurn,
      current_turn_player_id: nextTurnPlayer.id
    } as any).eq('id', roomId);

    safeBroadcast('turn_revealed', {
      type: 'turn_revealed',
      turn_number: nextTurn,
      player_id: nextTurnPlayer.id,
    });
  }, [safeBroadcast]);

  // 게임 시작
  const startGame = useCallback(async () => {
    if (!room) return;

    // 모든 플레이어가 진술을 제출했는지 확인
    const { data: statements } = await supabase
      .from('events')
      .select('*')
      .eq('room_id', room.id)
      .eq('type', 'statement_submitted');

    const { data: allPlayersData } = await supabase
      .from('players')
      .select('*')
      .eq('room_id', room.id)
      .order('joined_at', { ascending: true });

    const allPlayers = allPlayersData as Player[];

    if ((statements?.length || 0) < (allPlayers?.length || 0)) {
      setError('모든 플레이어가 진술을 제출해야 합니다.');
      return;
    }

    // 첫 번째 플레이어를 첫 턴 플레이어로 설정
    const firstPlayer = allPlayers[0];
    if (!firstPlayer) {
      setError('플레이어를 찾을 수 없습니다.');
      return;
    }

    // 투표 이벤트 삭제 (진술은 유지)
    // 구버전 투표 데이터(turn_number 없는 것)도 함께 정리
    console.log('🗑️ 투표 데이터 삭제 중...');
    await supabase
      .from('events')
      .delete()
      .eq('room_id', room.id)
      .eq('type', 'vote_cast');

    // 플레이어 상태 초기화 (is_alive만) - 병렬 처리
    const { data: allPlayersInRoom } = await supabase
      .from('players')
      .select('*')
      .eq('room_id', room.id);

    const playersInRoom = allPlayersInRoom as Player[];

    if (playersInRoom && playersInRoom.length > 0) {
      await Promise.all(
        playersInRoom.map(player =>
          supabase
            .from('players')
            .update({ is_alive: true } as any)
            .eq('id', player.id)
        )
      );
    }

    // 방 상태를 playing으로 변경 (current_turn, current_turn_player_id도 함께 저장)
    const { error: updateError } = await supabase
      .from('rooms')
      .update({
        status: 'playing',
        current_turn: 0,
        current_turn_player_id: firstPlayer.id
      } as any)
      .eq('id', room.id);

    if (updateError) {
      console.error('게임 시작 실패:', updateError);
      setError(`게임 시작 실패: ${updateError.message}`);
      return;
    }

    await supabase.from('events').insert({
      room_id: room.id,
      type: 'game_started',
    });

    safeBroadcast('game_start', {
      type: 'game_start',
      turn_number: 0,
      player_id: firstPlayer.id
    });

    setGameStatus('playing');
    setCurrentTurn(0);
    setCurrentTurnPlayerId(firstPlayer.id);
  }, [room, safeBroadcast]);

  // 게임 리셋
  const resetGame = useCallback(async () => {
    if (!room) return;

    await supabase
      .from('events')
      .delete()
      .eq('room_id', room.id)
      .in('type', ['statement_submitted', 'vote_cast', 'game_started', 'game_finished', 'player_eliminated']);

    await supabase
      .from('players')
      .update({ is_alive: true, is_ready: false })
      .eq('room_id', room.id);

    await supabase
      .from('rooms')
      .update({
        status: 'waiting'
      } as any)
      .eq('id', room.id);

    setMyStatement(null);
    setMyVote(null);
    setCurrentStatements(null);
    setCurrentTurn(0);
    setCurrentTurnPlayerId(null);
    setGameStatus('waiting');

    safeBroadcast('game_reset', { type: 'game_reset' });
  }, [room, safeBroadcast]);

  // 준비 상태 토글
  const toggleReady = useCallback(async () => {
    if (!room) return;

    const myPlayer = players.find((p) => p.id === playerId);
    if (!myPlayer) return;

    const newReadyState = !myPlayer.is_ready;
    console.log('🔄 toggleReady 호출:', {
      playerId,
      currentReadyState: myPlayer.is_ready,
      newReadyState
    });

    // Optimistic Update
    setPlayers(prevPlayers =>
      prevPlayers.map(p =>
        p.id === playerId ? { ...p, is_ready: newReadyState } : p
      )
    );

    // @ts-ignore
    const { error } = await supabase.from('players').update({ is_ready: newReadyState }).eq('id', playerId);

    if (error) {
      console.error('❌ DB 업데이트 실패:', error);
    } else {
      console.log('✅ DB 업데이트 성공:', { playerId, is_ready: newReadyState });
    }

    safeBroadcast('player_ready', {
      type: 'player_ready',
      player_id: playerId,
      player_name: playerName,
      is_ready: newReadyState,
    });
  }, [room, players, playerId, playerName, safeBroadcast]);

  // 채널 설정 함수 (재사용 가능)
  const setupChannel = useCallback((roomData: Room) => {
    const channel = supabase.channel(`room:${roomData.id}`, {
      config: { presence: { key: playerId } },
    });

    channel
      .on('broadcast', { event: 'statements_submitted' }, () => {
        loadMyStatement(roomData.id);
      })
      .on('broadcast', { event: 'vote_cast' }, () => {
        if (currentTurnPlayerIdRef.current) {
          loadMyVote(roomData.id, currentTurnPlayerIdRef.current);
        }
      })
      .on('broadcast', { event: 'turn_revealed' }, ({ payload }) => {
        const event = payload as TwoTruthsBroadcastEvent;
        if (event.turn_number !== undefined && event.player_id) {
          setCurrentTurn(event.turn_number);
          setCurrentTurnPlayerId(event.player_id);
          setMyVote(null);
          loadPlayers(roomData.id);
        }
      })
      .on('broadcast', { event: 'game_start' }, async ({ payload }) => {
        const event = payload as TwoTruthsBroadcastEvent;
        console.log('🎯 game_start 이벤트 수신:', event);

        setMyVote(null);
        console.log('🗑️ 게임 시작 - 투표 상태 초기화');

        setGameStatus('playing');
        setCurrentTurn(event.turn_number || 0);
        setCurrentTurnPlayerId(event.player_id || null);
        console.log('✅ 게임 상태 설정 완료:', {
          status: 'playing',
          turn: event.turn_number || 0,
          playerId: event.player_id || null
        });

        loadPlayers(roomData.id);
        loadRoom();
      })
      .on('broadcast', { event: 'game_reset' }, () => {
        setGameStatus('waiting');
        setCurrentTurn(0);
        setCurrentTurnPlayerId(null);
        setMyStatement(null);
        setMyVote(null);
        setCurrentStatements(null);
        loadPlayers(roomData.id);
        loadRoom();
      })
      .on('broadcast', { event: 'game_end' }, () => {
        setGameStatus('finished');
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
        console.log('🔌 웹소켓 연결 상태:', status);

        if (status === 'SUBSCRIBED') {
          setConnectionStatus('connected');
          reconnectAttemptsRef.current = 0; // 성공 시 재시도 카운터 리셋
          console.log('✅ 웹소켓 연결 성공');

          await channel.track({
            id: playerId,
            nickname: playerName,
            is_alive: true,
            online_at: new Date().toISOString(),
          });
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          console.warn('⚠️ 웹소켓 연결 끊김:', status);
          setConnectionStatus('disconnected');

          // 재연결 시도
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000); // 지수 백오프 (최대 30초)

            console.log(`🔄 ${delay}ms 후 재연결 시도 (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

            reconnectTimeoutRef.current = setTimeout(() => {
              console.log('🔄 웹소켓 재연결 시도...');
              if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
              }
              const newChannel = setupChannel(roomData);
              channelRef.current = newChannel;
            }, delay);
          } else {
            console.warn('⚠️ 최대 재연결 시도 횟수 초과. 폴링 모드로 전환합니다.');
            setConnectionStatus('disconnected');
          }
        }
      });

    return channel;
  }, [playerId, playerName, loadMyStatement, loadMyVote, loadPlayers, loadRoom, maxReconnectAttempts]);

  // 초기화 및 구독 설정
  useEffect(() => {
    let mounted = true;

    const setup = async () => {
      setIsLoading(true);
      setConnectionStatus('connecting');
      const roomData = await loadRoom();

      if (!roomData || !mounted) {
        setIsLoading(false);
        return;
      }

      // 방에 입장할 때 구버전 투표 데이터 정리
      console.log('🗑️ 구버전 투표 데이터 정리 중...');
      const { data: oldVotes } = await supabase
        .from('events')
        .select('id, data')
        .eq('room_id', roomData.id)
        .eq('type', 'vote_cast');

      if (oldVotes && oldVotes.length > 0) {
        const oldVoteIds = oldVotes
          .filter((v: any) => {
            const voteData = v.data as VoteData;
            return voteData.turn_number === undefined || voteData.turn_number === null;
          })
          .map((v: any) => v.id);

        if (oldVoteIds.length > 0) {
          console.log(`🗑️ 구버전 투표 ${oldVoteIds.length}개 삭제 중...`);
          await supabase
            .from('events')
            .delete()
            .in('id', oldVoteIds);
        }
      }

      await loadPlayers(roomData.id);
      await loadMyStatement(roomData.id);

      const turn = (roomData as any).current_turn || 0;
      const turnPlayerId = (roomData as any).current_turn_player_id || null;
      setCurrentTurn(turn);
      setCurrentTurnPlayerId(turnPlayerId);

      const channel = setupChannel(roomData);
      channelRef.current = channel;
      setIsLoading(false);
    };

    setup();

    return () => {
      mounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [roomCode, loadRoom, loadPlayers, loadMyStatement, setupChannel]);

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
          const newRoom = payload.new as Room & { is_deleted?: boolean; current_turn?: number; current_turn_player_id?: string };

          if (newRoom.is_deleted) {
            setHostLeft(true);
            setRoom(null);
            return;
          }

          setRoom(newRoom);
          setCurrentTurn(newRoom.current_turn || 0);
          setCurrentTurnPlayerId(newRoom.current_turn_player_id || null);
          setGameStatus(newRoom.status === 'waiting' ? 'waiting' : newRoom.status === 'playing' ? 'playing' : 'finished');
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
          loadPlayers(room.id);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `room_id=eq.${room.id}`,
        },
        (payload) => {
          const event = payload.new as any;
          if (event.type === 'statement_submitted' && event.player_id === playerId) {
            loadMyStatement(room.id);
          } else if (event.type === 'vote_cast' && event.player_id === playerId) {
            if (currentTurnPlayerIdRef.current) {
              loadMyVote(room.id, currentTurnPlayerIdRef.current);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [room?.id, playerId, loadPlayers, loadMyStatement, loadMyVote]);

  // 현재 턴의 진술 로드
  useEffect(() => {
    console.log('🎮 진술 로드 체크:', {
      hasRoom: !!room,
      gameStatus,
      currentTurnPlayerId,
      willLoad: !!(room && gameStatus === 'playing' && currentTurnPlayerId)
    });
    if (room && gameStatus === 'playing' && currentTurnPlayerId) {
      console.log('📝 진술 로드 시작:', currentTurnPlayerId);
      loadCurrentTurnStatements(room.id, currentTurnPlayerId);
    }
  }, [room, gameStatus, currentTurnPlayerId, loadCurrentTurnStatements]);

  // 현재 턴의 투표 상태 로드
  useEffect(() => {
    if (room && gameStatus === 'playing' && currentTurnPlayerId) {
      console.log('🗳️ 투표 상태 로드 시작:', currentTurnPlayerId);
      loadMyVote(room.id, currentTurnPlayerId);
    }
  }, [room, gameStatus, currentTurnPlayerId, loadMyVote]);

  // 게임 상태 폴링 (브로드캐스트 누락 방지 및 연결 끊김 시 fallback)
  useEffect(() => {
    if (!room) return;

    const pollGameStatus = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('status, current_turn, current_turn_player_id')
        .eq('id', room.id)
        .single();

      if (data) {
        const roomData = data as any;

        // 게임 시작 감지 (waiting -> playing)
        if (roomData.status === 'playing' && gameStatus === 'waiting') {
          console.log('⚠️ 폴링으로 게임 시작 감지');
          setGameStatus('playing');
          setCurrentTurn(roomData.current_turn || 0);
          setCurrentTurnPlayerId(roomData.current_turn_player_id || null);
          loadPlayers(room.id);
        }

        // 게임 종료 감지
        if (roomData.status === 'finished' && gameStatus !== 'finished') {
          console.log('⚠️ 폴링으로 게임 종료 감지');
          setGameStatus('finished');
          loadPlayers(room.id);
        }

        // 턴 변경 감지 (연결 끊김 시 fallback)
        if (connectionStatus === 'disconnected') {
          if (roomData.current_turn !== currentTurn || roomData.current_turn_player_id !== currentTurnPlayerId) {
            console.log('⚠️ 폴링으로 턴 변경 감지 (웹소켓 끊김 상태)');
            setCurrentTurn(roomData.current_turn || 0);
            setCurrentTurnPlayerId(roomData.current_turn_player_id || null);
            setMyVote(null);
            loadPlayers(room.id);
          }

          // 플레이어 목록 주기적 갱신
          loadPlayers(room.id);
        }
      }
    };

    // 웹소켓 끊김 시에는 항상 폴링, 정상 연결 시에는 playing일 때만
    const shouldPoll = connectionStatus === 'disconnected' || gameStatus === 'playing';

    if (shouldPoll) {
      const interval = setInterval(
        pollGameStatus,
        connectionStatus === 'disconnected' ? 2000 : 3000
      );
      return () => clearInterval(interval);
    }
  }, [room, gameStatus, connectionStatus, currentTurn, currentTurnPlayerId, loadPlayers]);

  const currentTurnPlayer = players.find(p => p.id === currentTurnPlayerId) || null;
  const hasSubmittedStatements = myStatement !== null;
  const hasVoted = myVote !== null;

  // WebSocket 연결 정리 함수
  const cleanup = useCallback(() => {
    console.log('🧹 WebSocket 연결 정리 시작');

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    setConnectionStatus('disconnected');
    console.log('✅ WebSocket 연결 정리 완료');
  }, []);

  return {
    room,
    players,
    gameStatus,
    currentTurn,
    currentTurnPlayerId,
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
    presenceState,
    cleanup,
  };
}
