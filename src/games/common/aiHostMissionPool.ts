import { AIHostMission } from './AIHostMissionCard';

/**
 * AI 호스트 미션 풀
 *
 * MVP 버전: 미리 정의된 미션들을 랜덤하게 할당
 * 향후 버전: 실제 AI가 상황에 맞게 동적으로 생성
 */

// 제스처 타입별 미션 그룹 (비언어적 표현 + 말투 강화)
export const MISSION_POOL: AIHostMission[] = [
  // 1. 강남스타일 - 춤추면서 + 과장된 톤
  {
    id: 'mission-gangnam-style',
    gifUrl: '/gifs/motions/gangnam-style.gif',
    gesture: 'mission_gesture_gangnam_style',
    speechStyle: 'mission_speech_exaggerated',
    action: 'mission_action_dance_while_speaking',
  },

  // 2. 살사 댄스 1 - 몸 흔들며 + 속삭이듯
  {
    id: 'mission-salsa-1',
    gifUrl: '/gifs/motions/salsa-dancing.gif',
    gesture: 'mission_gesture_salsa_dance',
    speechStyle: 'mission_speech_whisper',
    action: 'mission_action_sway_body',
  },

  // 3. 살사 댄스 2 - 손뼉 치며 + 노래하듯
  {
    id: 'mission-salsa-2',
    gifUrl: '/gifs/motions/salsa-dancing-2.gif',
    gesture: 'mission_gesture_salsa_dance_2',
    speechStyle: 'mission_speech_singing',
    action: 'mission_action_clap_hands',
  },

  // 4. 골프 스윙 - 스윙 모션 + 심각한 톤
  {
    id: 'mission-golf-swing',
    gifUrl: '/gifs/motions/golf-drive.gif',
    gesture: 'mission_gesture_golf_swing',
    speechStyle: 'mission_speech_serious',
    action: 'mission_action_swing_before_speak',
  },

  // 5. 우아한 포즈 - 포즈 취하며 + 귀족처럼
  {
    id: 'mission-elegant-pose',
    gifUrl: '/gifs/motions/female-standing-pose.gif',
    gesture: 'mission_gesture_elegant_pose',
    speechStyle: 'mission_speech_noble',
    action: 'mission_action_pose_while_speak',
  },

  // 6. 재미있게 달리기 - 제자리 뛰며 + 숨차게
  {
    id: 'mission-goofy-run',
    gifUrl: '/gifs/motions/goofy-running.gif',
    gesture: 'mission_gesture_running_motion',
    speechStyle: 'mission_speech_breathless',
    action: 'mission_action_jump_in_place',
  },

  // 7. 힙합 댄스 - 손가락 튕기며 + 랩하듯
  {
    id: 'mission-hiphop-dance',
    gifUrl: '/gifs/motions/snake-hip-hop-dance.gif',
    gesture: 'mission_gesture_hiphop_dance',
    speechStyle: 'mission_speech_rap',
    action: 'mission_action_snap_fingers',
  },

  // 8. 팔 흔들기 - 눈 감고 + 외치듯
  {
    id: 'mission-wave-arms',
    gifUrl: '/gifs/motions/motion1.gif',
    gesture: 'mission_gesture_wave_arms',
    speechStyle: 'mission_speech_shouting',
    action: 'mission_action_eyes_closed',
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
