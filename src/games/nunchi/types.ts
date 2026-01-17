import { GameAction } from '../common/types';

/**
 * 눈치게임 상태
 */
export interface NunchiGameState {
  current_number: number;
  last_call_timestamp: number | null;
  called_player_ids: string[]; // 현재 라운드에서 숫자를 외친 플레이어 ID 목록
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
