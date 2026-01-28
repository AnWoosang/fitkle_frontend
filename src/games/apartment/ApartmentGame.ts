import { IGame } from '../common/types';
import { Player } from '@/types/game';
import { ApartmentGameState, ApartmentGameAction } from './types';

/**
 * 아파트 게임 구현
 */
export class ApartmentGame implements IGame<ApartmentGameState, ApartmentGameAction> {
  readonly type = 'APARTMENT';
  readonly name = {
    ko: '아파트',
    en: 'Apartment',
    ja: 'アパート',
    zh: '公寓',
    es: 'Apartamento',
  };
  readonly description = {
    ko: '손을 쌓고 빼는 게임!',
    en: 'Stack and remove hands!',
    ja: '手を積み重ねて取るゲーム！',
    zh: '堆叠和移除手的游戏！',
    es: '¡Apila y retira las manos!',
  };
  readonly minPlayers = 3;
  readonly maxPlayers = 10;
  readonly icon = '🇰🇷';

  createInitialState(): ApartmentGameState {
    return {
      defeated_player_id: null,
    };
  }

  canStart(players: Player[], gameState: ApartmentGameState): boolean {
    const nonHostPlayers = players.filter((p, index) => index !== 0);
    const allReady = nonHostPlayers.length > 0 && nonHostPlayers.every(p => p.is_ready);
    return players.length >= this.minPlayers && allReady;
  }

  onStart(players: Player[], gameState: ApartmentGameState): ApartmentGameState {
    return {
      defeated_player_id: null,
    };
  }

  handleEvent(
    action: ApartmentGameAction,
    players: Player[],
    gameState: ApartmentGameState
  ): {
    newState: ApartmentGameState;
    updatedPlayers?: Partial<Player>[];
    broadcastEvent?: any;
  } {
    if (action.type !== 'declare_defeat') {
      return { newState: gameState };
    }

    // 패배 선언한 플레이어를 탈락시킴
    const defeatedPlayer = players.find(p => p.id === action.playerId);

    const newState: ApartmentGameState = {
      defeated_player_id: action.playerId,
    };

    const updatedPlayers: Partial<Player>[] = [{
      id: action.playerId,
      is_alive: false,
    }];

    return {
      newState,
      updatedPlayers,
      broadcastEvent: {
        type: 'player_eliminated',
        player_id: action.playerId,
        player_name: action.playerName,
        reason: 'defeat',
        timestamp: action.timestamp,
      },
    };
  }

  checkGameEnd(players: Player[], gameState: ApartmentGameState): boolean {
    // 패배 선언한 플레이어가 있으면 게임 종료
    return gameState.defeated_player_id !== null;
  }

  onReset(players: Player[]): ApartmentGameState {
    return this.createInitialState();
  }
}

export const apartmentGame = new ApartmentGame();
