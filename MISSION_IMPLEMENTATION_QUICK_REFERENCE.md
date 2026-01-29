# AI Host Mission Implementation - Quick Reference

## Key Files

### Core Component
```
src/games/common/
├── AIHostMissionCard.tsx           (184 lines) - Main UI component
├── AIHostMissionCard.example.tsx   - Usage examples
├── aiHostMissionPool.ts            (122 lines) - Mission data & logic
└── AI_HOST_MISSION_GUIDE.md        - Developer guide
```

### Game Integration Points
```
src/games/nunchi/
├── NunchiGame.ts                   (191 lines) - Game logic with missions
└── NunchiGameBoard.tsx             (138 lines) - Display component

src/games/baskinrobbins31/
├── BaskinRobbins31Game.ts          (230 lines) - Game logic with missions
└── BaskinRobbins31GameBoard.tsx    (179 lines) - Display component
```

### Assets & Translations
```
public/gifs/motions/               - 8 motion GIF files
src/i18n/translations.ts           - Mission text in 5 languages
src/app/globals.css                - Global styles (no mobile breakpoints for missions)
```

---

## Mission Card Anatomy

```
┌─────────────────────────────────────────┐
│ AI 호스트 미션                          │  Header (0.9rem, white text)
├─────────────────────────────────────────┤
│ ┌────────────┬──────────────────────┐   │
│ │ [GIF Image]│ GESTURE              │   │
│ │            │ [Description text]   │   │  Content Container
│ │ (100px)    │                      │   │  (white background)
│ │            │ SPEECH STYLE (if set)│   │
│ │            │ [Description text]   │   │
│ │            │                      │   │
│ │            │ ACTION               │   │
│ │            │ [Instruction text]   │   │
│ └────────────┴──────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Nunchi Game Integration

### Display Location
File: `src/games/nunchi/NunchiGameBoard.tsx` (Lines 83-88)

```tsx
{myMission && myPlayer?.is_alive && !hasCalledThisRound && (
  <div style={{ marginBottom: '20px' }}>
    <AIHostMissionCard mission={myMission} language={language} />
  </div>
)}
```

### Mission Assignment
- Game Start: First mission assigned randomly
- Every 3 turns: New mission
- Only current player sees mission
- Hidden after player calls their number

---

## Baskin Robbins 31 Integration

### Display Location
File: `src/games/baskinrobbins31/BaskinRobbins31GameBoard.tsx` (Lines 77-110)

```tsx
{currentMission && currentTurnPlayer && (
  <div style={{ marginBottom: '20px' }}>
    <div style={{
      backgroundColor: isMyTurn ? '#d4edda' : '#e7f3ff',
      border: `2px solid ${isMyTurn ? '#28a745' : '#0066cc'}`,
    }}>
      <p>
        {isMyTurn ? '🎯 Your AI Host Mission!' : `👀 ${currentTurnPlayer.nickname}'s AI Host Mission`}
      </p>
    </div>
    <AIHostMissionCard mission={currentMission} language={language} />
  </div>
)}
```

### Mission Assignment
- Game Start: First mission assigned randomly
- Every 7 turns: New mission
- All players see mission
- Color-coded: Green (your turn) / Blue (other player's turn)

---

## Mission Data Structure

```typescript
interface AIHostMission {
  id: string;                    // Unique identifier
  gifUrl: string;                // Path to motion GIF
  gesture: string;               // Translation key for gesture
  action: string;                // Translation key for action
  speechStyle?: string;          // Optional: translation key for speech
}
```

### Available Missions (8 total)

| ID | Gesture | Speech | GIF File |
|---|---|---|---|
| mission-gangnam-style | Gangnam Style dance | Exaggerated | gangnam-style.gif |
| mission-salsa-1 | Salsa dance | Whisper | salsa-dancing.gif |
| mission-salsa-2 | Salsa dance 2 | Singing | salsa-dancing-2.gif |
| mission-golf-swing | Golf swing | Serious | golf-drive.gif |
| mission-elegant-pose | Elegant pose | Noble | female-standing-pose.gif |
| mission-goofy-run | Running motion | Breathless | goofy-running.gif |
| mission-hiphop-dance | Hip-hop dance | Rap | snake-hip-hop-dance.gif |
| mission-wave-arms | Wave arms | Shouting | motion1.gif |

---

## Game State Integration

### NunchiGameState
```typescript
current_mission_id?: string;      // ID of current mission
first_turn_player_id?: string;    // Who starts (they get mission)
```

### BaskinRobbins31GameState
```typescript
current_mission_id?: string;      // ID of current mission
current_turn_player_id: string;   // Whose turn it is (they perform mission)
```

---

## Styling Summary

### Colors
- Card background: Purple gradient (#667eea → #764ba2)
- Content background: White (95% opacity)
- Gesture label: Purple (#667eea)
- Speech label: Orange (#f59e0b)
- Action label: Green (#10b981)

### Sizes
- GIF width: 100% of container (100px max)
- GIF height: Auto (maintains aspect ratio)
- GIF max-height: 100px
- Card padding: 16px
- Content padding: 12px
- Gap between GIF and text: 12px
- Margin-bottom: 20px

### Font Sizes
- Card title: 0.9rem
- Labels: 0.75rem (uppercase, bold)
- Content: 0.85rem

---

## Mobile Responsiveness Status

### Current Status: NOT OPTIMIZED

**Issues:**
1. No media queries for mission card
2. Fixed GIF size (100px) on all devices
3. All inline styles (no CSS classes)
4. Horizontal layout not suitable for small screens
5. Font sizes too small on mobile (12px labels, 13.6px content)

**Breakpoints Used by Other Components:**
- 768px (primary)
- 640px (secondary)

**Recommended Action:**
- Convert inline styles to CSS classes
- Add media query support
- Implement vertical layout option for mobile
- Increase font sizes on screens < 768px

---

## Translation Keys (Korean Examples)

### Card Labels
```
aiHostMissionTitle       → "AI 호스트 미션"
aiHostGestureLabel      → "제스처"
aiHostSpeechStyleLabel  → "말투"
aiHostActionLabel       → "행동"
```

### Sample Mission Keys
```
mission_gesture_wave_arms              → "팔을 좌우로 신나게 흔들면서"
mission_speech_exaggerated             → "과장되게"
mission_action_eyes_closed             → "눈을 감고 숫자를 외치세요!"
```

---

## How Missions Are Assigned

### Client-Side Function
```typescript
// Get random mission from pool
getRandomMission(): AIHostMission

// Assign multiple missions (no duplicates)
assignMissionsToPlayers(playerCount: number): AIHostMission[]

// Get mission for specific player
getMissionForPlayer(playerId: string, allPlayers: string[]): AIHostMission
```

### Game Implementation

**Nunchi Game:**
```typescript
// Game start
const firstMission = getRandomMission();

// Every 3 turns
const nextMission = nextTurnCount % 3 === 0 ? getRandomMission() : null;
```

**Baskin Robbins 31:**
```typescript
// Game start
const firstMission = getRandomMission();

// Every 7 turns
const nextMission = nextTurnCount % 7 === 0 ? getRandomMission() : null;
```

---

## Component Props

```typescript
interface AIHostMissionCardProps {
  mission: AIHostMission | null;
  language: Language;  // 'ko' | 'en' | 'ja' | 'zh' | 'es'
}
```

If `mission` is `null`, component returns nothing (no error).

---

## Usage Example

```tsx
import { AIHostMissionCard } from '@/games/common/AIHostMissionCard';
import { MISSION_POOL } from '@/games/common/aiHostMissionPool';
import { useLanguage } from '@/contexts/LanguageContext';

export function MyGame() {
  const { language } = useLanguage();
  const mission = MISSION_POOL[0]; // Get first mission
  
  return (
    <AIHostMissionCard mission={mission} language={language} />
  );
}
```

---

## Files Modified in Latest Commit

From git log:
- `src/games/common/AIHostMissionCard.tsx` - UI component
- `src/games/common/aiHostMissionPool.ts` - Mission data
- `src/games/nunchi/NunchiGame.ts` - Mission integration
- `src/games/nunchi/NunchiGameBoard.tsx` - Display integration
- `src/games/baskinrobbins31/BaskinRobbins31Game.ts` - Mission integration
- `src/games/baskinrobbins31/BaskinRobbins31GameBoard.tsx` - Display integration

---

## Next Steps for Enhancement

1. **Mobile Responsiveness**
   - Create CSS classes for mission card
   - Add breakpoints for 768px and 480px
   - Implement vertical layout for small screens

2. **Mission Expansion**
   - Add more missions to the pool
   - Categorize by difficulty level
   - Add mission completion tracking

3. **Visual Improvements**
   - Higher quality GIF animations
   - Custom motion capture
   - Accessibility improvements (captions for GIFs)

4. **Game Logic Enhancement**
   - Server-side mission generation
   - Difficulty progression
   - Player-specific mission variants

