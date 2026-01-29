import { AIHostMission } from './AIHostMissionCard';

/**
 * AI 호스트 미션 풀
 *
 * MVP 버전: 미리 정의된 미션들을 랜덤하게 할당
 * 향후 버전: 실제 AI가 상황에 맞게 동적으로 생성
 */

// 간단한 모션만 사용 (5개)
export const MISSION_POOL: AIHostMission[] = [
  // 1. 우아한 포즈
  {
    id: 'mission-elegant-pose',
    gifUrl: '/gifs/motions/female-standing-pose.gif',
    gesture: 'mission_gesture_simple',
    action: 'mission_action_simple',
  },

  // 2. 강남스타일
  {
    id: 'mission-gangnam-style',
    gifUrl: '/gifs/motions/gangnam-style.gif',
    gesture: 'mission_gesture_simple',
    action: 'mission_action_simple',
  },

  // 3. 골프 스윙
  {
    id: 'mission-golf-swing',
    gifUrl: '/gifs/motions/golf-drive.gif',
    gesture: 'mission_gesture_simple',
    action: 'mission_action_simple',
  },

  // 4. 팔 흔들기
  {
    id: 'mission-wave-arms',
    gifUrl: '/gifs/motions/motion1.gif',
    gesture: 'mission_gesture_simple',
    action: 'mission_action_simple',
  },

  // 5. 재미있게 달리기
  {
    id: 'mission-goofy-run',
    gifUrl: '/gifs/motions/goofy-running.gif',
    gesture: 'mission_gesture_simple',
    action: 'mission_action_simple',
  },
];

/**
 * 랜덤하게 미션 선택
 */
export function getRandomMission(): AIHostMission {
  const randomIndex = Math.floor(Math.random() * MISSION_POOL.length);
  return MISSION_POOL[randomIndex];
}

/**
 * 이전 미션과 다른 랜덤 미션 선택
 * @param previousMissionId 이전 미션 ID (없으면 undefined)
 */
export function getRandomMissionExcluding(previousMissionId?: string): AIHostMission {
  if (!previousMissionId || MISSION_POOL.length <= 1) {
    return getRandomMission();
  }

  // 이전 미션을 제외한 미션 풀
  const availableMissions = MISSION_POOL.filter(m => m.id !== previousMissionId);

  if (availableMissions.length === 0) {
    return getRandomMission();
  }

  const randomIndex = Math.floor(Math.random() * availableMissions.length);
  return availableMissions[randomIndex];
}

/**
 * 참가자별로 중복되지 않는 미션 할당
 * @param playerCount 참가자 수
 * @returns 각 참가자에게 할당된 미션 배열
 */
export function assignMissionsToPlayers(playerCount: number): AIHostMission[] {
  // 미션 풀을 셔플
  const shuffled = [...MISSION_POOL].sort(() => Math.random() - 0.5);

  // 참가자 수만큼 미션 할당 (참가자가 미션보다 많으면 재사용)
  const missions: AIHostMission[] = [];
  for (let i = 0; i < playerCount; i++) {
    missions.push(shuffled[i % shuffled.length]);
  }

  return missions;
}

/**
 * 특정 플레이어에게 미션 할당
 * @param playerId 플레이어 ID
 * @param allPlayers 모든 플레이어 ID 배열
 * @returns 할당된 미션
 */
export function getMissionForPlayer(playerId: string, allPlayers: string[]): AIHostMission {
  const playerIndex = allPlayers.indexOf(playerId);
  const missions = assignMissionsToPlayers(allPlayers.length);
  return missions[playerIndex] || getRandomMission();
}
