import { GameRegistryEntry } from '../common/types';
import { baskinRobbins31Game } from './BaskinRobbins31Game';
import { BaskinRobbins31GameBoard } from './BaskinRobbins31GameBoard';
import { BaskinRobbins31Rules } from './BaskinRobbins31Rules';

export const baskinRobbins31Entry: GameRegistryEntry = {
  game: baskinRobbins31Game,
  components: {
    GameBoard: BaskinRobbins31GameBoard,
    RulesContent: BaskinRobbins31Rules,
  },
};

export * from './BaskinRobbins31Game';
export * from './BaskinRobbins31GameBoard';
export * from './BaskinRobbins31Rules';
export * from './types';
