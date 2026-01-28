import { GameAction } from '../common/types';

/**
 * 베스킨라빈스31 게임 상태
 */
export interface BaskinRobbins31GameState {
  current_number: number; // 현재까지 말한 숫자 (0~31)
  current_turn_player_id: string | null; // 현재 턴 플레이어 ID
  numbers_in_current_turn: number[]; // 현재 턴에서 말한 숫자들 (1~3개)
  current_mission_id?: string; // 현재 턴의 미션 ID (7턴마다 할당)
  turn_count: number; // 현재 턴 번호 (미션 발동 주기 계산용)
}

/**
 * 베스킨라빈스31 숫자 호출 액션
 */
export interface BaskinRobbins31CallNumbersAction extends GameAction {
  type: 'call_numbers';
  payload: {
    numbers: number[]; // 말한 숫자들 (1~3개)
  };
}

export type BaskinRobbins31GameAction = BaskinRobbins31CallNumbersAction;
