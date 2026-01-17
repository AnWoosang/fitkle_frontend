import { GameRegistryEntry } from '../common/types';
import { threeSixNineGame } from './ThreeSixNineGame';
import { ThreeSixNineGameBoard } from './ThreeSixNineGameBoard';
import { ThreeSixNineRules } from './ThreeSixNineRules';

export const threeSixNineEntry: GameRegistryEntry = {
  game: threeSixNineGame,
  components: {
    GameBoard: ThreeSixNineGameBoard,
    RulesContent: ThreeSixNineRules,
  },
};

export * from './ThreeSixNineGame';
export * from './ThreeSixNineGameBoard';
export * from './ThreeSixNineRules';
export * from './types';
