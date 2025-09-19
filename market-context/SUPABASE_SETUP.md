# Supabase Setup Instructions

## 1. Environment Variables

Create a `.env.local` file in the root of your project with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 2. Database Setup

Run the SQL commands in `supabase-profiles-table.sql` in your Supabase dashboard SQL editor to create the profiles table with proper RLS policies.

## 3. Authentication Setup

In your Supabase dashboard:
1. Go to Authentication > Settings
2. Enable Email authentication
3. Configure your site URL (e.g., `http://localhost:3000` for development)
4. Add redirect URLs for your auth callbacks

## 4. Usage

### Client-side (Browser)
```typescript
import { useSupabase } from '@/hooks/useSupabase'
import { supabase } from '@/lib/supabase-browser'

// In a React component
const { user, loading, supabase } = useSupabase()
```

### Server-side
```typescript
import { createClient } from '@/lib/supabase-server'

// In API routes or server components
const supabase = createClient()
```

### Reading Profiles
```typescript
import { getCurrentUserProfile } from '@/lib/profile'

const profile = await getCurrentUserProfile()
```

## 5. Testing

The `AuthExample` component demonstrates how to use Supabase authentication and profile management. You can add it to any page to test the functionality.

## Files Created/Modified

- `src/lib/supabase-browser.ts` - Browser Supabase client
- `src/lib/supabase-server.ts` - Server Supabase client  
- `src/hooks/useSupabase.ts` - React hook for auth state
- `src/types/supabase.ts` - TypeScript types (includes profiles and event_votes)
- `src/lib/profile.ts` - Profile management utilities
- `src/lib/votes.ts` - Vote management utilities
- `src/hooks/useVotes.ts` - React hooks for voting functionality
- `src/components/AuthExample.tsx` - Example component
- `src/components/VoteButtons.tsx` - Voting component
- `supabase-profiles-table.sql` - Database schema (includes profiles and event_votes tables)
- `SUPABASE_SETUP.md` - This setup guide

## Voting System

The votes table allows users to vote on calendar events with three choices: `yes`, `no`, or `unsure`. Each user can only have one vote per event (enforced by unique constraint).

### Usage

```typescript
import { VoteButtons } from '@/components/VoteButtons'
import { useVotes } from '@/hooks/useVotes'

// In a component
<VoteButtons eventId="event-123" />

// Or use the hook directly
const { userVote, voteCounts, vote } = useVotes(eventId)
```
