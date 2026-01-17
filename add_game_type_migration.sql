-- Migration: Add game_type column to rooms table
-- 새 게임을 추가할 수 있도록 game_type 컬럼 추가

-- 1. game_type 컬럼 추가 (기본값: 'NUNCHI')
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS game_type TEXT NOT NULL DEFAULT 'NUNCHI';

-- 2. 기존 데이터 업데이트 (혹시 모를 NULL 값 처리)
UPDATE rooms
SET game_type = 'NUNCHI'
WHERE game_type IS NULL OR game_type = '';

-- 3. 인덱스 추가 (게임 타입별 조회 성능 향상)
CREATE INDEX IF NOT EXISTS idx_rooms_game_type ON rooms(game_type);

-- 완료!
-- Supabase Dashboard > SQL Editor에서 이 파일을 실행하세요.
