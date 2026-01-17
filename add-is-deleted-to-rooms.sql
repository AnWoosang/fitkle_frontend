-- Add is_deleted field to rooms table for soft delete
ALTER TABLE rooms ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT false;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_rooms_is_deleted ON rooms(is_deleted);

-- Update existing rooms query to filter out deleted rooms
-- You'll need to add WHERE is_deleted = false in your queries
