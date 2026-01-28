/**
 * AI Host Mission Card 사용 예시
 *
 * 이 파일은 AIHostMissionCard 컴포넌트의 사용 방법을 보여주는 예시입니다.
 */

import { AIHostMissionCard, AIHostMission } from './AIHostMissionCard';

// 예시 미션 데이터
const exampleMissions: AIHostMission[] = [
  {
    id: 'mission-1',
    gifUrl: '/gifs/baskinrobins31.gif',
    gesture: 'mission_gesture_wave_arms', // 번역 키
    action: 'mission_action_shout_31', // 번역 키
    speechStyle: 'mission_speech_confident', // 번역 키
  },
  {
    id: 'mission-2',
    gifUrl: '/gifs/nunchi.gif',
    gesture: 'mission_gesture_hands_up',
    action: 'mission_action_call_first',
    speechStyle: 'mission_speech_quickly',
  },
  {
    id: 'mission-3',
    gifUrl: '/gifs/apartment.gif',
    gesture: 'mission_gesture_clap',
    action: 'mission_action_clap_twice',
  },
  {
    id: 'mission-4',
    gifUrl: '/gifs/baskinrobins31.gif',
    gesture: 'mission_gesture_squat',
    action: 'mission_action_stand_speak',
    speechStyle: 'mission_speech_slowly',
  },
  {
    id: 'mission-5',
    gifUrl: '/gifs/nunchi.gif',
    gesture: 'mission_gesture_eyes_closed',
    action: 'mission_action_speak_eyes_closed',
  },
];

// 게임 컴포넌트에서 사용하는 예시
export function GameBoardExample() {
  // 랜덤하게 미션 선택 (실제로는 서버나 상태 관리에서 가져옴)
  const randomMission = exampleMissions[Math.floor(Math.random() * exampleMissions.length)];

  return (
    <div>
      {/* 게임 헤더 */}
      <div style={{ padding: '16px' }}>
        <h2>베스킨라빈스31</h2>
        <p>방 코드: ABC123</p>
      </div>

      {/* AI 호스트 미션 카드 */}
      <AIHostMissionCard mission={randomMission} language="ko" />

      {/* 게임 컨텐츠 */}
      <div style={{ padding: '16px' }}>
        {/* 여기에 게임 UI가 들어감 */}
      </div>
    </div>
  );
}

// 미션이 없을 때 (카드가 표시되지 않음)
export function GameBoardWithoutMission() {
  return (
    <div>
      <div style={{ padding: '16px' }}>
        <h2>베스킨라빈스31</h2>
        <p>방 코드: ABC123</p>
      </div>

      {/* mission이 null이면 아무것도 렌더링되지 않음 */}
      <AIHostMissionCard mission={null} language="ko" />

      <div style={{ padding: '16px' }}>
        {/* 게임 UI */}
      </div>
    </div>
  );
}

/**
 * 실제 게임에서 미션 데이터를 관리하는 방법 예시:
 *
 * 1. 게임 시작 시 서버에서 각 플레이어에게 랜덤 미션 할당
 * 2. WebSocket으로 미션 데이터 전달
 * 3. 게임 상태에 미션 저장
 * 4. 게임이 진행되면서 미션 달성 여부 확인
 * 5. 미션을 달성하면 포인트 부여 또는 특별한 효과
 *
 * 예시 상태 관리:
 * ```typescript
 * interface GameState {
 *   currentMission: AIHostMission | null;
 *   missionCompleted: boolean;
 * }
 *
 * // 게임 중간에 미션 변경
 * function updateMission(newMission: AIHostMission) {
 *   setState({ currentMission: newMission, missionCompleted: false });
 * }
 * ```
 */
