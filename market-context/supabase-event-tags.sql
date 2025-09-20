-- Event Tags Table - Simple Pattern
-- One row per event with string array of tags
CREATE TABLE IF NOT EXISTS event_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE, -- Cross-DB key to link with events table
  ticker_id TEXT, -- Optional: ticker symbol for easier querying
  tags TEXT[] DEFAULT '{}', -- Array of tag strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE event_tags ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read event tags (public data)
CREATE POLICY "Anyone can read event tags" ON event_tags
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert event tags
CREATE POLICY "Authenticated users can insert event tags" ON event_tags
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update event tags
CREATE POLICY "Authenticated users can update event tags" ON event_tags
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete event tags
CREATE POLICY "Authenticated users can delete event tags" ON event_tags
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on tags changes
CREATE OR REPLACE TRIGGER on_event_tags_updated
  BEFORE UPDATE ON event_tags
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create index for fast lookups by event_id
CREATE INDEX IF NOT EXISTS idx_event_tags_event_id ON event_tags(event_id);

-- Create index for ticker lookups
CREATE INDEX IF NOT EXISTS idx_event_tags_ticker_id ON event_tags(ticker_id);

-- Create index for tag searches (GIN index for array operations)
CREATE INDEX IF NOT EXISTS idx_event_tags_tags ON event_tags USING GIN(tags);

-- Insert sample data for testing
INSERT INTO event_tags (event_id, ticker_id, tags) VALUES
  ('nvda_2025-11-19_earnings', 'NVDA', ARRAY['Tech', 'AI', 'Semis', 'Earnings', 'Q3']),
  ('nvda_2025-11-26_sec_filings', 'NVDA', ARRAY['Tech', 'AI', 'Regulatory', 'SEC', '10-Q']),
  ('hood_2025-11-07_earnings', 'HOOD', ARRAY['Finance', 'Trading', 'Earnings', 'Q3', 'Brokerage']),
  ('global_2025-11-01_macro_jobs', NULL, ARRAY['Macro', 'Jobs', 'Rates', 'Employment', 'NFP']),
  ('global_2025-09-17_fomc', NULL, ARRAY['Macro', 'FOMC', 'Rates', 'Fed', 'Policy']),
  ('global_2025-09-11_treasury_auction', NULL, ARRAY['Macro', 'Treasury', 'Bonds', 'Auction', '10Y'])
ON CONFLICT (event_id) DO NOTHING;
