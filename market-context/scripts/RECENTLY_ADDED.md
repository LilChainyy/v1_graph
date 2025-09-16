# Recently Added Events Feature

This feature shows newly added events at the bottom of company calendar pages.

## How It Works

### 1. Python Scraper Updates
- **Tracks Added Events**: The `EventFetcher` class maintains an `added_this_run` list
- **Adds Metadata**: Each new event gets `createdAt` (ISO8601) and `source` fields
- **Creates Lightweight File**: Writes `nvda_events_added_latest.json` with minimal data

### 2. Data Structure
```json
[
  {
    "id": "nvda_earnings_q3fy26",
    "title": "NVDA Q3 FY2026 earnings (after close)",
    "date": "2025-11-19",
    "source": "IR",
    "createdAt": "2025-09-14T13:05:22Z"
  }
]
```

### 3. Frontend Components
- **`loadRecentlyAddedNVDA()`**: Fetches recently added events from API
- **`RecentlyAddedEvents`**: React component that displays the list
- **Calendar Integration**: Added to `/calendar/NVDA` page

### 4. Display Format
```
Recently added (latest update)
2025-09-25 — New Test Event - Recently Added Demo [source: Manual]
2025-09-20 — Test Event for Recently Added [source: Manual]
```

## Files Modified/Created

### Python Scraper
- `scripts/fetch_events.py` - Added tracking and metadata
- `scripts/test_fetch.py` - Test script

### Frontend
- `src/lib/loaders.ts` - Data loader function
- `src/components/RecentlyAddedEvents.tsx` - Display component
- `src/app/calendar/[ticker]/page.tsx` - Calendar page integration
- `src/app/data/company/nvda_events_added_latest.json/route.ts` - API route

### Data Files
- `src/data/company/nvda_events_added_latest.json` - Recently added events
- `src/data/company/nvda_events.json` - Updated with metadata

## Testing

1. **Manual Test**: Add events to `nvda_events.json` and create `nvda_events_added_latest.json`
2. **Scraper Test**: Run `python3 scripts/fetch_events.py --ticker NVDA --start 2025-09-14 --end 2025-09-30`
3. **Frontend Test**: Visit `/calendar/NVDA` to see recently added section

## Sources

- **IR**: NVIDIA Investor Relations
- **FOMC**: Federal Reserve meetings
- **Treasury**: Treasury auctions
- **USTR**: Trade policy actions
- **Manual**: Manually added events

## Future Enhancements

- Add timestamps to show when events were added
- Add filtering by source
- Add "Mark as read" functionality
- Support for multiple companies
- Real-time updates via WebSocket
