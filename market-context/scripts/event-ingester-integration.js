// Integration helper for your existing event ingester
// Add this to your event ingester after creating new events

const { syncEventTags } = require('./sync-event-tags');

/**
 * Call this function after creating a new event in your database
 * It will automatically create the corresponding tags row in Supabase
 */
async function onEventCreated(eventId) {
  try {
    console.log(`🏷️  Auto-syncing tags for new event: ${eventId}`);
    const success = await syncEventTags(eventId);
    
    if (success) {
      console.log(`✅ Tags synced for event: ${eventId}`);
    } else {
      console.log(`❌ Failed to sync tags for event: ${eventId}`);
    }
    
    return success;
  } catch (error) {
    console.error(`💥 Error auto-syncing tags for ${eventId}:`, error);
    return false;
  }
}

/**
 * Call this function after updating an event in your database
 * It will update the corresponding tags row in Supabase
 */
async function onEventUpdated(eventId) {
  try {
    console.log(`🔄 Auto-updating tags for modified event: ${eventId}`);
    const success = await syncEventTags(eventId);
    
    if (success) {
      console.log(`✅ Tags updated for event: ${eventId}`);
    } else {
      console.log(`❌ Failed to update tags for event: ${eventId}`);
    }
    
    return success;
  } catch (error) {
    console.error(`💥 Error auto-updating tags for ${eventId}:`, error);
    return false;
  }
}

/**
 * Call this function after deleting an event from your database
 * It will remove the corresponding tags row from Supabase
 */
async function onEventDeleted(eventId) {
  try {
    console.log(`🗑️  Auto-removing tags for deleted event: ${eventId}`);
    
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing Supabase environment variables');
      return false;
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { error } = await supabase
      .from('event_tags')
      .delete()
      .eq('event_id', eventId);
    
    if (error) {
      console.error(`❌ Error removing tags for ${eventId}:`, error);
      return false;
    }
    
    console.log(`✅ Tags removed for event: ${eventId}`);
    return true;
    
  } catch (error) {
    console.error(`💥 Error auto-removing tags for ${eventId}:`, error);
    return false;
  }
}

/**
 * Batch sync for multiple events
 * Useful for bulk operations
 */
async function onEventsBatchCreated(eventIds) {
  try {
    console.log(`🏷️  Auto-syncing tags for ${eventIds.length} events`);
    
    const results = await Promise.allSettled(
      eventIds.map(eventId => syncEventTags(eventId))
    );
    
    const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length;
    const errorCount = results.length - successCount;
    
    console.log(`📈 Batch sync complete: ${successCount} success, ${errorCount} errors`);
    
    return { successCount, errorCount };
  } catch (error) {
    console.error(`💥 Error batch syncing tags:`, error);
    return { successCount: 0, errorCount: eventIds.length };
  }
}

module.exports = {
  onEventCreated,
  onEventUpdated,
  onEventDeleted,
  onEventsBatchCreated
};
