-- Add image_url and images columns to events table
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS image_url TEXT;

ALTER TABLE events
  ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
