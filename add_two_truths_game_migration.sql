-- Migration: Add Two Truths game support
-- Two Truths and a Lie 게임을 위한 확장
-- 기존 events 테이블을 활용하여 게임 데이터 저장

-- 1. events 테이블에 data 컬럼 추가 (JSONB 타입)
-- 이미 있을 수 있으므로 IF NOT EXISTS 사용 불가 - 에러 무시
ALTER TABLE events
ADD COLUMN IF NOT EXISTS data JSONB;

-- 2. events 테이블에 turn_number 컬럼 추가
ALTER TABLE events
ADD COLUMN IF NOT EXISTS turn_number INTEGER;

-- 3. rooms 테이블에 current_turn 컬럼 추가
ALTER TABLE rooms
ADD COLUMN IF NOT EXISTS current_turn INTEGER DEFAULT 0;

-- 4. 인덱스 추가 (성능 향상)
CREATE INDEX IF NOT EXISTS idx_events_room_type ON events(room_id, type);
CREATE INDEX IF NOT EXISTS idx_events_room_turn ON events(room_id, turn_number);

-- 완료!
-- Supabase Dashboard > SQL Editor에서 이 파일을 실행하세요.

-- 사용 예시:
-- 진술 저장: type='statement_submitted', data={ truth1, truth2, lie, lie_index }
-- 투표 저장: type='vote_cast', data={ voted_index, is_correct }, turn_number=N
