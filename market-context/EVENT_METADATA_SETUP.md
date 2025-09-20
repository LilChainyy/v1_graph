# Event Metadata Setup Guide

## Overview

This implementation creates a cross-database solution where:
- **Events remain in your existing SQLite database** (unchanged)
- **Social data and tags are stored in Supabase** using `event_id` as the cross-DB key
- **No changes to your existing events schema** required

## Files Created/Modified

### New Files:
- `supabase-event-metadata.sql` - Database schema for event metadata
- `src/lib/eventMetadata.ts` - Utility functions for event metadata
- `src/hooks/useEventMetadata.ts` - React hook for event metadata
- `src/app/api/events/[eventId]/metadata/route.ts` - API endpoint
- `src/components/EventMetadataTest.tsx` - Test component
- `EVENT_METADATA_SETUP.md` - This setup guide

### Modified Files:
- `src/types/supabase.ts` - Added EventMetadata type
- `src/app/page.tsx` - Added test tab

## Setup Instructions

### 1. Create Supabase Project (if not already done)

1. Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Note your project URL and anon key

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create the Event Metadata Table

Run the SQL commands in `supabase-event-metadata.sql` in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-event-metadata.sql`
4. Execute the SQL

### 4. Install Supabase Dependencies

```bash
npm install @supabase/supabase-js
```

### 5. Test the Implementation

1. Start your development server: `npm run dev`
2. Open http://localhost:3001 (or your configured port)
3. Click the "Test Metadata" tab
4. Try the sample event IDs:
   - `nvda_2025-11-19_earnings`
   - `nvda_2025-11-26_sec_filings`
   - `hood_2025-11-07_earnings`
   - `global_2025-11-01_macro_jobs`

## Database Schema

### Event Metadata Table Structure

```sql
CREATE TABLE event_metadata (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE, -- Cross-DB key
  tags TEXT[] DEFAULT '{}', -- Array of tag strings
  social_data JSONB DEFAULT '{}', -- Flexible JSON for social features
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Sample Data

The setup includes sample data for testing:

```json
{
  "event_id": "nvda_2025-11-19_earnings",
  "tags": ["Tech", "AI", "Semis", "Earnings"],
  "social_data": {
    "vote_counts": {"yes": 15, "no": 3, "unsure": 2},
    "comments_count": 8,
    "bookmarks_count": 12
  }
}
```

## Usage Examples

### Fetch Event Metadata

```typescript
import { getEventMetadata } from '@/lib/eventMetadata'

const metadata = await getEventMetadata('nvda_2025-11-19_earnings')
console.log(metadata?.tags) // ['Tech', 'AI', 'Semis', 'Earnings']
console.log(metadata?.social_data) // { vote_counts: {...}, comments_count: 8, ... }
```

### Using the React Hook

```typescript
import { useEventMetadata } from '@/hooks/useEventMetadata'

function EventComponent({ eventId }) {
  const { metadata, loading, error, updateTags } = useEventMetadata(eventId)
  
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h3>{eventId}</h3>
      <p>Tags: {metadata?.tags.join(', ')}</p>
      <p>Votes: {metadata?.social_data.vote_counts?.yes || 0}</p>
    </div>
  )
}
```

### API Endpoints

- `GET /api/events/[eventId]/metadata` - Fetch event metadata
- `POST /api/events/[eventId]/metadata` - Create/update event metadata

## Cross-Database Lookup

The key feature is the cross-database lookup using `event_id`:

1. **Your events table** (SQLite) has events with stable IDs like `"nvda_2025-11-19_earnings"`
2. **Supabase event_metadata table** uses the same `event_id` as the foreign key
3. **No schema changes** to your existing events table
4. **Single key lookup** connects both databases

## Benefits

- ✅ **No changes to existing events schema**
- ✅ **Stable event IDs as cross-DB key**
- ✅ **Flexible social data storage** (JSONB)
- ✅ **Tag-based searching** with PostgreSQL arrays
- ✅ **Real-time capabilities** via Supabase
- ✅ **Type-safe** with TypeScript

## Next Steps

Once this is working, you can:

1. **Add more social features** to the `social_data` JSONB field
2. **Implement real-time updates** using Supabase Realtime
3. **Add user-specific data** (bookmarks, personal tags)
4. **Create tag-based filtering** across your events
5. **Build social features** like comments, reactions, etc.

## Troubleshooting

### Common Issues

1. **"No metadata found"** - Check that the event_id exists in both databases
2. **Authentication errors** - Ensure Supabase environment variables are set
3. **Database connection** - Verify Supabase project is active and accessible

### Testing

Use the test component at `/test` to verify:
- Event metadata lookup
- Tag updates
- Social data updates
- Cross-database connectivity
