import { IGame } from '../common/types';
import { Player } from '@/types/game';
import { ThreeSixNineGameState, ThreeSixNineGameAction, ClapCount } from './types';

/**
 * 숫자에서 3, 6, 9의 개수를 세는 함수
 */
function countClaps(num: number): ClapCount {
  const str = num.toString();
  const positions: number[] = [];
  let count = 0;

  for (let i = 0; i < str.length; i++) {
    const digit = str[i];
    if (digit === '3' || digit === '6' || digit === '9') {
      count++;
      positions.push(str.length - i - 1); // 자릿수 (0: 일의 자리, 1: 십의 자리...)
    }
  }

  return { count, positions };
}

/**
 * 369 게임 구현
 */
export class ThreeSixNineGame implements IGame<ThreeSixNineGameState, ThreeSixNineGameAction> {
  readonly type = 'THREE_SIX_NINE';
  readonly name = {
    ko: '369 게임',
    en: '369 Game',
    ja: '369ゲーム',
    zh: '369游戏',
    es: 'Juego 369',
  };
  readonly description = {
    ko: '3, 6, 9가 나오면 박수를 치세요!',
    en: 'Clap when 3, 6, or 9 appears!',
    ja: '3、6、9が出たら拍手しよう！',
    zh: '遇到3、6、9时拍手！',
    es: '¡Aplaude cuando aparezca 3, 6 o 9!',
  };
  readonly minPlayers = 2;
  readonly maxPlayers = 10;
  readonly icon = '🇰🇷';

  createInitialState(): ThreeSixNineGameState {
    return {
      current_number: 0,
      last_action_timestamp: null,
    };
  }

  canStart(players: Player[], gameState: ThreeSixNineGameState): boolean {
    const nonHostPlayers = players.filter((p, index) => index !== 0);
    const allReady = nonHostPlayers.length > 0 && nonHostPlayers.every(p => p.is_ready);
    return players.length >= this.minPlayers && allReady;
  }

  onStart(players: Player[], gameState: ThreeSixNineGameState): ThreeSixNineGameState {
    return {
      current_number: 0,
      last_action_timestamp: null,
    };
  }

  handleEvent(
    action: ThreeSixNineGameAction,
    players: Player[],
    gameState: ThreeSixNineGameState
  ): {
    newState: ThreeSixNineGameState;
    updatedPlayers?: Partial<Player>[];
    broadcastEvent?: any;
  } {
    if (action.type !== 'player_action' || !action.payload) {
      return { newState: gameState };
    }

    const { actionType, expectedNumber } = action.payload;
    const nextNumber = gameState.current_number + 1;

    // 숫자가 맞지 않으면 탈락 (순서가 꼬인 경우)
    if (expectedNumber !== nextNumber) {
      // 현재 생존자 수를 계산하여 순위 결정
      const alivePlayers = players.filter(p => p.is_alive);
      const rank = alivePlayers.length;

      const updatedPlayers: Partial<Player>[] = [
        { id: action.playerId, is_alive: false, score: rank }
      ];

      // 탈락 후 생존자가 1명만 남으면 그 사람을 1등으로 처리
      if (alivePlayers.length === 2) {
        const winner = alivePlayers.find(p => p.id !== action.playerId);
        if (winner) {
          updatedPlayers.push({ id: winner.id, score: 1 });
        }
      }

      return {
        newState: gameState,
        updatedPlayers,
        broadcastEvent: {
          type: 'player_eliminated',
          player_id: action.playerId,
          player_name: action.playerName,
          number: expectedNumber,
          reason: 'wrong_number',
          rank: rank,
          timestamp: action.timestamp,
        },
      };
    }

    // 현재 숫자에서 필요한 박수 횟수 계산
    const clapInfo = countClaps(nextNumber);
    const requiredClaps = clapInfo.count;

    // 플레이어의 액션이 올바른지 확인
    let isCorrect = false;

    if (requiredClaps === 0) {
      // 박수가 필요없는 경우 - 숫자를 말해야 함
      isCorrect = actionType === 'say_number';
    } else if (requiredClaps === 1) {
      // 박수 1번
      isCorrect = actionType === 'clap_once';
    } else if (requiredClaps === 2) {
      // 박수 2번
      isCorrect = actionType === 'clap_twice';
    } else if (requiredClaps >= 3) {
      // 박수 3번 이상 (3번 버튼으로 처리)
      isCorrect = actionType === 'clap_thrice';
    }

    // 틀린 경우 탈락
    if (!isCorrect) {
      // 현재 생존자 수를 계산하여 순위 결정 (생존자가 5명이면 6등)
      const alivePlayers = players.filter(p => p.is_alive);
      const rank = alivePlayers.length; // 탈락 시점의 생존자 수가 곧 순위

      const updatedPlayers: Partial<Player>[] = [
        { id: action.playerId, is_alive: false, score: rank }
      ];

      // 탈락 후 생존자가 1명만 남으면 그 사람을 1등으로 처리
      if (alivePlayers.length === 2) {
        const winner = alivePlayers.find(p => p.id !== action.playerId);
        if (winner) {
          updatedPlayers.push({ id: winner.id, score: 1 });
        }
      }

      return {
        newState: gameState,
        updatedPlayers,
        broadcastEvent: {
          type: 'player_eliminated',
          player_id: action.playerId,
          player_name: action.playerName,
          number: nextNumber,
          action: actionType,
          required_claps: requiredClaps,
          reason: 'wrong_action',
          rank: rank,
          timestamp: action.timestamp,
        },
      };
    }

    // 정답! 다음 숫자로 진행
    const newState: ThreeSixNineGameState = {
      current_number: nextNumber,
      last_action_timestamp: action.timestamp,
    };

    // 이 플레이어가 마지막 생존자인지 확인
    const alivePlayers = players.filter(p => p.is_alive);
    const isLastSurvivor = alivePlayers.length === 1 && alivePlayers[0].id === action.playerId;

    // 마지막 생존자라면 1등 부여
    const updatedPlayers: Partial<Player>[] | undefined = isLastSurvivor
      ? [{ id: action.playerId, score: 1 }]
      : undefined;

    return {
      newState,
      updatedPlayers,
      broadcastEvent: {
        type: isLastSurvivor ? 'game_won' : 'action_success',
        player_id: action.playerId,
        player_name: action.playerName,
        number: nextNumber,
        action: actionType,
        clap_count: requiredClaps,
        timestamp: action.timestamp,
      },
    };
  }

  checkGameEnd(players: Player[], gameState: ThreeSixNineGameState): boolean {
    const alivePlayers = players.filter(p => p.is_alive);
    // 369 게임은 생존자가 1명만 남으면 게임 종료
    return alivePlayers.length === 1;
  }

  onReset(players: Player[]): ThreeSixNineGameState {
    return this.createInitialState();
  }
}

export const threeSixNineGame = new ThreeSixNineGame();
