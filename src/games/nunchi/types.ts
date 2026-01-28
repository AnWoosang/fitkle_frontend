import { GameAction } from '../common/types';

/**
 * 눈치게임 상태
 */
export interface NunchiGameState {
  current_number: number;
  last_call_timestamp: number | null;
  called_player_ids: string[]; // 현재 라운드에서 숫자를 외친 플레이어 ID 목록
  current_mission_id?: string; // 현재 턴의 미션 ID (7턴마다 할당)
  turn_count: number; // 현재 턴 번호 (미션 발동 주기 계산용)
  first_turn_player_id?: string; // 첫 번째로 1을 외쳐야 하는 플레이어 ID (호스트)
}

/**
 * 눈치게임 액션
 */
export interface NunchiCallNumberAction extends GameAction {
  type: 'call_number';
  payload: {
    number: number;
  };
}

export type NunchiGameAction = NunchiCallNumberAction;
