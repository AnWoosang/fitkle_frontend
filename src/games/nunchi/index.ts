import { GameRegistryEntry } from '../common/types';
import { nunchiGame } from './NunchiGame';
import { NunchiGameBoard } from './NunchiGameBoard';
import { NunchiRules } from './NunchiRules';

export const nunchiEntry: GameRegistryEntry = {
  game: nunchiGame,
  components: {
    GameBoard: NunchiGameBoard,
    RulesContent: NunchiRules,
  },
};

export * from './NunchiGame';
export * from './NunchiGameBoard';
export * from './NunchiRules';
export * from './types';
