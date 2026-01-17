import { GameRegistryEntry, GameBoardProps } from '../common/types';
import { twoTruthsGame } from './TwoTruthsGame';
import { TwoTruthsGameBoard } from './TwoTruthsGameBoard';
import { TwoTruthsRules } from './TwoTruthsRules';

// TwoTruths는 별도의 wrapper(TwoTruthsRoomWrapper)를 사용하므로
// 여기서는 더미 컴포넌트를 제공합니다.
const TwoTruthsGameBoardWrapper = (props: GameBoardProps) => {
  return null; // TwoTruthsRoomWrapper에서 직접 TwoTruthsGameBoard를 렌더링
};

export const twoTruthsEntry: GameRegistryEntry = {
  game: twoTruthsGame,
  components: {
    GameBoard: TwoTruthsGameBoardWrapper,
    RulesContent: TwoTruthsRules,
  },
};

export * from './TwoTruthsGame';
export * from './TwoTruthsGameBoard';
export * from './TwoTruthsRules';
