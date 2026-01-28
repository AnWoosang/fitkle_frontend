# AI 호스트 미션 시스템 가이드

## 📌 개요

AI 호스트 미션 시스템은 참가자들에게 비언어적 행동 미션을 부여하여 자연스러운 아이스 브레이킹을 유도하는 MVP 기능입니다.

## 🎯 현재 구조 (MVP)

### 1. 미션 풀 (`aiHostMissionPool.ts`)

미리 정의된 8개의 미션으로 구성:
- 강남스타일 춤
- 살사 댄스 (2가지 버전)
- 골프 스윙
- 우아한 포즈
- 재미있게 달리기
- 힙합 댄스
- 팔 흔들기

### 2. 사용 가능한 함수들

```typescript
import {
  getRandomMission,           // 랜덤 미션 1개 선택
  assignMissionsToPlayers,    // 참가자별 중복 없이 미션 할당
  getMissionForPlayer,        // 특정 플레이어에게 미션 할당
  MISSION_POOL                // 전체 미션 배열 (8개)
} from '@/games/common/aiHostMissionPool';
```

### 3. 현재 테스트 구현

**파일**: `/src/app/room/[code]/page.tsx`

```typescript
// 랜덤 미션 선택 (컴포넌트 마운트 시 1회)
const [testMission] = useState(() => getRandomMission());

// 렌더링
{gameStatus === 'playing' && (
  <div style={{ gridColumn: '1 / -1', paddingLeft: '20px', paddingRight: '20px' }}>
    <AIHostMissionCard mission={testMission} language={language} />
  </div>
)}
```

## 🚀 향후 통합 방법

### Option 1: 플레이어별 고유 미션 (권장)

각 플레이어가 고유한 미션을 받도록 구현:

```typescript
// 게임 시작 시 서버에서 미션 할당
const assignMissions = async () => {
  const playerIds = players.map(p => p.id);
  const missions = assignMissionsToPlayers(playerIds.length);

  // Supabase에 저장
  await Promise.all(
    playerIds.map((playerId, index) =>
      supabase.from('player_missions').insert({
        player_id: playerId,
        room_id: room.id,
        mission_id: missions[index].id,
        mission_data: missions[index],
      })
    )
  );
};

// 클라이언트에서 자신의 미션 가져오기
const fetchMyMission = async () => {
  const { data } = await supabase
    .from('player_missions')
    .select('mission_data')
    .eq('player_id', currentPlayerId)
    .eq('room_id', room.id)
    .single();

  return data?.mission_data;
};
```

### Option 2: 라운드별 미션 변경

각 라운드마다 새로운 미션 할당:

```typescript
// 라운드 시작 시
useEffect(() => {
  if (gameState?.round_number) {
    setCurrentMission(getRandomMission());
  }
}, [gameState?.round_number]);
```

### Option 3: 실제 AI 통합 (최종 목표)

```typescript
// AI API를 통한 동적 미션 생성
const generateAIMission = async (context: GameContext) => {
  const response = await fetch('/api/ai/generate-mission', {
    method: 'POST',
    body: JSON.stringify({
      gameType: 'baskinrobbins31',
      playerCount: players.length,
      currentRound: gameState.round_number,
      playerHistory: playerHistory,
    }),
  });

  const aiMission = await response.json();
  return aiMission;
};
```

## 📁 파일 구조

```
src/games/common/
├── AIHostMissionCard.tsx          # 미션 카드 UI 컴포넌트
├── AIHostMissionCard.example.tsx  # 사용 예시
├── aiHostMissionPool.ts           # 미션 풀 및 로직
└── AI_HOST_MISSION_GUIDE.md       # 이 가이드

public/gifs/motions/
├── gangnam-style.gif
├── salsa-dancing.gif
├── salsa-dancing-2.gif
├── golf-drive.gif
├── female-standing-pose.gif
├── goofy-running.gif
├── snake-hip-hop-dance.gif
└── motion1.gif

src/i18n/translations.ts
└── mission_gesture_* (제스처 번역)
└── mission_action_* (행동 번역)
```

## 🎨 새로운 미션 추가 방법

### 1. GIF 파일 준비
`public/gifs/motions/` 에 GIF 파일 추가

### 2. 미션 풀에 추가
`src/games/common/aiHostMissionPool.ts`:

```typescript
export const MISSION_POOL: AIHostMission[] = [
  // ... 기존 미션들
  {
    id: 'mission-new-gesture',
    gifUrl: '/gifs/motions/new-gesture.gif',
    gesture: 'mission_gesture_new_gesture',
    action: 'mission_action_new_action',
  },
];
```

### 3. 번역 추가
`src/i18n/translations.ts`의 모든 언어에 번역 키 추가:

```typescript
// 한국어
mission_gesture_new_gesture: '새로운 동작을 하면서',
mission_action_new_action: '새로운 행동을 하세요!',

// 영어
mission_gesture_new_gesture: 'While doing new gesture',
mission_action_new_action: 'Do the new action!',

// ... (일본어, 중국어, 스페인어, 베트남어)
```

## 🔧 DB 스키마 (향후 구현 시)

```sql
-- 플레이어별 미션 테이블
CREATE TABLE player_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  mission_data JSONB NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(player_id, room_id)
);

-- 미션 완료 로그 (선택적)
CREATE TABLE mission_completion_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  mission_id TEXT NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

## 💡 MVP 개선 아이디어

1. **미션 난이도 시스템**: 쉬운/보통/어려운 미션 분류
2. **미션 카테고리**: 춤/포즈/제스처/말투 등으로 분류
3. **미션 포인트**: 미션 달성 시 추가 점수
4. **미션 힌트**: 다른 플레이어가 미션을 추측할 수 있는 힌트
5. **미션 통계**: 각 미션의 달성률 추적

## ⚠️ 주의사항

- 현재는 테스트 코드로 구현되어 있으며 `TEST` 주석으로 표시됨
- 프로덕션 배포 전 테스트 코드 제거 필요
- 미션 할당 로직은 서버 사이드에서 구현 권장 (보안)
- GIF 파일 크기 최적화 권장 (현재 일부 파일이 1.5MB 이상)

## 📝 참고

- AI 호스트 컨셉은 자연스러운 아이스 브레이킹 유도가 목적
- 미션은 비언어적 행동 중심으로 웃음 유발
- 다른 참가자는 누가 어떤 미션을 받았는지 모름 (비밀 미션)
