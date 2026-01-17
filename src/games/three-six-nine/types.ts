import { GameAction } from '../common/types';

/**
 * 369 게임 상태
 */
export interface ThreeSixNineGameState {
  /** 현재 숫자 */
  current_number: number;
  /** 마지막 액션 타임스탬프 */
  last_action_timestamp: number | null;
}

/**
 * 369 게임 액션 타입
 */
export type ThreeSixNineActionType = 'say_number' | 'clap_once' | 'clap_twice' | 'clap_thrice';

/**
 * 369 게임 액션 payload
 */
export interface ThreeSixNineActionPayload {
  actionType: ThreeSixNineActionType;
  expectedNumber: number;
}

/**
 * 369 게임 액션
 */
export interface ThreeSixNineGameAction extends GameAction<ThreeSixNineActionPayload> {
  type: 'player_action';
}

/**
 * 369 박수 횟수 계산 결과
 */
export interface ClapCount {
  count: number;
  positions: number[]; // 3, 6, 9가 있는 자릿수
}
