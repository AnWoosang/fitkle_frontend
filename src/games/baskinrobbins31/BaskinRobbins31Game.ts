import { IGame } from '../common/types';
import { Player } from '@/types/game';
import { BaskinRobbins31GameState, BaskinRobbins31GameAction } from './types';

/**
 * 베스킨라빈스31 게임 구현
 *
 * 게임 규칙:
 * - 플레이어들이 순서대로 1부터 31까지 숫자를 센다
 * - 각 플레이어는 한 번에 1개, 2개, 또는 3개의 숫자를 말할 수 있다
 * - 31을 말하는 플레이어가 탈락한다
 * - 마지막 생존자가 승리한다
 */
export class BaskinRobbins31Game implements IGame<BaskinRobbins31GameState, BaskinRobbins31GameAction> {
  readonly type = 'BASKIN_ROBBINS_31';
  readonly name = {
    ko: '베스킨라빈스31',
    en: 'Baskin Robbins 31',
    ja: 'バスキンロビンス31',
    zh: '31冰淇淋',
    es: 'Baskin Robbins 31',
  };
  readonly description = {
    ko: '31을 말하면 안 돼요!',
    en: "Don't say 31!",
    ja: '31を言ってはいけません！',
    zh: '不要说31！',
    es: '¡No digas 31!',
  };
  readonly minPlayers = 2;
  readonly maxPlayers = 10;
  readonly icon = '🇰🇷';

  createInitialState(): BaskinRobbins31GameState {
    return {
      current_number: 0,
      current_turn_player_id: null,
      numbers_in_current_turn: [],
    };
  }

  canStart(players: Player[], gameState: BaskinRobbins31GameState): boolean {
    const nonHostPlayers = players.filter((p, index) => index !== 0);
    const allReady = nonHostPlayers.length > 0 && nonHostPlayers.every(p => p.is_ready);
    return players.length >= this.minPlayers && allReady;
  }

  onStart(players: Player[], gameState: BaskinRobbins31GameState): BaskinRobbins31GameState {
    // 게임 시작 시 첫 번째 플레이어(호스트)가 시작
    return {
      current_number: 0,
      current_turn_player_id: players[0].id,
      numbers_in_current_turn: [],
    };
  }

  handleEvent(
    action: BaskinRobbins31GameAction,
    players: Player[],
    gameState: BaskinRobbins31GameState
  ): {
    newState: BaskinRobbins31GameState;
    updatedPlayers?: Partial<Player>[];
    broadcastEvent?: any;
  } {
    console.log('🍦 BaskinRobbins31Game.handleEvent:', { action, gameState, playersCount: players.length });

    if (action.type !== 'call_numbers') {
      console.log('❌ Invalid action type:', action.type);
      return { newState: gameState };
    }

    const { numbers } = action.payload;
    const { current_number, current_turn_player_id, numbers_in_current_turn } = gameState;

    // 유효성 검사
    if (numbers.length < 1 || numbers.length > 3) {
      console.log('❌ Invalid numbers length:', numbers.length);
      return { newState: gameState };
    }

    // 현재 턴 플레이어인지 확인
    if (action.playerId !== current_turn_player_id) {
      console.log('❌ Not player turn:', { playerId: action.playerId, currentTurnPlayerId: current_turn_player_id });
      return { newState: gameState };
    }

    // 연속된 숫자인지 확인
    const expectedNumbers = Array.from({ length: numbers.length }, (_, i) => current_number + i + 1);
    const isValidSequence = numbers.every((num, idx) => num === expectedNumbers[idx]);

    if (!isValidSequence) {
      return { newState: gameState };
    }

    const newCurrentNumber = numbers[numbers.length - 1];

    // 이전 턴과 같은 개수를 선택했는지 확인 (게임 시작 후 첫 턴이 아닌 경우)
    const previousCount = numbers_in_current_turn.length;
    if (previousCount > 0 && numbers.length === previousCount) {
      console.log('🍦💀 Player used same count as previous turn! Eliminating:', action.playerName);
      // 규칙 위반으로 현재 플레이어 탈락
      const updatedPlayers: Partial<Player>[] = [{
        id: action.playerId,
        is_alive: false,
      }];

      // 다음 플레이어 찾기 (탈락자 제외)
      const alivePlayers = players.filter(p => p.is_alive && p.id !== action.playerId);
      const currentPlayerIndex = players.filter(p => p.is_alive).findIndex(p => p.id === action.playerId);
      const nextPlayerIndex = currentPlayerIndex % alivePlayers.length;
      const nextPlayer = alivePlayers[nextPlayerIndex];

      return {
        newState: {
          current_number: newCurrentNumber, // 현재 숫자 유지 (게임 계속)
          current_turn_player_id: nextPlayer?.id || null,
          numbers_in_current_turn: numbers, // 방금 말한 숫자들 저장
        },
        updatedPlayers,
        broadcastEvent: {
          type: 'player_eliminated',
          player_id: action.playerId,
          player_name: action.playerName,
          numbers,
          reason: 'same_count_as_previous',
          previous_count: previousCount,
          timestamp: action.timestamp,
        },
      };
    }

    // 31을 말했는지 확인
    if (newCurrentNumber >= 31) {
      console.log('🍦💀 Player said 31! Eliminating:', action.playerName);
      // 현재 플레이어 탈락
      const updatedPlayers: Partial<Player>[] = [{
        id: action.playerId,
        is_alive: false,
      }];

      // 다음 플레이어 찾기 (탈락자 제외)
      const alivePlayers = players.filter(p => p.is_alive && p.id !== action.playerId);
      const currentPlayerIndex = players.filter(p => p.is_alive).findIndex(p => p.id === action.playerId);
      const nextPlayerIndex = currentPlayerIndex % alivePlayers.length;
      const nextPlayer = alivePlayers[nextPlayerIndex];

      return {
        newState: {
          current_number: newCurrentNumber, // 현재 숫자 유지 (31에 도달)
          current_turn_player_id: nextPlayer?.id || null,
          numbers_in_current_turn: numbers, // 방금 말한 숫자들 저장
        },
        updatedPlayers,
        broadcastEvent: {
          type: 'player_eliminated',
          player_id: action.playerId,
          player_name: action.playerName,
          numbers,
          reason: 'said_31',
          timestamp: action.timestamp,
        },
      };
    }

    // 다음 플레이어 찾기
    const alivePlayers = players.filter(p => p.is_alive);
    const currentPlayerIndex = alivePlayers.findIndex(p => p.id === action.playerId);
    const nextPlayerIndex = (currentPlayerIndex + 1) % alivePlayers.length;
    const nextPlayer = alivePlayers[nextPlayerIndex];

    const newState: BaskinRobbins31GameState = {
      current_number: newCurrentNumber,
      current_turn_player_id: nextPlayer.id,
      numbers_in_current_turn: numbers,
    };

    return {
      newState,
      broadcastEvent: {
        type: 'numbers_called',
        player_id: action.playerId,
        player_name: action.playerName,
        numbers,
        current_number: newCurrentNumber,
        next_player_id: nextPlayer.id,
        next_player_name: nextPlayer.nickname,
        timestamp: action.timestamp,
      },
    };
  }

  checkGameEnd(players: Player[], gameState: BaskinRobbins31GameState): boolean {
    const alivePlayers = players.filter(p => p.is_alive);
    // 생존자가 1명 이하면 게임 종료
    const shouldEnd = alivePlayers.length <= 1;
    console.log('🍦🏁 Checking game end:', {
      alivePlayers: alivePlayers.length,
      totalPlayers: players.length,
      shouldEnd
    });
    return shouldEnd;
  }

  onReset(players: Player[]): BaskinRobbins31GameState {
    return this.createInitialState();
  }
}

export const baskinRobbins31Game = new BaskinRobbins31Game();
