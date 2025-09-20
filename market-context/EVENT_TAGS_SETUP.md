# Event Tags Setup Guide

## Overview

This implementation adds a tags store in Supabase using the **Simple Pattern** as requested:
- **One row per event** with a string array of tags
- **Keyed by event_id** for cross-database lookup
- **No changes to existing events schema** required
- **Row Level Security**: Anyone can read, authenticated users can write

## Database Schema

### Event Tags Table Structure

```sql
CREATE TABLE event_tags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id TEXT NOT NULL UNIQUE, -- Cross-DB key
  ticker_id TEXT, -- Optional: ticker symbol for easier querying
  tags TEXT[] DEFAULT '{}', -- Array of tag strings
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Required Fields (as requested):
- ✅ `event_id` (text, unique) - Cross-DB key
- ✅ `ticker_id` (text) - Optional ticker symbol
- ✅ `tags` (array of text) - String array of tags
- ✅ `timestamps` - created_at and updated_at

### Row Level Security:
- ✅ **Anyone can read** - Public access to tags
- ✅ **Only authenticated users can write** - Insert/update/delete requires auth

## Files Created/Modified

### New Files:
- `supabase-event-tags.sql` - Database schema for event tags
- `src/lib/eventTags.ts` - Utility functions for tags CRUD
- `src/hooks/useEventTags.ts` - React hook for tags state management
- `src/app/api/events/[eventId]/tags/route.ts` - API endpoint for tags
- `src/components/EventTagsTest.tsx` - Test component
- `EVENT_TAGS_SETUP.md` - This setup guide

### Modified Files:
- `src/types/supabase.ts` - Added EventTags type and table definition
- `src/app/page.tsx` - Added "Test Tags" tab

## Setup Instructions

### 1. Create the Event Tags Table

Run the SQL commands in `supabase-event-tags.sql` in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase-event-tags.sql`
4. Execute the SQL

### 2. Test the Implementation

1. Start your development server: `npm run dev`
2. Open http://localhost:3001 (or your configured port)
3. Click the "Test Tags" tab
4. Try the sample event IDs with pre-populated tags

## Sample Data Included

The setup includes sample data for testing:

```sql
INSERT INTO event_tags (event_id, ticker_id, tags) VALUES
  ('nvda_2025-11-19_earnings', 'NVDA', ARRAY['Tech', 'AI', 'Semis', 'Earnings', 'Q3']),
  ('nvda_2025-11-26_sec_filings', 'NVDA', ARRAY['Tech', 'AI', 'Regulatory', 'SEC', '10-Q']),
  ('hood_2025-11-07_earnings', 'HOOD', ARRAY['Finance', 'Trading', 'Earnings', 'Q3', 'Brokerage']),
  ('global_2025-11-01_macro_jobs', NULL, ARRAY['Macro', 'Jobs', 'Rates', 'Employment', 'NFP']),
  ('global_2025-09-17_fomc', NULL, ARRAY['Macro', 'FOMC', 'Rates', 'Fed', 'Policy']),
  ('global_2025-09-11_treasury_auction', NULL, ARRAY['Macro', 'Treasury', 'Bonds', 'Auction', '10Y']);
```

## Usage Examples

### Basic Tag Operations

```typescript
import { getEventTags, setEventTags, addEventTag, removeEventTag } from '@/lib/eventTags'

// Get tags for an event
const tags = await getEventTags('nvda_2025-11-19_earnings')
console.log(tags) // ['Tech', 'AI', 'Semis', 'Earnings', 'Q3']

// Set all tags for an event
await setEventTags('nvda_2025-11-19_earnings', ['Tech', 'AI', 'Semis'], 'NVDA')

// Add a single tag
await addEventTag('nvda_2025-11-19_earnings', 'GPU')

// Remove a single tag
await removeEventTag('nvda_2025-11-19_earnings', 'Q3')
```

### Using the React Hook

```typescript
import { useEventTags } from '@/hooks/useEventTags'

function EventComponent({ eventId, tickerId }) {
  const { tags, loading, error, addTag, removeTag, updateTags } = useEventTags(eventId, tickerId)
  
  if (loading) return <div>Loading tags...</div>
  if (error) return <div>Error: {error}</div>
  
  return (
    <div>
      <h3>Event: {eventId}</h3>
      <p>Tags: {tags.join(', ')}</p>
      <button onClick={() => addTag('NewTag')}>Add Tag</button>
    </div>
  )
}
```

### Advanced Queries

```typescript
import { getEventsByTag, getEventsByTags, getAllTags } from '@/lib/eventTags'

// Find all events with a specific tag
const techEvents = await getEventsByTag('Tech')

// Find all events with any of the specified tags
const macroEvents = await getEventsByTags(['Macro', 'FOMC', 'Treasury'])

// Get all unique tags across all events
const allTags = await getAllTags()
```

### API Endpoints

- `GET /api/events/[eventId]/tags` - Fetch tags for an event
- `POST /api/events/[eventId]/tags` - Create/update tags for an event
- `DELETE /api/events/[eventId]/tags` - Delete all tags for an event

## Cross-Database Lookup

The key feature is the cross-database lookup using `event_id`:

1. **Your events table** (SQLite) has events with stable IDs like `"nvda_2025-11-19_earnings"`
2. **Supabase event_tags table** uses the same `event_id` as the unique key
3. **No schema changes** to your existing events table
4. **Single key lookup** connects both databases

## Benefits of Simple Pattern

- ✅ **Fast queries** - Single table lookup
- ✅ **Simple schema** - Easy to understand and maintain
- ✅ **Array operations** - PostgreSQL arrays for efficient tag queries
- ✅ **No joins required** - Direct event_id lookup
- ✅ **Flexible** - Easy to add/remove tags

## Database Indexes

The setup includes optimized indexes:

- `idx_event_tags_event_id` - Fast lookups by event_id
- `idx_event_tags_ticker_id` - Fast lookups by ticker
- `idx_event_tags_tags` - GIN index for array operations (tag searches)

## Acceptance Criteria Met

✅ **Simple pattern implemented** - One row per event with string array  
✅ **Required fields present** - event_id, ticker_id, tags, timestamps  
✅ **Row Level Security** - Anyone can read, authenticated users can write  
✅ **Cross-DB key** - event_id links to your existing events  
✅ **Read/write by event_id** - Full CRUD operations available  

## Next Steps

Once this is working, you can:

1. **Integrate tags into your event displays** - Show tags on event cards
2. **Add tag-based filtering** - Filter events by tags
3. **Create tag management UI** - Admin interface for managing tags
4. **Add tag analytics** - Track most popular tags
5. **Implement tag suggestions** - Auto-suggest tags based on event type

## Troubleshooting

### Common Issues

1. **"No tags found"** - Check that the event_id exists in both databases
2. **Authentication errors** - Ensure user is signed in for write operations
3. **Array operations** - Make sure you're using PostgreSQL arrays correctly

### Testing

Use the test component at `/test` to verify:
- Tag lookup by event_id
- Adding/removing individual tags
- Updating all tags at once
- Cross-database connectivity
