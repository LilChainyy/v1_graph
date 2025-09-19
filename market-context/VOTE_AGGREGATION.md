# Vote Aggregation System

## Overview
This system provides efficient vote counting for market events without exposing individual user identities. It uses database-level aggregation functions for optimal performance.

## Database Functions

### `get_event_vote_counts(event_id_param TEXT)`
Returns vote counts as a table with columns:
- `yes_count`: Number of "yes" votes
- `no_count`: Number of "no" votes  
- `unsure_count`: Number of "unsure" votes
- `total_count`: Total number of votes

### `get_event_vote_counts_json(event_id_param TEXT)`
Returns vote counts as JSON object:
```json
{
  "yes": 5,
  "no": 3,
  "unsure": 2,
  "total": 10
}
```

## API Endpoints

### `GET /api/events/[eventId]/votes`
Returns vote counts for a specific event.

**Authentication Required**: Yes (signed-in users only)

**Response**:
```json
{
  "eventId": "event-123",
  "counts": {
    "yes": 5,
    "no": 3,
    "unsure": 2,
    "total": 10
  }
}
```

## Client-Side Functions

### `getEventVoteCounts(eventId: string)`
Server-side function using Supabase RPC call.

### `getEventVoteCountsAPI(eventId: string)`
Client-side function using fetch API.

## Security Features

1. **User Identity Protection**: Database functions only return aggregated counts, never individual user data
2. **Authentication Required**: All API endpoints require user authentication
3. **Row Level Security**: Supabase RLS policies control access to vote data
4. **Function Security**: Database functions use `SECURITY DEFINER` with proper permissions

## Usage Examples

### In React Components
```tsx
import { useVotes } from '@/hooks/useVotes'

function EventCard({ eventId }) {
  const { voteCounts, userVote, vote } = useVotes(eventId)
  
  return (
    <div>
      <p>Yes: {voteCounts.yes}</p>
      <p>No: {voteCounts.no}</p>
      <p>Unsure: {voteCounts.unsure}</p>
      <p>Total: {voteCounts.total}</p>
    </div>
  )
}
```

### Direct API Call
```javascript
const response = await fetch('/api/events/event-123/votes')
const data = await response.json()
console.log(data.counts) // { yes: 5, no: 3, unsure: 2, total: 10 }
```

## Setup Instructions

1. **Run SQL Functions**: Execute `supabase-vote-aggregation.sql` in your Supabase database
2. **Deploy API**: The API endpoint is automatically available at `/api/events/[eventId]/votes`
3. **Use in Components**: Import and use the `useVotes` hook or vote functions

## Performance Benefits

- **Database-level aggregation**: Faster than client-side counting
- **Single query**: One database call instead of fetching all votes
- **Indexed queries**: Optimized for large datasets
- **Cached results**: Can be easily cached for frequently accessed events
