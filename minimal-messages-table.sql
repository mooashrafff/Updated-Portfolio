-- Minimal working messages table
-- Run this in your Supabase SQL editor to create a simple working table

-- Drop existing messages table if it exists (be careful!)
-- DROP TABLE IF EXISTS messages;

-- Create a simple messages table with only essential fields
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  brief TEXT NOT NULL,
  services TEXT[],
  budget TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security policies
CREATE POLICY "Anyone can insert messages" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Messages are viewable by everyone" ON messages FOR SELECT USING (true);

-- Test insert to make sure it works
INSERT INTO messages (name, email, brief, services, budget) 
VALUES ('Test User', 'test@example.com', 'Test message', ARRAY['Web Development'], 'Under $500')
ON CONFLICT DO NOTHING;
