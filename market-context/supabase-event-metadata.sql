-- Event Metadata Table for Social Data and Tags
-- This table stores social features and tags for events using event_id as the cross-DB key
CREATE TABLE IF NOT EXISTS event_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE, -- Cross-DB key to link with events table
  tags TEXT[] DEFAULT '{}', -- Array of tag strings
  social_data JSONB DEFAULT '{}', -- Flexible JSON for social features
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE event_metadata ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read event metadata (public data)
CREATE POLICY "Anyone can read event metadata" ON event_metadata
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert event metadata
CREATE POLICY "Authenticated users can insert event metadata" ON event_metadata
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to update event metadata
CREATE POLICY "Authenticated users can update event metadata" ON event_metadata
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create policy to allow authenticated users to delete event metadata
CREATE POLICY "Authenticated users can delete event metadata" ON event_metadata
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on metadata changes
CREATE OR REPLACE TRIGGER on_event_metadata_updated
  BEFORE UPDATE ON event_metadata
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create index for fast lookups by event_id
CREATE INDEX IF NOT EXISTS idx_event_metadata_event_id ON event_metadata(event_id);

-- Create index for tag searches
CREATE INDEX IF NOT EXISTS idx_event_metadata_tags ON event_metadata USING GIN(tags);

-- Insert some sample data for testing
INSERT INTO event_metadata (event_id, tags, social_data) VALUES
  ('nvda_2025-11-19_earnings', ARRAY['Tech', 'AI', 'Semis', 'Earnings'], '{"vote_counts": {"yes": 15, "no": 3, "unsure": 2}, "comments_count": 8, "bookmarks_count": 12}'),
  ('nvda_2025-11-26_sec_filings', ARRAY['Tech', 'AI', 'Regulatory'], '{"vote_counts": {"yes": 5, "no": 1, "unsure": 1}, "comments_count": 3, "bookmarks_count": 7}'),
  ('hood_2025-11-07_earnings', ARRAY['Finance', 'Trading', 'Earnings'], '{"vote_counts": {"yes": 8, "no": 2, "unsure": 1}, "comments_count": 5, "bookmarks_count": 9}'),
  ('global_2025-11-01_macro_jobs', ARRAY['Macro', 'Jobs', 'Rates'], '{"vote_counts": {"yes": 25, "no": 5, "unsure": 8}, "comments_count": 15, "bookmarks_count": 20}')
ON CONFLICT (event_id) DO NOTHING;
