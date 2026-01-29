# AI Host Mission Implementation Analysis

## Overview
The AI host mission system is fully implemented across two Korean party games:
- **Nunchi Game (눈치게임)** - Guessing game based on timing
- **Baskin Robbins 31** - Number counting elimination game

Both games display AI host missions to participants during gameplay, requiring them to perform non-verbal actions while playing.

---

## 1. MISSION DISPLAY LOCATIONS

### Nunchi Game (Guessing Game)
**File:** `/Users/woosang/Documents/FITKLE/fitkle_frontend/src/games/nunchi/NunchiGameBoard.tsx`

**Implementation (Lines 83-88):**
```tsx
{/* AI 호스트 미션 카드 - 아직 숫자를 외치지 않은 경우에만 표시 */}
{myMission && myPlayer?.is_alive && !hasCalledThisRound && (
  <div style={{ marginBottom: '20px' }}>
    <AIHostMissionCard mission={myMission} language={language} />
  </div>
)}
```

**Key Characteristics:**
- Mission displayed only BEFORE the player calls their number
- Hidden after player has called the number that round
- Only shows for alive players (eliminates deceased players)
- Mission retrieved from game state: `state?.current_mission_id`
- Missions change every 3 turns (line 123 in NunchiGame.ts)

### Baskin Robbins 31 Game
**File:** `/Users/woosang/Documents/FITKLE/fitkle_frontend/src/games/baskinrobbins31/BaskinRobbins31GameBoard.tsx`

**Implementation (Lines 77-110):**
```tsx
{/* AI 호스트 미션 카드 - 미션이 있을 때 모든 플레이어에게 표시 */}
{currentMission && currentTurnPlayer && (
  <div style={{ marginBottom: '20px' }}>
    <div style={{
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: isMyTurn ? '#d4edda' : '#e7f3ff',
      border: `2px solid ${isMyTurn ? '#28a745' : '#0066cc'}`,
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <p style={{ margin: 0, fontSize: '14px', fontWeight: 'bold', color: isMyTurn ? '#155724' : '#004085' }}>
        {isMyTurn ? (
          <>🎯 Your AI Host Mission!</>
        ) : (
          <>👀 ${currentTurnPlayer.nickname}'s AI Host Mission</>
        )}
      </p>
    </div>
    <AIHostMissionCard mission={currentMission} language={language} />
  </div>
)}
```

**Key Characteristics:**
- Mission visible to ALL players (not just the current player)
- Shows context header distinguishing between "Your Mission" vs "Player X's Mission"
- Color-coded: Green background for current player's turn, blue for other players
- Missions change every 7 turns (line 184 in BaskinRobbins31Game.ts)
- Emojis provide visual distinction

---

## 2. MOTION GIFS DISPLAY

### GIF Implementation
**File:** `/Users/woosang/Documents/FITKLE/fitkle_frontend/src/games/common/AIHostMissionCard.tsx` (Lines 74-95)

```tsx
{/* 왼쪽: GIF */}
<div
  style={{
    flex: '0 0 100px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }}
>
  <img
    src={mission.gifUrl}
    alt="미션 동작"
    style={{
      width: '100%',
      height: 'auto',
      maxHeight: '100px',
      objectFit: 'contain',
      borderRadius: '6px',
      border: '2px solid #e0e0e0',
    }}
  />
</div>
```

### GIF Files Available
Located in `/public/gifs/motions/`:
- `gangnam-style.gif` - Gangnam Style dance
- `salsa-dancing.gif` - Salsa dance motion 1
- `salsa-dancing-2.gif` - Salsa dance motion 2
- `golf-drive.gif` - Golf swing
- `female-standing-pose.gif` - Elegant pose
- `goofy-running.gif` - Funny running motion
- `snake-hip-hop-dance.gif` - Hip-hop dance
- `motion1.gif` - Arm waving

### GIF Display Styling
- **Width:** 100% of container (max 100px parent)
- **Height:** Auto (maintains aspect ratio)
- **Max height:** 100px
- **Object-fit:** Contain (no cropping)
- **Border:** 2px solid #e0e0e0
- **Border-radius:** 6px

---

## 3. MESSAGE/INSTRUCTION TEXT

### Mission Card Structure
**File:** `/Users/woosang/Documents/FITKLE/fitkle_frontend/src/games/common/AIHostMissionCard.tsx`

The card displays three text sections:

#### A. GESTURE (제스처)
**Label:** "GESTURE" (in purple #667eea)
**Font Size:** 0.75rem (bold, uppercase)
**Content:** Describes the physical motion

Examples from translations:
- `mission_gesture_wave_arms`: "팔을 좌우로 신나게 흔들면서" (While swinging arms left and right)
- `mission_gesture_gangnam_style`: "강남스타일 춤을 추면서" (While dancing Gangnam Style)
- `mission_gesture_golf_swing`: "골프 스윙 동작을 하면서" (While doing golf swing motion)

#### B. SPEECH STYLE (말투) - Optional
**Label:** "SPEECH STYLE" (in orange #f59e0b)
**Font Size:** 0.75rem (bold, uppercase)
**Content:** Describes how to speak/perform

Examples:
- `mission_speech_exaggerated`: "과장되게" (Exaggerated tone)
- `mission_speech_whisper`: "천천히 또박또박" (Slowly and clearly)
- `mission_speech_rap`: "랩하듯이" (Rapping style)
- `mission_speech_shouting`: "힘차게 크게" (Powerfully and loudly)

#### C. ACTION (행동) - Required
**Label:** "ACTION" (in green #10b981)
**Font Size:** 0.75rem (bold, uppercase)
**Content:** The instruction to follow

Examples:
- `mission_action_dance_while_speaking`: "춤을 추면서 숫자를 말하세요!" (Say numbers while dancing!)
- `mission_action_eyes_closed`: "눈을 감고 숫자를 외치세요!" (Call out numbers with eyes closed!)
- `mission_action_jump_in_place`: "제자리에서 뛰면서 숫자를 외치세요!" (Jump in place while calling numbers!)

### Mission Card Header
**Line 43-62:**
```tsx
<h4
  style={{
    margin: 0,
    fontSize: '0.9rem',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  }}
>
  {t.aiHostMissionTitle}
</h4>
```

**Title:** "AI 호스트 미션" (AI Host Mission)

---

## 4. COMPONENT STRUCTURE

### Component Hierarchy

```
AIHostMissionCard (Main Component)
├── Header Section
│   └── Title: "AI 호스트 미션"
│
├── Content Container (White background)
│   ├── Left Section (GIF Area)
│   │   └── <img> Motion GIF
│   │
│   └── Right Section (Text Content)
│       ├── Gesture Section
│       │   ├── Label: "GESTURE"
│       │   └── Description text
│       │
│       ├── Speech Style Section (Optional)
│       │   ├── Label: "SPEECH STYLE"
│       │   └── Description text
│       │
│       └── Action Section (Required)
│           ├── Label: "ACTION"
│           └── Instruction text
```

### Container Styling
**File:** Lines 31-42 (Main Card Container)
```tsx
<div
  className="ai-host-mission-card"
  style={{
    marginBottom: '20px',
    padding: '16px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    width: '100%',
  }}
>
```

**Properties:**
- **Background:** Purple gradient (135deg from #667eea to #764ba2)
- **Border-radius:** 12px
- **Box-shadow:** 0 4px 12px with purple tint (30% opacity)
- **Border:** 2px solid white (10% opacity)
- **Padding:** 16px
- **Margin-bottom:** 20px
- **Width:** 100%

### Content Box (Lines 65-72)
```tsx
<div
  style={{
    display: 'flex',
    gap: '12px',
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '8px',
    padding: '12px',
  }}
>
```

**Properties:**
- **Display:** Flexbox (row direction default)
- **Gap:** 12px between GIF and text
- **Background:** Nearly white (95% opacity)
- **Border-radius:** 8px
- **Padding:** 12px

---

## 5. MOBILE RESPONSIVENESS ISSUES

### Current CSS Media Queries
**File:** `/Users/woosang/Documents/FITKLE/fitkle_frontend/src/app/globals.css`

#### Primary Breakpoint: 768px
```css
@media (max-width: 768px) {
  .game-room {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
  }
  .players-sidebar {
    order: 3;
  }
  .number-value {
    font-size: 80px;
  }
  .call-button {
    width: 160px;
    height: 160px;
  }
  /* ... more rules ... */
}
```

#### Secondary Breakpoint: 640px
```css
@media (max-width: 640px) {
  .call-button-rect {
    padding: 16px 20px;
    font-size: 16px;
  }
  .countdown-number {
    font-size: 80px;
  }
  /* ... more rules ... */
}
```

### Issues Identified

#### 1. Mission Card NOT Included in Mobile Breakpoints
**Problem:** The AIHostMissionCard uses only inline styles with NO media queries
**Location:** AIHostMissionCard.tsx (all styling is inline)

```tsx
// No responsive adjustments for:
// - GIF size (fixed at max-height: 100px)
// - Font sizes (0.75rem, 0.85rem fixed)
// - Padding (12px, 16px fixed)
// - Gap between GIF and text (12px fixed)
```

#### 2. GIF Size on Mobile
**Issue:** 100px max-height may be too small on mobile screens
- On 320px phones, GIF takes up 31% of screen width
- Limited visual clarity for gesture demonstration
- Text content forced to wrap due to flex layout constraints

#### 3. Flex Layout Problem
**Lines 67-72:** Mission content uses horizontal flex layout
```tsx
display: 'flex',  // Default flex-direction: row
gap: '12px',
```

**Mobile Problem:**
- On small screens, GIF (100px fixed) + text creates cramped layout
- On 375px mobile: GIF takes 27%, text gets ~255px
- Text labels and descriptions wrap aggressively
- Speech style section may overflow or be cut off

#### 4. Font Size Not Responsive
**Current sizes:**
- Gesture label: 0.75rem (12px) - too small for mobile
- Gesture description: 0.85rem (13.6px) - marginally readable
- Action text: 0.85rem with fontWeight: 600 - better but still tight

**Mobile devices:**
- 0.75rem = 12px on mobile (iPhone default is 16px base)
- Significantly smaller than native mobile text (16px minimum recommended)

#### 5. Padding/Margin Issues
**Current spacing:**
- Container padding: 16px (same on all screens)
- Content padding: 12px (same on all screens)
- Gap: 12px (fixed)
- Margin-bottom: 20px (fixed)

**Issue:** No reduction on mobile means:
- Header takes up more vertical space proportionally
- Less room for game content below
- Awkward spacing on screens < 375px width

#### 6. No Touch-Friendly Sizing
**Problem:** Component not optimized for touch interaction
- GIF border: 2px (harder to tap)
- Minimal whitespace around interactive areas
- No consideration for fat-finger targeting

### Responsive Design Recommendations

The component should include something like:

```css
@media (max-width: 768px) {
  .ai-host-mission-card {
    padding: 12px;
    margin-bottom: 16px;
  }
  
  .mission-gif-container {
    flex: 0 0 80px;
    max-height: 80px;
  }
  
  .mission-text-section h4 {
    font-size: 0.8rem;
  }
  
  .mission-label {
    font-size: 0.65rem;
  }
  
  .mission-content {
    font-size: 0.75rem;
  }
}

@media (max-width: 480px) {
  .ai-host-mission-card {
    padding: 10px;
    flex-direction: column;
  }
  
  .mission-content {
    display: 'flex';
    flex-direction: column;
  }
  
  .mission-gif-container {
    flex: 0 0 60px;
    margin-bottom: 8px;
    width: 100%;
  }
  
  .mission-label {
    font-size: 0.6rem;
  }
  
  .mission-content-text {
    font-size: 0.7rem;
  }
}
```

---

## 6. MISSION ALLOCATION SYSTEM

### Mission Pool
**File:** `/Users/woosang/Documents/FITKLE/fitkle_frontend/src/games/common/aiHostMissionPool.ts`

Total of 8 predefined missions:

| ID | Gesture | Speech Style | Action | GIF |
|---|---|---|---|---|
| mission-gangnam-style | 강남스타일 춤 | 과장되게 | 춤을 추면서 숫자 | gangnam-style.gif |
| mission-salsa-1 | 살사 댄스 | 속삭이듯 | 몸을 흔들며 | salsa-dancing.gif |
| mission-salsa-2 | 살사 댄스 2 | 노래하듯 | 손뼉을 치며 | salsa-dancing-2.gif |
| mission-golf-swing | 골프 스윙 | 심각한 톤 | 스윙 후 숫자 | golf-drive.gif |
| mission-elegant-pose | 우아한 포즈 | 귀족처럼 | 포즈 취하며 | female-standing-pose.gif |
| mission-goofy-run | 달리는 동작 | 숨차게 | 제자리에서 뛰며 | goofy-running.gif |
| mission-hiphop-dance | 힙합 댄스 | 랩하듯 | 손가락 튕기며 | snake-hip-hop-dance.gif |
| mission-wave-arms | 팔 흔들기 | 외치듯 | 눈 감고 숫자 | motion1.gif |

### Mission Assignment Logic

#### Nunchi Game
**File:** NunchiGame.ts

- **Game Start:** First mission assigned (line 48)
  ```typescript
  const firstMission = getRandomMission();
  ```

- **During Game:** New mission every 3 turns (line 123)
  ```typescript
  const nextMission = nextTurnCount % 3 === 0 ? getRandomMission() : null;
  ```

- **Display:** Only visible before player calls their number
  - Mission persists across multiple players in same round
  - Different players can see same mission in Nunchi (visible only to current player)

#### Baskin Robbins 31 Game
**File:** BaskinRobbins31Game.ts

- **Game Start:** First mission assigned (line 52)
  ```typescript
  const firstMission = getRandomMission();
  ```

- **During Game:** New mission every 7 turns (line 184)
  ```typescript
  const nextMission = nextTurnCount % 7 === 0 ? getRandomMission() : null;
  ```

- **Display:** Visible to ALL players
  - All players watch current player perform mission
  - Changes every 7 turns instead of 3 turns
  - More time for players to adapt to same mission

### Mission Helper Functions
**File:** aiHostMissionPool.ts (Lines 88-121)

```typescript
// Get single random mission
getRandomMission(): AIHostMission

// Assign missions to all players (no duplicates until exhausted)
assignMissionsToPlayers(playerCount: number): AIHostMission[]

// Get mission for specific player
getMissionForPlayer(playerId: string, allPlayers: string[]): AIHostMission
```

---

## 7. LANGUAGE SUPPORT

### Supported Languages
1. **Korean (ko)** - Default
2. **English (en)**
3. **Japanese (ja)**
4. **Chinese (zh)**
5. **Spanish (es)**

### Translation Keys
All text is externalized to `/src/i18n/translations.ts`:

**Card titles:**
- `aiHostMissionTitle` - "AI 호스트 미션"
- `aiHostGestureLabel` - "제스처"
- `aiHostSpeechStyleLabel` - "말투"
- `aiHostActionLabel` - "행동"

**Mission descriptors:**
- `mission_gesture_*` (8 variations)
- `mission_speech_*` (7 variations)
- `mission_action_*` (8 variations)

Total: 23+ translation keys per language

---

## 8. INTEGRATION WITH GAME STATE

### State Management
Missions are part of the game state, persisted via WebSocket:

**NunchiGameState:**
```typescript
interface NunchiGameState {
  current_number: number;
  last_call_timestamp: null;
  called_player_ids: [];
  turn_count: number;
  current_mission_id?: string;      // MISSION ID
  first_turn_player_id?: string;
}
```

**BaskinRobbins31GameState:**
```typescript
interface BaskinRobbins31GameState {
  current_number: number;
  current_turn_player_id: null;
  numbers_in_current_turn: [];
  turn_count: number;
  current_mission_id?: string;      // MISSION ID
}
```

### Mission Retrieval
**Both games:**
```typescript
const currentMissionId = state?.current_mission_id ? state.current_mission_id : null;
const currentMission = currentMissionId 
  ? MISSION_POOL.find(m => m.id === currentMissionId) 
  : null;
```

---

## 9. SUMMARY TABLE

| Aspect | Nunchi Game | Baskin Robbins 31 |
|--------|-------------|------------------|
| **Mission Visibility** | Only current player | All players |
| **When Shown** | Before calling number | For entire turn |
| **Update Frequency** | Every 3 turns | Every 7 turns |
| **Context Header** | None | Yes (Your vs Player X) |
| **Color Coding** | N/A | Green (yours) / Blue (others) |
| **Component** | AIHostMissionCard | AIHostMissionCard |
| **GIF Size** | 100px max-height | 100px max-height |
| **Mobile Breakpoint** | None | None |

---

## 10. FILES REFERENCE

### Core Implementation
- `/src/games/common/AIHostMissionCard.tsx` - UI Component
- `/src/games/common/aiHostMissionPool.ts` - Mission data & logic
- `/src/games/common/AI_HOST_MISSION_GUIDE.md` - Implementation guide

### Game Integration
- `/src/games/nunchi/NunchiGameBoard.tsx` - Display integration
- `/src/games/nunchi/NunchiGame.ts` - Game logic
- `/src/games/baskinrobbins31/BaskinRobbins31GameBoard.tsx` - Display integration
- `/src/games/baskinrobbins31/BaskinRobbins31Game.ts` - Game logic

### Assets
- `/public/gifs/motions/*.gif` - 8 motion GIFs

### Styling
- `/src/app/globals.css` - Global styles (no mission-specific mobile rules)

### Translations
- `/src/i18n/translations.ts` - Mission text in 5 languages

---

## 11. KNOWN LIMITATIONS

1. **No Mobile Responsiveness** - Card not optimized for screens < 768px
2. **Fixed GIF Size** - 100px max-height on all devices
3. **No Vertical Layout Option** - Always GIF-left, text-right
4. **Limited Mission Pool** - Only 8 missions, repeats after exhausted
5. **No Mission Difficulty** - No easy/medium/hard classification
6. **No Mission Tracking** - No stats on which missions players complete
7. **Client-Side Allocation** - Missions assigned via simple random (not cryptographically secure)
8. **No Mission Hints** - Other players can't guess ongoing missions

