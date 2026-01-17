import { IGame } from '../common/types';
import { Player } from '@/types/game';
import { GameType } from '@/types/game';

/**
 * Two Truths and a Lie Game
 * 이 게임은 자체 훅(useTwoTruthsGame)을 사용하므로
 * 이 Game 객체는 메타데이터 제공용입니다.
 */
export const twoTruthsGame: IGame = {
  type: GameType.TWO_TRUTHS,

  name: {
    ko: '두 개의 진실, 하나의 거짓',
    en: 'Two Truths and a Lie',
    ja: '二つの真実と一つの嘘',
    zh: '两个真相与一个谎言',
    es: 'Dos Verdades y una Mentira',
  },

  description: {
    ko: '진실과 거짓을 맞춰보세요!',
    en: 'Guess the truth and the lie!',
    ja: '真実と嘘を当ててみよう！',
    zh: '猜猜真相与谎言！',
    es: '¡Adivina la verdad y la mentira!',
  },

  minPlayers: 3,
  maxPlayers: 10,
  icon: '🇺🇸',

  createInitialState() {
    return {};
  },

  canStart(players: Player[]) {
    return players.length >= this.minPlayers;
  },

  onStart(players: Player[], gameState: any) {
    return gameState;
  },

  handleEvent(event: any, players: Player[], gameState: any) {
    return { newState: gameState };
  },

  checkGameEnd(players: Player[], gameState: any) {
    return false;
  },

  onReset(players: Player[]) {
    return {};
  },
};
