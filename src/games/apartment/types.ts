import { GameAction } from '../common/types';

/**
 * 아파트 게임 상태
 */
export interface ApartmentGameState {
  defeated_player_id: string | null; // 패배 선언한 플레이어 ID
}

/**
 * 아파트 게임 액션
 */
export interface ApartmentDefeatAction extends GameAction {
  type: 'declare_defeat';
  payload: Record<string, never>;
}

export type ApartmentGameAction = ApartmentDefeatAction;
