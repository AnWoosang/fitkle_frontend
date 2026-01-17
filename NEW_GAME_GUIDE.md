# 새 게임 추가 가이드

이제 게임을 쉽게 추가할 수 있습니다! 아래 단계를 따라하세요.

## 🚀 빠른 시작 (5단계)

### 1️⃣ 게임 타입 추가
**파일**: `src/types/game.ts`

```typescript
export enum GameType {
  NUNCHI = 'NUNCHI',
  LIAR = 'LIAR',        // ✅ 새 게임 추가
  WORDCHAIN = 'WORDCHAIN', // ✅ 새 게임 추가
}
```

### 2️⃣ 게임 메타데이터 등록
**파일**: `src/types/game.ts`

```typescript
export const GAME_REGISTRY: Record<GameType, GameMetadata> = {
  [GameType.NUNCHI]: {
    id: GameType.NUNCHI,
    minPlayers: 3,
    maxPlayers: 10,
    icon: '🔢',
  },
  // ✅ 새 게임 등록
  [GameType.LIAR]: {
    id: GameType.LIAR,
    minPlayers: 4,
    maxPlayers: 8,
    icon: '🤥',
  },
};
```

### 3️⃣ 번역 추가
**파일**: `src/i18n/translations.ts`

각 언어별로 게임 이름 추가:

```typescript
export const translations = {
  ko: {
    // Game Names
    NUNCHI: '눈치게임',
    LIAR: '라이어게임',  // ✅ 추가
    nunchiGameDescription: '타이밍을 맞춰 숫자를 외치세요!',
    liarGameDescription: '라이어를 찾아내세요!',  // ✅ 추가
  },
  en: {
    NUNCHI: 'Nunchi Game',
    LIAR: 'Liar Game',  // ✅ 추가
    // ...
  },
  // ja, zh, es도 동일하게 추가
};
```

### 4️⃣ 게임 로직 훅 생성
**파일**: `src/hooks/useLiarGame.ts` (새로 생성)

기존 `useNunchiGame.ts`를 복사해서 수정:

```bash
cp src/hooks/useNunchiGame.ts src/hooks/useLiarGame.ts
```

그리고 게임 규칙에 맞게 수정:
- 함수 이름: `useNunchiGame` → `useLiarGame`
- 게임 로직 커스터마이징

### 5️⃣ 게임 페이지에서 분기 처리
**파일**: `src/app/room/[code]/page.tsx`

```typescript
import { useNunchiGame } from '@/hooks/useNunchiGame';
import { useLiarGame } from '@/hooks/useLiarGame';  // ✅ 추가

export default function RoomPage() {
  // ... 기존 코드 ...

  // ✅ 게임 타입에 따라 다른 훅 사용
  const gameType = room?.game_type || GameType.NUNCHI;

  const gameHook = gameType === GameType.NUNCHI
    ? useNunchiGame
    : useLiarGame;

  const {
    room,
    players,
    // ...
  } = gameHook({
    roomCode: code || '',
    playerId: playerId || '',
    playerName: playerName || '',
  });

  // ... 나머지 코드 ...
}
```

## 📋 완료 체크리스트

- [ ] 1. `GameType` enum에 새 게임 타입 추가
- [ ] 2. `GAME_REGISTRY`에 게임 메타데이터 등록
- [ ] 3. 5개 언어 모두에 번역 추가 (ko, en, ja, zh, es)
- [ ] 4. 게임 로직 훅 생성 (`use[GameName]Game.ts`)
- [ ] 5. `room/[code]/page.tsx`에서 게임 타입별 분기 추가

## 🎯 MVP 팁

- 게임 로직 훅은 `useNunchiGame.ts`를 복사해서 시작하세요
- 공통 로직 (방 관리, 플레이어 관리)은 그대로 재사용
- 게임별 규칙만 수정하면 됩니다

## 🗄️ DB 마이그레이션

**첫 실행 시 한 번만 필요**:
Supabase Dashboard → SQL Editor → `add_game_type_migration.sql` 실행

```sql
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS game_type TEXT NOT NULL DEFAULT 'NUNCHI';
```

## 예시: 라이어 게임 추가

전체 예시는 위 5단계를 참고하세요. 약 30분이면 완성됩니다!

---

**질문이 있으면 알려주세요!** 🚀
