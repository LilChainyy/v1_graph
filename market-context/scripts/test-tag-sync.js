// Test script to verify tag synchronization
// Run with: node scripts/test-tag-sync.js

const { syncEventTags, syncAllMissingTags } = require('./sync-event-tags');

async function testTagSync() {
  console.log('🧪 Testing tag synchronization...\n');
  
  try {
    // Test 1: Sync a specific event
    console.log('Test 1: Syncing specific event...');
    const testEventId = 'nvda_2025-11-19_earnings';
    const result1 = await syncEventTags(testEventId);
    console.log(`Result: ${result1 ? '✅ Success' : '❌ Failed'}\n`);
    
    // Test 2: Sync all missing events
    console.log('Test 2: Syncing all missing events...');
    await syncAllMissingTags();
    console.log('✅ Test complete\n');
    
    // Test 3: Verify tags were created
    console.log('Test 3: Verifying tags in Supabase...');
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.log('⚠️  Skipping Supabase verification (missing env vars)');
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { data, error } = await supabase
      .from('event_tags')
      .select('event_id, ticker_id, tags')
      .limit(5);
    
    if (error) {
      console.log(`❌ Error verifying tags: ${error.message}`);
    } else {
      console.log('✅ Tags found in Supabase:');
      data?.forEach(row => {
        console.log(`  ${row.event_id} | ${row.ticker_id || 'GLOBAL'} | ${row.tags.join(', ')}`);
      });
    }
    
  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Run the test
if (require.main === module) {
  testTagSync();
}

module.exports = { testTagSync };
