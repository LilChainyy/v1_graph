# Supabase Realtime Setup Guide

## Overview

This guide helps you verify and configure Supabase Realtime for future social features like reactions, comments, and follows. Realtime enables live updates when users interact with events.

## Current Tables with Realtime

### Already Configured
- ✅ `profiles` - User profiles (already has RLS policies)
- ✅ `event_votes` - Voting system (already has RLS policies)  
- ✅ `event_tags` - Event tags (already has RLS policies)
- ✅ `event_metadata` - Event social data (already has RLS policies)

### Future Social Tables (Need Realtime)
- 🔄 `event_reactions` - User reactions to events (👍, ❤️, etc.)
- 🔄 `event_comments` - Comments on events
- 🔄 `user_follows` - User following other users
- 🔄 `event_bookmarks` - User bookmarks for events
- 🔄 `event_shares` - Event sharing data

## Step 1: Verify Realtime is Enabled

### In Supabase Dashboard:

1. **Go to your Supabase project dashboard**
2. **Navigate to Database → Replication**
3. **Check that "Realtime" is enabled** (toggle should be ON)

### Verify via SQL:
```sql
-- Check if Realtime is enabled for existing tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'event_votes', 'event_tags', 'event_metadata');
```

## Step 2: Enable Realtime for Future Tables

### For each future social table, run this SQL:

```sql
-- Enable Realtime for event_reactions
ALTER PUBLICATION supabase_realtime ADD TABLE event_reactions;

-- Enable Realtime for event_comments  
ALTER PUBLICATION supabase_realtime ADD TABLE event_comments;

-- Enable Realtime for user_follows
ALTER PUBLICATION supabase_realtime ADD TABLE user_follows;

-- Enable Realtime for event_bookmarks
ALTER PUBLICATION supabase_realtime ADD TABLE event_bookmarks;

-- Enable Realtime for event_shares
ALTER PUBLICATION supabase_realtime ADD TABLE event_shares;
```

## Step 3: Verify Realtime Configuration

### Check Current Realtime Tables:
```sql
-- List all tables with Realtime enabled
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

### Expected Output:
```
schemaname | tablename
-----------|----------
public     | profiles
public     | event_votes
public     | event_tags
public     | event_metadata
public     | event_reactions
public     | event_comments
public     | user_follows
public     | event_bookmarks
public     | event_shares
```

## Step 4: Test Realtime Connection

### Client-Side Test:
```javascript
import { supabase } from '@/lib/supabase-browser'

// Test Realtime connection
const testRealtime = () => {
  const channel = supabase
    .channel('test-channel')
    .on('postgres_changes', 
      { event: '*', schema: 'public', table: 'profiles' },
      (payload) => {
        console.log('Realtime update:', payload)
      }
    )
    .subscribe()

  return () => supabase.removeChannel(channel)
}
```

## Step 5: Future Social Tables Schema

### Event Reactions Table:
```sql
CREATE TABLE event_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'love', 'laugh', 'wow', 'sad', 'angry')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id, reaction_type)
);

-- Enable RLS
ALTER TABLE event_reactions ENABLE ROW LEVEL SECURITY;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE event_reactions;
```

### Event Comments Table:
```sql
CREATE TABLE event_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES event_comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE event_comments ENABLE ROW LEVEL SECURITY;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE event_comments;
```

### User Follows Table:
```sql
CREATE TABLE user_follows (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Enable RLS
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE user_follows;
```

## Step 6: Realtime Usage Examples

### Listen to Event Reactions:
```javascript
const subscribeToReactions = (eventId) => {
  return supabase
    .channel('event-reactions')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'event_reactions',
        filter: `event_id=eq.${eventId}`
      },
      (payload) => {
        console.log('Reaction update:', payload)
        // Update UI with new reaction counts
      }
    )
    .subscribe()
}
```

### Listen to Comments:
```javascript
const subscribeToComments = (eventId) => {
  return supabase
    .channel('event-comments')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'event_comments',
        filter: `event_id=eq.${eventId}`
      },
      (payload) => {
        console.log('Comment update:', payload)
        // Add/update/remove comment in UI
      }
    )
    .subscribe()
}
```

## Verification Checklist

- [ ] Realtime is enabled in Supabase Dashboard
- [ ] Existing tables (profiles, event_votes, event_tags, event_metadata) have Realtime
- [ ] Future social tables are added to Realtime publication
- [ ] RLS policies are configured for all tables
- [ ] Test connection works from client-side
- [ ] Realtime updates are received in browser console

## Troubleshooting

### Common Issues:

1. **Realtime not working**: Check if Realtime is enabled in Dashboard
2. **No updates received**: Verify table is added to publication
3. **Permission denied**: Check RLS policies allow user access
4. **Connection issues**: Verify Supabase URL and keys are correct

### Debug Commands:
```sql
-- Check Realtime status
SELECT * FROM pg_publication WHERE pubname = 'supabase_realtime';

-- List Realtime tables
SELECT * FROM pg_publication_tables WHERE pubname = 'supabase_realtime';

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

## Next Steps

Once Realtime is configured:

1. **Implement reaction system** - Add like/love reactions to events
2. **Add comments** - Allow users to comment on events  
3. **User following** - Enable users to follow each other
4. **Real-time updates** - Show live updates as users interact
5. **Notifications** - Notify users of relevant updates

The Realtime foundation is now ready for social features!
