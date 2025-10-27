-- Migration to add has_website field to existing messages table
-- Run this in your Supabase SQL editor

-- Add the has_website column to the messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS has_website TEXT;

-- Update any existing records to have a default value
UPDATE messages 
SET has_website = 'unknown' 
WHERE has_website IS NULL;

-- Optional: Add a comment to document the field
COMMENT ON COLUMN messages.has_website IS 'Indicates if client has a website: yes, no-build, no-need';
