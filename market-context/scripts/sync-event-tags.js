// Script to sync event tags with Supabase when new events are added
// This can be called from your event ingester

const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');

const prisma = new PrismaClient();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tag generation logic (same as backfill script)
function generateTags(event) {
  const tags = [];
  
  // Primary category tags
  switch (event.category) {
    case 'MACRO_FOMC':
      tags.push('MACRO_FOMC', 'HIGH_IMPACT', 'BINARY', 'RECURRING');
      break;
    case 'MACRO_CPI':
      tags.push('MACRO_CPI', 'HIGH_IMPACT', 'RECURRING');
      break;
    case 'MACRO_JOBS':
      tags.push('MACRO_JOBS', 'HIGH_IMPACT', 'RECURRING');
      break;
    case 'MACRO_GDP':
      tags.push('MACRO_GDP', 'MEDIUM_IMPACT', 'RECURRING');
      break;
    case 'EARNINGS':
      tags.push('EARNINGS', 'HIGH_IMPACT', 'BINARY', 'RECURRING');
      if (event.title.includes('Q1')) tags.push('EARNINGS_Q1');
      else if (event.title.includes('Q2')) tags.push('EARNINGS_Q2');
      else if (event.title.includes('Q3')) tags.push('EARNINGS_Q3');
      else if (event.title.includes('Q4')) tags.push('EARNINGS_Q4');
      break;
    case 'SEC_FILINGS':
      tags.push('SEC_FILINGS', 'MEDIUM_IMPACT', 'RECURRING');
      if (event.title.includes('10-K')) tags.push('SEC_10K');
      else if (event.title.includes('10-Q')) tags.push('SEC_10Q');
      else if (event.title.includes('8-K')) tags.push('SEC_8K');
      break;
    case 'REGULATORY':
      tags.push('REGULATORY', 'MEDIUM_IMPACT');
      if (event.title.includes('FINRA')) tags.push('REGULATORY_FINRA');
      else if (event.title.includes('SEC')) tags.push('REGULATORY_SEC');
      break;
  }
  
  // Company-specific tags
  if (event.ticker) {
    const tickerSymbol = event.ticker.symbol;
    tags.push(tickerSymbol);
    
    switch (tickerSymbol) {
      case 'NVDA':
        tags.push('TECH', 'AI', 'SEMIS');
        break;
      case 'AAPL':
        tags.push('TECH', 'CONSUMER');
        break;
      case 'TSLA':
        tags.push('TECH', 'AUTOMOTIVE', 'ENERGY');
        break;
      case 'HOOD':
        tags.push('FINANCE', 'TECH', 'BROKERAGE');
        break;
      case 'META':
        tags.push('TECH', 'SOCIAL_MEDIA');
        break;
      case 'AMZN':
        tags.push('TECH', 'RETAIL', 'CLOUD');
        break;
    }
  } else {
    tags.push('GLOBAL', 'BROAD_MARKET');
  }
  
  // Time-based tags
  if (event.title.toLowerCase().includes('earnings call')) {
    tags.push('AFTER_MARKET');
  } else if (event.title.toLowerCase().includes('auction')) {
    tags.push('DURING_MARKET');
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

/**
 * Sync tags for a specific event
 */
async function syncEventTags(eventId) {
  try {
    console.log(`🔄 Syncing tags for event: ${eventId}`);
    
    // Fetch event from database
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { ticker: true }
    });
    
    if (!event) {
      console.log(`⚠️  Event not found: ${eventId}`);
      return false;
    }
    
    // Generate tags
    const tags = generateTags(event);
    
    // Upsert tags in Supabase
    const { error } = await supabase
      .from('event_tags')
      .upsert({
        event_id: eventId,
        ticker_id: event.ticker?.symbol || null,
        tags: tags
      });
    
    if (error) {
      console.error(`❌ Error syncing tags for ${eventId}:`, error);
      return false;
    }
    
    console.log(`✅ Synced tags for ${eventId}: ${tags.join(', ')}`);
    return true;
    
  } catch (error) {
    console.error(`💥 Error syncing tags for ${eventId}:`, error);
    return false;
  }
}

/**
 * Sync tags for all events that don't have tags yet
 */
async function syncAllMissingTags() {
  try {
    console.log('🔄 Finding events without tags...');
    
    // Get all event IDs from database
    const events = await prisma.event.findMany({
      select: { id: true },
      orderBy: { start: 'asc' }
    });
    
    const eventIds = events.map(e => e.id);
    
    // Check which events already have tags in Supabase
    const { data: existingTags, error: fetchError } = await supabase
      .from('event_tags')
      .select('event_id')
      .in('event_id', eventIds);
    
    if (fetchError) {
      console.error('❌ Error fetching existing tags:', fetchError);
      return;
    }
    
    const existingEventIds = new Set(existingTags?.map(t => t.event_id) || []);
    const missingEventIds = eventIds.filter(id => !existingEventIds.has(id));
    
    console.log(`📊 Found ${missingEventIds.length} events without tags`);
    
    if (missingEventIds.length === 0) {
      console.log('✅ All events already have tags');
      return;
    }
    
    // Sync tags for missing events
    let successCount = 0;
    let errorCount = 0;
    
    for (const eventId of missingEventIds) {
      const success = await syncEventTags(eventId);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📈 Sync complete:`);
    console.log(`  ✅ Success: ${successCount} events`);
    console.log(`  ❌ Errors: ${errorCount} events`);
    
  } catch (error) {
    console.error('💥 Error syncing all tags:', error);
  }
}

/**
 * Sync tags for recently added events (last N days)
 */
async function syncRecentEvents(days = 7) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    console.log(`🔄 Finding events added in the last ${days} days...`);
    
    const recentEvents = await prisma.event.findMany({
      where: {
        createdAt: {
          gte: cutoffDate
        }
      },
      include: { ticker: true },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`📊 Found ${recentEvents.length} recent events`);
    
    if (recentEvents.length === 0) {
      console.log('✅ No recent events to sync');
      return;
    }
    
    // Sync tags for recent events
    let successCount = 0;
    let errorCount = 0;
    
    for (const event of recentEvents) {
      const success = await syncEventTags(event.id);
      if (success) {
        successCount++;
      } else {
        errorCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n📈 Recent events sync complete:`);
    console.log(`  ✅ Success: ${successCount} events`);
    console.log(`  ❌ Errors: ${errorCount} events`);
    
  } catch (error) {
    console.error('💥 Error syncing recent events:', error);
  }
}

// CLI interface
async function main() {
  const command = process.argv[2];
  const arg = process.argv[3];
  
  switch (command) {
    case 'sync':
      if (arg) {
        await syncEventTags(arg);
      } else {
        console.log('❌ Please provide an event ID: node sync-event-tags.js sync <event_id>');
      }
      break;
      
    case 'sync-all':
      await syncAllMissingTags();
      break;
      
    case 'sync-recent':
      const days = arg ? parseInt(arg) : 7;
      await syncRecentEvents(days);
      break;
      
    default:
      console.log('Usage:');
      console.log('  node sync-event-tags.js sync <event_id>     - Sync tags for specific event');
      console.log('  node sync-event-tags.js sync-all           - Sync tags for all missing events');
      console.log('  node sync-event-tags.js sync-recent [days] - Sync tags for recent events');
      break;
  }
  
  await prisma.$disconnect();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  syncEventTags,
  syncAllMissingTags,
  syncRecentEvents,
  generateTags
};
