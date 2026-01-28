import { GameRegistryEntry } from '../common/types';
import { apartmentGame } from './ApartmentGame';
import { ApartmentGameBoard } from './ApartmentGameBoard';
import { ApartmentRules } from './ApartmentRules';

export const apartmentEntry: GameRegistryEntry = {
  game: apartmentGame,
  components: {
    GameBoard: ApartmentGameBoard,
    RulesContent: ApartmentRules,
  },
};

export * from './ApartmentGame';
export * from './ApartmentGameBoard';
export * from './ApartmentRules';
export * from './types';
