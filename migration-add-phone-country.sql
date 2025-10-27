-- Add phone and country fields to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS country TEXT;

-- Update the table comment
COMMENT ON TABLE messages IS 'Contact form submissions with phone and country information';
