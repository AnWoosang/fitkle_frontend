import { IGame } from '../common/types';
import { Player } from '@/types/game';
import { NunchiGameState, NunchiGameAction } from './types';

const COLLISION_THRESHOLD_MS = 500;

/**
 * 눈치게임 구현
 */
export class NunchiGame implements IGame<NunchiGameState, NunchiGameAction> {
  readonly type = 'NUNCHI';
  readonly name = {
    ko: '눈치게임',
    en: 'Nunchi Game',
    ja: '目測ゲーム',
    zh: '眼力游戏',
    es: 'Juego de Nunchi',
  };
  readonly description = {
    ko: '타이밍을 맞춰 숫자를 외치세요!',
    en: 'Call out numbers at the right time!',
    ja: 'タイミングを合わせて数字を叫ぼう！',
    zh: '把握时机喊出数字！',
    es: '¡Grita números en el momento adecuado!',
  };
  readonly minPlayers = 3;
  readonly maxPlayers = 10;
  readonly icon = '🇰🇷';

  createInitialState(): NunchiGameState {
    return {
      current_number: 0,
      last_call_timestamp: null,
      called_player_ids: [],
    };
  }

  canStart(players: Player[], gameState: NunchiGameState): boolean {
    const nonHostPlayers = players.filter((p, index) => index !== 0);
    const allReady = nonHostPlayers.length > 0 && nonHostPlayers.every(p => p.is_ready);
    return players.length >= this.minPlayers && allReady;
  }

  onStart(players: Player[], gameState: NunchiGameState): NunchiGameState {
    return {
      current_number: 0,
      last_call_timestamp: null,
      called_player_ids: [],
    };
  }

  handleEvent(
    action: NunchiGameAction,
    players: Player[],
    gameState: NunchiGameState
  ): {
    newState: NunchiGameState;
    updatedPlayers?: Partial<Player>[];
    broadcastEvent?: any;
  } {
    if (action.type !== 'call_number') {
      return { newState: gameState };
    }

    const { number } = action.payload;
    const { current_number, last_call_timestamp, called_player_ids } = gameState;

    // 충돌 검사
    const timeSinceLastCall = last_call_timestamp
      ? action.timestamp - last_call_timestamp
      : Infinity;

    const isCollision = timeSinceLastCall < COLLISION_THRESHOLD_MS;

    if (isCollision) {
      // 충돌 발생 - 두 플레이어 모두 탈락
      const updatedPlayers: Partial<Player>[] = players
        .filter(p => p.is_alive && (p.id === action.playerId || timeSinceLastCall < COLLISION_THRESHOLD_MS))
        .map(p => ({ id: p.id, is_alive: false }));

      // 충돌 시 라운드 리셋
      return {
        newState: {
          current_number: 0,
          last_call_timestamp: null,
          called_player_ids: [],
        },
        updatedPlayers,
        broadcastEvent: {
          type: 'player_eliminated',
          player_id: action.playerId,
          player_name: action.playerName,
          number,
          reason: 'collision',
          timestamp: action.timestamp,
        },
      };
    }

    // 현재 플레이어를 호출 목록에 추가
    const newCalledPlayerIds = [...called_player_ids, action.playerId];

    // 정상 호출
    const newState: NunchiGameState = {
      current_number: number,
      last_call_timestamp: action.timestamp,
      called_player_ids: newCalledPlayerIds,
    };

    // 마지막 한 명 남았는지 확인 (n명 중 n-1명이 호출했는지)
    const alivePlayers = players.filter(p => p.is_alive);
    const targetNumber = alivePlayers.length - 1;

    if (number >= targetNumber) {
      // n-1명이 호출 완료 -> 호출하지 않은 마지막 1명 찾기
      const lastPlayer = alivePlayers.find(p => !newCalledPlayerIds.includes(p.id));
      const updatedPlayers: Partial<Player>[] = lastPlayer ? [{ id: lastPlayer.id, is_alive: false }] : [];

      // 다음 라운드를 위해 상태 리셋
      const resetState: NunchiGameState = {
        current_number: 0,
        last_call_timestamp: null,
        called_player_ids: [],
      };

      return {
        newState: resetState,
        updatedPlayers,
        broadcastEvent: {
          type: 'player_eliminated',
          player_id: lastPlayer?.id || '',
          player_name: lastPlayer?.nickname || '',
          number,
          reason: 'last_remaining',
          timestamp: action.timestamp,
        },
      };
    }

    return {
      newState,
      broadcastEvent: {
        type: 'number_called',
        player_id: action.playerId,
        player_name: action.playerName,
        number,
        timestamp: action.timestamp,
      },
    };
  }

  checkGameEnd(players: Player[], gameState: NunchiGameState): boolean {
    const alivePlayers = players.filter(p => p.is_alive);
    const eliminatedPlayers = players.filter(p => !p.is_alive);
    // 눈치게임은 탈락자가 1명이라도 발생하면 즉시 게임 종료
    return eliminatedPlayers.length > 0;
  }

  onReset(players: Player[]): NunchiGameState {
    return this.createInitialState();
  }
}

export const nunchiGame = new NunchiGame();
