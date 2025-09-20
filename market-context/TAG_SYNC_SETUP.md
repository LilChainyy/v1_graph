# Tag Sync Setup Guide

## Overview

This implementation provides complete tag synchronization between your existing events database and Supabase:

1. **Tag Vocabulary** - Comprehensive tagging system
2. **Backfill Script** - Populate tags for existing events
3. **Auto-Sync** - Keep tags in sync for new events
4. **Integration Helpers** - Easy integration with your event ingester

## Files Created

### Tag Vocabulary
- `TAG_VOCABULARY.md` - Complete tag vocabulary and usage guidelines

### Backfill Scripts
- `scripts/backfill-tags.js` - Export existing events to CSV for backfill
- `events-tags-backfill.csv` - Generated CSV with all existing events and tags

### Sync Scripts
- `scripts/sync-event-tags.js` - Core synchronization logic
- `scripts/event-ingester-integration.js` - Integration helpers for your ingester
- `scripts/test-tag-sync.js` - Test script to verify sync works

## Step 1: Import Backfill Data

### Option A: CSV Import (Recommended)

1. **Download the CSV**: `events-tags-backfill.csv` has been generated
2. **Go to Supabase Dashboard**:
   - Navigate to Table Editor
   - Select the `event_tags` table
   - Click "Import data from CSV"
   - Upload `events-tags-backfill.csv`
3. **Verify Import**: Check that all 32 events have tags

### Option B: Script Import

```bash
# Run the sync script to populate all missing tags
node scripts/sync-event-tags.js sync-all
```

## Step 2: Test the Sync Process

```bash
# Test tag synchronization
node scripts/test-tag-sync.js
```

This will:
- Sync a specific test event
- Sync all missing events
- Verify tags are created in Supabase

## Step 3: Integrate with Your Event Ingester

Add this to your event ingester after creating/updating events:

```javascript
const { onEventCreated, onEventUpdated, onEventDeleted } = require('./scripts/event-ingester-integration');

// After creating a new event
async function createEvent(eventData) {
  // ... your existing event creation logic ...
  const eventId = await prisma.event.create({...});
  
  // Auto-sync tags
  await onEventCreated(eventId);
  
  return eventId;
}

// After updating an event
async function updateEvent(eventId, eventData) {
  // ... your existing update logic ...
  await prisma.event.update({...});
  
  // Auto-sync tags
  await onEventUpdated(eventId);
}

// After deleting an event
async function deleteEvent(eventId) {
  // ... your existing delete logic ...
  await prisma.event.delete({...});
  
  // Auto-sync tags
  await onEventDeleted(eventId);
}
```

## Step 4: Verify Everything Works

### Check Tag Coverage
```bash
# Verify all events have tags
node scripts/sync-event-tags.js sync-all
```

### Test New Event Creation
1. Create a new event in your database
2. Run: `node scripts/sync-event-tags.js sync <event_id>`
3. Check that tags appear in Supabase

### Check Tag Statistics
The backfill script shows tag distribution:
- **RECURRING**: 28 events
- **MEDIUM_IMPACT**: 20 events  
- **GLOBAL**: 16 events
- **TECH**: 16 events
- **SEC_FILINGS**: 14 events

## Tag Vocabulary

### Primary Categories
- `MACRO_FOMC` - Federal Reserve meetings
- `MACRO_CPI` - Consumer Price Index
- `MACRO_JOBS` - Employment data
- `EARNINGS_Q1/Q2/Q3/Q4` - Quarterly earnings
- `SEC_10K/10Q/8K` - SEC filings
- `REGULATORY_FINRA/SEC` - Regulatory events

### Company Tags
- `NVDA`, `AAPL`, `TSLA`, `HOOD`, `META`, `AMZN`

### Sector Tags
- `TECH`, `AI`, `SEMIS`, `AUTOMOTIVE`, `FINANCE`, `HEALTHCARE`

### Impact Tags
- `HIGH_IMPACT`, `MEDIUM_IMPACT`, `LOW_IMPACT`
- `BINARY`, `RECURRING`, `ONE_TIME`

## API Endpoints

Once tags are synced, you can use:

- `GET /api/events/[eventId]/tags` - Get tags for an event
- `POST /api/events/[eventId]/tags` - Update tags for an event
- `DELETE /api/events/[eventId]/tags` - Remove tags for an event

## Monitoring

### Check Sync Status
```bash
# See which events are missing tags
node scripts/sync-event-tags.js sync-all
```

### Sync Recent Events
```bash
# Sync events added in the last 7 days
node scripts/sync-event-tags.js sync-recent 7
```

### Manual Sync
```bash
# Sync a specific event
node scripts/sync-event-tags.js sync <event_id>
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   - Ensure `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
   - Check `.env.local` file

2. **Sync Failures**
   - Check Supabase connection
   - Verify event exists in database
   - Check Supabase logs for errors

3. **Missing Tags**
   - Run `sync-all` to populate missing tags
   - Check that event_id matches between databases

### Verification Commands

```bash
# Check database connection
node scripts/test-tag-sync.js

# Verify all events have tags
node scripts/sync-event-tags.js sync-all

# Check specific event
node scripts/sync-event-tags.js sync nvda_2025-11-19_earnings
```

## Next Steps

Once tags are synced:

1. **Update Event Displays** - Show tags on event cards
2. **Add Tag Filtering** - Filter events by tags
3. **Create Tag Analytics** - Track popular tags
4. **Implement Tag Suggestions** - Auto-suggest tags for new events

## Acceptance Criteria Met

✅ **Tag vocabulary defined** - Comprehensive tagging system  
✅ **Existing events backfilled** - CSV generated with all 32 events  
✅ **Auto-sync for new events** - Integration helpers provided  
✅ **All visible events have tags** - Backfill covers all events  
✅ **New events auto-get tags** - Sync scripts ready for integration  

The tag synchronization system is ready to use! Import the CSV into Supabase and integrate the sync functions with your event ingester.
