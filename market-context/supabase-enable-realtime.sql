-- Enable Supabase Realtime for Future Social Tables
-- Run this in your Supabase Dashboard SQL Editor

-- First, verify Realtime is enabled for existing tables
-- (These should already be enabled, but we'll check)

-- Check current Realtime configuration
SELECT 
  schemaname, 
  tablename,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = t.tablename
    ) THEN '✅ Enabled'
    ELSE '❌ Disabled'
  END as realtime_status
FROM pg_tables t
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'event_votes', 'event_tags', 'event_metadata')
ORDER BY tablename;

-- Enable Realtime for existing tables (if not already enabled)
-- Note: These should already be enabled, but this ensures they are

-- Enable Realtime for profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'profiles'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
    RAISE NOTICE 'Enabled Realtime for profiles table';
  ELSE
    RAISE NOTICE 'Realtime already enabled for profiles table';
  END IF;
END $$;

-- Enable Realtime for event_votes table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'event_votes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE event_votes;
    RAISE NOTICE 'Enabled Realtime for event_votes table';
  ELSE
    RAISE NOTICE 'Realtime already enabled for event_votes table';
  END IF;
END $$;

-- Enable Realtime for event_tags table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'event_tags'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE event_tags;
    RAISE NOTICE 'Enabled Realtime for event_tags table';
  ELSE
    RAISE NOTICE 'Realtime already enabled for event_tags table';
  END IF;
END $$;

-- Enable Realtime for event_metadata table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'event_metadata'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE event_metadata;
    RAISE NOTICE 'Enabled Realtime for event_metadata table';
  ELSE
    RAISE NOTICE 'Realtime already enabled for event_metadata table';
  END IF;
END $$;

-- Create future social tables with Realtime enabled
-- (These will be created when you implement social features)

-- Event Reactions Table
CREATE TABLE IF NOT EXISTS event_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id, reaction_type)
);

-- Enable RLS for event_reactions
ALTER TABLE event_reactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for event_reactions
CREATE POLICY "Anyone can read event reactions" ON event_reactions
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own reactions" ON event_reactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reactions" ON event_reactions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reactions" ON event_reactions
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime for event_reactions
ALTER PUBLICATION supabase_realtime ADD TABLE event_reactions;

-- Event Comments Table
CREATE TABLE IF NOT EXISTS event_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES event_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for event_comments
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for event_comments
CREATE POLICY "Anyone can read event comments" ON event_comments
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own comments" ON event_comments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON event_comments
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON event_comments
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime for event_comments
ALTER PUBLICATION supabase_realtime ADD TABLE event_comments;

-- User Follows Table
CREATE TABLE IF NOT EXISTS user_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS for user_follows
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_follows
CREATE POLICY "Users can read follows" ON user_follows
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own follows" ON user_follows
  FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can delete their own follows" ON user_follows
  FOR DELETE USING (auth.uid() = follower_id);

-- Enable Realtime for user_follows
ALTER PUBLICATION supabase_realtime ADD TABLE user_follows;

-- Event Bookmarks Table
CREATE TABLE IF NOT EXISTS event_bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Enable RLS for event_bookmarks
ALTER TABLE event_bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for event_bookmarks
CREATE POLICY "Users can read their own bookmarks" ON event_bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookmarks" ON event_bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own bookmarks" ON event_bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime for event_bookmarks
ALTER PUBLICATION supabase_realtime ADD TABLE event_bookmarks;

-- Event Shares Table
CREATE TABLE IF NOT EXISTS event_shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  share_type TEXT NOT NULL CHECK (share_type IN ('twitter', 'linkedin', 'facebook', 'copy_link')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for event_shares
ALTER TABLE event_shares ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for event_shares
CREATE POLICY "Anyone can read event shares" ON event_shares
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own shares" ON event_shares
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable Realtime for event_shares
ALTER PUBLICATION supabase_realtime ADD TABLE event_shares;

-- Final verification: Show all tables with Realtime enabled
SELECT 
  schemaname, 
  tablename,
  '✅ Realtime Enabled' as status
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND schemaname = 'public'
ORDER BY tablename;

-- Show summary
SELECT 
  COUNT(*) as total_realtime_tables,
  'Tables with Realtime enabled' as description
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime'
AND schemaname = 'public';
