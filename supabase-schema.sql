-- =============================================
-- 눈치게임 Supabase 스키마
-- =============================================
-- 이 SQL을 Supabase SQL Editor에서 실행하세요.
-- https://app.supabase.com > 프로젝트 > SQL Editor

-- 1. 게임 방 테이블
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(6) UNIQUE NOT NULL,
  host_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'finished')),
  current_number INT DEFAULT 0,
  max_players INT DEFAULT 8,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 플레이어 테이블
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  nickname VARCHAR(20) NOT NULL,
  is_alive BOOLEAN DEFAULT true,
  is_ready BOOLEAN DEFAULT false,
  score INT DEFAULT 0,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 게임 이벤트 테이블 (동시 클릭 판정용)
CREATE TABLE IF NOT EXISTS game_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
  player_id UUID REFERENCES players(id) ON DELETE CASCADE,
  number_called INT NOT NULL,
  called_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 추가 (성능 최적화)
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);
CREATE INDEX IF NOT EXISTS idx_players_room_id ON players(room_id);
CREATE INDEX IF NOT EXISTS idx_game_events_room_id ON game_events(room_id);
CREATE INDEX IF NOT EXISTS idx_game_events_number ON game_events(room_id, number_called);

-- Row Level Security (RLS) 설정
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;

-- RLS 정책: 모든 사용자가 읽기/쓰기 가능 (익명 접근 허용)
CREATE POLICY "Allow all access to rooms" ON rooms FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to players" ON players FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to game_events" ON game_events FOR ALL USING (true) WITH CHECK (true);

-- Realtime 활성화
ALTER PUBLICATION supabase_realtime ADD TABLE rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE players;
ALTER PUBLICATION supabase_realtime ADD TABLE game_events;

-- =============================================
-- 설정 완료 후 체크리스트:
-- 1. Supabase Dashboard > Settings > API에서
--    Project URL과 anon public key 복사
-- 2. .env 파일 생성:
--    VITE_SUPABASE_URL=your-project-url
--    VITE_SUPABASE_ANON_KEY=your-anon-key
-- =============================================

-- =============================================
-- 기존 데이터베이스 업데이트용 마이그레이션
-- (이미 players 테이블이 있는 경우 실행)
-- =============================================
-- is_ready 컬럼 추가 (없는 경우)
ALTER TABLE players ADD COLUMN IF NOT EXISTS is_ready BOOLEAN DEFAULT false;

-- score 컬럼 추가 (없는 경우)
ALTER TABLE players ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;
