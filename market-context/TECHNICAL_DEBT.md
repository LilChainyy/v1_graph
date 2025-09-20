# Technical Debt & Future Improvements

## Database Architecture Mismatch

### Current State
- **Prisma Schema**: Configured for SQLite (`provider = "sqlite"`)
- **Environment**: `.env` contains PostgreSQL URL
- **Supabase**: Uses PostgreSQL for social features
- **Events**: Currently stored in SQLite via Prisma

### Impact Assessment
- ✅ **No immediate impact** - System works correctly
- ✅ **Decoupled architecture** - Social features use Supabase (Postgres)
- ✅ **Events isolated** - Event data separate from social data
- ⚠️ **Future consideration** - May want unified database

## Future Sprint Items

### 🔄 **Sprint: Database Migration (Optional)**
**Priority**: Low  
**Effort**: Medium  
**Timeline**: Future sprint

#### Description
Consider migrating events from SQLite to PostgreSQL to align with Supabase and create a unified database architecture.

#### Options
1. **Keep Current Architecture** (Recommended)
   - Events in SQLite (Prisma)
   - Social data in Supabase (Postgres)
   - Cross-DB linking via `event_id`
   - Pros: Simple, works well, clear separation
   - Cons: Two databases to maintain

2. **Migrate Events to Postgres**
   - Move events to Supabase PostgreSQL
   - Update Prisma schema to use Postgres
   - Single database for everything
   - Pros: Unified database, simpler architecture
   - Cons: Migration effort, potential downtime

3. **Hybrid Approach**
   - Keep events in SQLite for now
   - Add Postgres events table for new features
   - Gradual migration over time
   - Pros: No disruption, gradual transition
   - Cons: Temporary complexity

#### Migration Steps (if chosen)
```sql
-- 1. Create events table in Supabase
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  ticker_id TEXT,
  title TEXT NOT NULL,
  start TEXT NOT NULL,
  end TEXT,
  category TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  source TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  links TEXT,
  notes TEXT,
  external_id TEXT,
  normalized_title TEXT
);

-- 2. Migrate data from SQLite to Postgres
-- 3. Update Prisma schema
-- 4. Update application code
-- 5. Test thoroughly
-- 6. Deploy with rollback plan
```

#### Decision Factors
- **Performance**: Current SQLite performance is adequate
- **Scalability**: Supabase Postgres scales better long-term
- **Maintenance**: Single database easier to maintain
- **Features**: Postgres has more advanced features
- **Cost**: Consider Supabase usage limits

### 🔄 **Sprint: Prisma Provider Alignment**
**Priority**: Low  
**Effort**: Low  
**Timeline**: When migrating events

#### Description
Update Prisma schema to use PostgreSQL provider instead of SQLite.

#### Changes Required
```prisma
// Current
datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

// Future
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

## Current Architecture Benefits

### Why Current Setup Works Well
1. **Clear Separation**: Events vs Social data
2. **Performance**: SQLite is fast for read-heavy event data
3. **Simplicity**: No complex migrations needed
4. **Flexibility**: Can optimize each database independently
5. **Cost**: SQLite has no hosting costs

### Cross-Database Linking
- **Event ID**: Common key between databases
- **Batch Operations**: Efficient tag fetching
- **Real-time**: Supabase handles social updates
- **Caching**: Can cache event data locally

## Monitoring & Metrics

### Track These Metrics
- **Event Query Performance**: SQLite response times
- **Tag Fetch Performance**: Supabase batch operations
- **User Experience**: Page load times
- **Database Size**: Growth rates for both databases

### When to Consider Migration
- Event database > 1GB
- Complex event queries needed
- Real-time event updates required
- Team prefers single database
- Supabase features needed for events

## Recommendation

### Short Term (Next 3-6 months)
- ✅ **Keep current architecture**
- ✅ **Monitor performance**
- ✅ **Focus on features**
- ✅ **Document decisions**

### Long Term (6+ months)
- 🔄 **Evaluate migration** based on:
  - Performance requirements
  - Team preferences
  - Feature needs
  - Maintenance overhead

## Notes

- **No blocking issues** with current setup
- **Migration is optional**, not required
- **Architecture is sound** for current needs
- **Focus on features** rather than infrastructure
- **Document decisions** for future reference

---

*Last Updated: [Current Date]*  
*Status: No action required*  
*Next Review: Next quarter planning*
