// 게임 타입 enum
export enum GameType {
  NUNCHI = 'NUNCHI',
  THREE_SIX_NINE = 'THREE_SIX_NINE',
  TWO_TRUTHS = 'TWO_TRUTHS',
  BASKIN_ROBBINS_31 = 'BASKIN_ROBBINS_31',
  // 새 게임 추가 시 여기에 추가
  // LIAR = 'LIAR',
  // WORDCHAIN = 'WORDCHAIN',
}

// 게임 메타데이터
export interface GameMetadata {
  id: GameType;
  minPlayers: number;
  maxPlayers: number;
  icon: string;
}

// 게임 레지스트리 (새 게임 추가 시 여기에 등록)
export const GAME_REGISTRY: Record<GameType, GameMetadata> = {
  [GameType.NUNCHI]: {
    id: GameType.NUNCHI,
    minPlayers: 3,
    maxPlayers: 10,
    icon: '🇰🇷',
  },
  [GameType.THREE_SIX_NINE]: {
    id: GameType.THREE_SIX_NINE,
    minPlayers: 2,
    maxPlayers: 10,
    icon: '🇰🇷',
  },
  [GameType.TWO_TRUTHS]: {
    id: GameType.TWO_TRUTHS,
    minPlayers: 3,
    maxPlayers: 10,
    icon: '🇺🇸',
  },
  [GameType.BASKIN_ROBBINS_31]: {
    id: GameType.BASKIN_ROBBINS_31,
    minPlayers: 2,
    maxPlayers: 10,
    icon: '🇰🇷',
  },
  // 새 게임 예시:
  // [GameType.LIAR]: {
  //   id: GameType.LIAR,
  //   minPlayers: 4,
  //   maxPlayers: 8,
  //   icon: '🤥',
  // },
};

export interface Room {
  id: string;
  code: string;
  host_id: string;
  game_type: GameType;
  status: 'waiting' | 'playing' | 'finished';
  max_players: number;
  current_number: number;
  current_turn: number | null;
  current_turn_player_id: string | null;
  is_deleted: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface Player {
  id: string;
  room_id: string | null;
  nickname: string;
  is_alive: boolean;
  is_ready: boolean;
  score: number | null;
  turn_order: number | null;
  joined_at: string;
  updated_at: string;
}

export interface GameEvent {
  id: string;
  room_id: string;
  player_id: string;
  number_called: number;
  called_at: string;
}

// Realtime Broadcast 이벤트 타입
export interface NumberCalledEvent {
  type: 'number_called';
  player_id: string;
  player_name: string;
  number: number;
  timestamp: number;
}

export interface GameStartEvent {
  type: 'game_start';
}

export interface GameEndEvent {
  type: 'game_end';
  winner_id: string | null;
  winner_name: string | null;
}

export interface PlayerEliminatedEvent {
  type: 'player_eliminated';
  player_id: string;
  player_name: string;
  reason: 'collision' | 'last_standing';
}

export interface PlayerReadyEvent {
  type: 'player_ready';
  player_id: string;
  player_name: string;
  is_ready: boolean;
}

export type GameBroadcastEvent =
  | NumberCalledEvent
  | GameStartEvent
  | GameEndEvent
  | PlayerEliminatedEvent
  | PlayerReadyEvent;

// Presence 타입
export interface PlayerPresence {
  id: string;
  nickname: string;
  is_alive: boolean;
  online_at: string;
}
