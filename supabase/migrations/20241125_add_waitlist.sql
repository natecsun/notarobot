-- Create waitlist table for email capture
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  source TEXT DEFAULT 'website',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  subscribed BOOLEAN DEFAULT true
);

-- Add index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Enable RLS
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Allow insert from authenticated and anonymous users (for waitlist signup)
CREATE POLICY "Allow waitlist signup" ON waitlist
  FOR INSERT
  WITH CHECK (true);

-- Only allow service role to read/update/delete
CREATE POLICY "Service role full access" ON waitlist
  FOR ALL
  USING (auth.role() = 'service_role');
