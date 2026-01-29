import { ReactNode } from 'react';
import { Player, Room } from '@/types/game';
import { Language } from '@/contexts/LanguageContext';

/**
 * 게임 공통 인터페이스
 * 모든 게임은 이 인터페이스를 구현해야 함
 */
export interface IGame<TState = any, TEvent = any> {
  /** 게임 타입 ID */
  readonly type: string;

  /** 게임 이름 (다국어 지원) */
  readonly name: Record<string, string>;

  /** 게임 설명 (다국어 지원) */
  readonly description: Record<string, string>;

  /** 최소 플레이어 수 */
  readonly minPlayers: number;

  /** 최대 플레이어 수 */
  readonly maxPlayers: number;

  /** 게임 아이콘 */
  readonly icon: string;

  /**
   * 초기 게임 상태 생성
   */
  createInitialState(): TState;

  /**
   * 게임 시작 가능 여부 확인
   */
  canStart(players: Player[], gameState: TState): boolean;

  /**
   * 게임 시작
   */
  onStart(players: Player[], gameState: TState): TState;

  /**
   * 게임 이벤트 처리
   */
  handleEvent(event: TEvent, players: Player[], gameState: TState): {
    newState: TState;
    updatedPlayers?: Partial<Player>[];
    broadcastEvent?: any;
  };

  /**
   * 게임 종료 조건 확인
   */
  checkGameEnd(players: Player[], gameState: TState): boolean;

  /**
   * 게임 리셋
   */
  onReset(players: Player[]): TState;
}

/**
 * 게임 컴포넌트 인터페이스
 */
export interface IGameComponents {
  /** 게임 보드 컴포넌트 */
  GameBoard: React.ComponentType<GameBoardProps>;

  /** 게임 규칙 컴포넌트 */
  RulesContent: React.ComponentType<RulesContentProps>;

  /** 게임 결과 컴포넌트 (선택) */
  ResultContent?: React.ComponentType<ResultContentProps>;
}

/**
 * 게임 보드 Props
 */
export interface GameBoardProps {
  room: Room;
  players: Player[];
  gameState: any;
  currentPlayerId: string;
  onAction: (action: any) => Promise<void>;
  isMyTurn?: boolean;
  lastEvent?: any; // 마지막 브로드캐스트 이벤트
}

/**
 * 게임 규칙 Props
 */
export interface RulesContentProps {
  minPlayers: number;
  maxPlayers: number;
  language: Language;
}

/**
 * 게임 결과 Props
 */
export interface ResultContentProps {
  players: Player[];
  gameState: any;
  currentPlayerId: string;
  language: Language;
}

/**
 * 게임 레지스트리 항목
 */
export interface GameRegistryEntry {
  game: IGame;
  components: IGameComponents;
}

/**
 * 게임 상태 타입
 */
export interface BaseGameState {
  [key: string]: any;
}

/**
 * 게임 액션 타입
 */
export interface GameAction<T = any> {
  type: string;
  payload?: T;
  playerId: string;
  playerName: string;
  timestamp: number;
}
