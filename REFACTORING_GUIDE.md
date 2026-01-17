# 🎮 게임 아키텍처 리팩토링 가이드

## ✅ 완료된 작업

### 1. 데이터베이스 마이그레이션 (완료)
- ✅ `game_states` 테이블 생성 (게임별 상태를 JSONB로 저장)
- ✅ 기존 `rooms.current_number` 데이터를 `game_states`로 마이그레이션
- ✅ `updated_at` 자동 업데이트 트리거 추가
- ✅ `events` 테이블 구조 개선
- ✅ `players.turn_order` 컬럼 추가

### 2. 게임 추상화 레이어 구현 (완료)
새로운 폴더 구조:
```
src/games/
├── common/
│   ├── types.ts           # IGame 인터페이스, GameAction 등
│   └── useGameEngine.ts   # 공통 게임 엔진 훅
├── nunchi/
│   ├── NunchiGame.ts      # 눈치게임 로직 (IGame 구현)
│   ├── NunchiGameBoard.tsx # 눈치게임 보드 컴포넌트
│   ├── NunchiRules.tsx    # 눈치게임 규칙 컴포넌트
│   ├── types.ts           # 눈치게임 타입
│   └── index.ts           # 내보내기
└── registry.ts            # 게임 레지스트리 (눈치게임 등록됨)
```

### 3. 타입 정의 업데이트 (완료)
- ✅ `Room` 타입에서 `current_number` 제거, `updated_at` 추가
- ✅ `database.ts`에 `game_states` 테이블 타입 추가

## 🚧 진행 중인 작업

### 기존 코드를 새 구조로 마이그레이션

현재 `src/app/room/[code]/page.tsx`는 아직 기존 `useNunchiGame` 훅을 사용하고 있습니다.
새 구조로 마이그레이션하려면 다음 작업이 필요합니다:

1. **useNunchiGame → useGameEngine 교체**
2. **게임별 컴포넌트 동적 로딩**
3. **game_states 테이블 사용**

## 📋 새 게임 추가 방법 (리팩토링 완료 후)

### 1단계: 게임 로직 구현

```typescript
// src/games/three-six-nine/ThreeSixNineGame.ts
import { IGame } from '../common/types';

export class ThreeSixNineGame implements IGame {
  readonly type = 'THREE_SIX_NINE';
  readonly name = {
    ko: '369 게임',
    en: '369 Game',
  };
  readonly minPlayers = 2;
  readonly maxPlayers = 10;
  readonly icon = '🎯';

  createInitialState() {
    return { current_number: 0 };
  }

  canStart(players, gameState) {
    return players.length >= this.minPlayers;
  }

  onStart(players, gameState) {
    return { current_number: 1 };
  }

  handleEvent(action, players, gameState) {
    // 369 게임 로직 구현
    return {
      newState: gameState,
      broadcastEvent: { ... },
    };
  }

  checkGameEnd(players, gameState) {
    // 종료 조건 확인
    return false;
  }

  onReset(players) {
    return this.createInitialState();
  }
}
```

### 2단계: 게임 컴포넌트 구현

```typescript
// src/games/three-six-nine/ThreeSixNineGameBoard.tsx
export function ThreeSixNineGameBoard({ room, players, gameState, onAction }: GameBoardProps) {
  // 게임 UI 구현
  return <div>...</div>;
}

// src/games/three-six-nine/ThreeSixNineRules.tsx
export function ThreeSixNineRules({ language }: RulesContentProps) {
  // 게임 규칙 설명
  return <div>...</div>;
}
```

### 3단계: 게임 레지스트리에 등록

```typescript
// src/games/registry.ts
import { threeSixNineEntry } from './three-six-nine';

export const gameRegistry = {
  'NUNCHI': nunchiEntry,
  'THREE_SIX_NINE': threeSixNineEntry, // 추가!
};
```

**끝!** 이제 게임 선택 화면에서 369 게임을 선택하면 자동으로 작동합니다.

## 🎯 핵심 개선 사항

### Before (기존 구조)
```typescript
// 눈치게임에 하드코딩됨
const { currentNumber, callNumber } = useNunchiGame();
```

### After (새 구조)
```typescript
// 어떤 게임이든 사용 가능
const game = getGame(room.game_type);
const { gameState, performAction } = useGameEngine({ game });
const GameBoard = game.components.GameBoard;
```

## 🔄 마이그레이션 체크리스트

- [x] 데이터베이스 스키마 업데이트
- [x] 게임 추상화 레이어 구현
- [x] 눈치게임 로직 분리
- [ ] room/[code]/page.tsx 업데이트
- [ ] select-game 페이지 업데이트
- [ ] 기존 useNunchiGame 훅 제거
- [ ] 테스트 및 검증

## 🚀 다음 단계

1. **즉시 사용 가능**: 데이터베이스 마이그레이션이 완료되어 game_states 테이블 사용 가능
2. **새 게임 추가 준비 완료**: `IGame` 인터페이스 구현 → 레지스트리 등록 → 완료!
3. **점진적 마이그레이션**: 기존 코드는 그대로 두고, 새 게임부터 새 구조 사용 가능

## 📖 참고 자료

- 게임 인터페이스: `src/games/common/types.ts`
- 게임 엔진: `src/games/common/useGameEngine.ts`
- 눈치게임 예제: `src/games/nunchi/`
- 데이터베이스 마이그레이션: `refactor_game_architecture.sql`
