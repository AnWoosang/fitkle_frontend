-- =============================================
-- 게임 아키텍처 리팩토링 마이그레이션
-- 게임별 상태를 분리하여 확장 가능하게 만듦
-- =============================================

-- 1. game_states 테이블 생성 (게임별 상태 저장)
CREATE TABLE IF NOT EXISTS game_states (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE UNIQUE NOT NULL,
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 기존 rooms 테이블의 current_number 데이터를 game_states로 마이그레이션
INSERT INTO game_states (room_id, state, created_at, updated_at)
SELECT
  id as room_id,
  jsonb_build_object('current_number', COALESCE(current_number, 0)) as state,
  created_at,
  NOW() as updated_at
FROM rooms
ON CONFLICT (room_id) DO UPDATE
SET state = EXCLUDED.state, updated_at = EXCLUDED.updated_at;

-- 3. rooms 테이블에서 게임별 필드 제거 (선택사항 - 기존 데이터 보존하려면 주석 처리)
-- ALTER TABLE rooms DROP COLUMN IF EXISTS current_number;

-- 4. updated_at 컬럼 추가 (없는 경우)
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 5. 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_game_states_room_id ON game_states(room_id);

-- 6. Row Level Security (RLS) 설정
ALTER TABLE game_states ENABLE ROW LEVEL SECURITY;

-- 7. RLS 정책: 모든 사용자가 읽기/쓰기 가능 (익명 접근 허용)
CREATE POLICY "Allow all access to game_states" ON game_states FOR ALL USING (true) WITH CHECK (true);

-- 8. Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE game_states;

-- 9. updated_at 자동 업데이트 트리거 함수 생성
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. rooms 테이블에 트리거 추가
DROP TRIGGER IF EXISTS update_rooms_updated_at ON rooms;
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON rooms
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 11. game_states 테이블에 트리거 추가
DROP TRIGGER IF EXISTS update_game_states_updated_at ON game_states;
CREATE TRIGGER update_game_states_updated_at
  BEFORE UPDATE ON game_states
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- 12. events 테이블 이름 변경 및 구조 개선
ALTER TABLE game_events RENAME TO events;

-- events 테이블에 필요한 컬럼 추가
ALTER TABLE events ADD COLUMN IF NOT EXISTS type VARCHAR(50) NOT NULL DEFAULT 'number_called';
ALTER TABLE events ADD COLUMN IF NOT EXISTS player_name VARCHAR(20);
ALTER TABLE events ADD COLUMN IF NOT EXISTS number INT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS reason VARCHAR(50);

-- 기존 컬럼과 새 컬럼 매핑
UPDATE events SET number = number_called WHERE number IS NULL;
UPDATE events SET type = 'number_called' WHERE type IS NULL;

-- 13. players 테이블에 turn_order 컬럼 추가 (게임별 턴 순서)
ALTER TABLE players ADD COLUMN IF NOT EXISTS turn_order INT;

-- =============================================
-- 마이그레이션 완료!
-- =============================================
