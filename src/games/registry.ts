import { GameRegistryEntry } from './common/types';
import { nunchiEntry } from './nunchi';
import { threeSixNineEntry } from './three-six-nine';
import { twoTruthsEntry } from './two-truths';
import { baskinRobbins31Entry } from './baskinrobbins31';

/**
 * 게임 레지스트리
 * 새로운 게임을 추가하려면 여기에 등록하세요
 */
export const gameRegistry: Record<string, GameRegistryEntry> = {
  'NUNCHI': nunchiEntry,
  'THREE_SIX_NINE': threeSixNineEntry,
  'TWO_TRUTHS': twoTruthsEntry,
  'BASKIN_ROBBINS_31': baskinRobbins31Entry,
};

/**
 * 게임 타입으로 게임 정보 가져오기
 */
export function getGame(gameType: string): GameRegistryEntry | null {
  return gameRegistry[gameType] || null;
}

/**
 * 모든 게임 목록 가져오기
 */
export function getAllGames(): GameRegistryEntry[] {
  return Object.values(gameRegistry);
}

/**
 * 게임 등록
 */
export function registerGame(gameType: string, entry: GameRegistryEntry) {
  gameRegistry[gameType] = entry;
}
