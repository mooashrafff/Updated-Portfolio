-- Add country_code field to messages table
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS country_code TEXT;

-- Update the table comment
COMMENT ON TABLE messages IS 'Contact form submissions with country name and country code information';
