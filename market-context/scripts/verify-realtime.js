// Script to verify Supabase Realtime configuration
// Run with: node scripts/verify-realtime.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function verifyRealtime() {
  console.log('🔍 Verifying Supabase Realtime Configuration...\n');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.log('❌ Missing Supabase environment variables!');
    console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    return;
  }
  
  if (supabaseUrl === 'your_supabase_project_url' || supabaseServiceKey === 'your_supabase_service_role_key') {
    console.log('❌ Please replace placeholder values in .env.local with your actual Supabase credentials!');
    return;
  }
  
  try {
    // Initialize Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    console.log('✅ Supabase client initialized\n');
    
    // Check if Realtime is enabled
    console.log('🔧 Checking Realtime configuration...');
    
    // Check current tables with Realtime enabled
    const { data: realtimeTables, error: realtimeError } = await supabase
      .rpc('get_realtime_tables');
    
    if (realtimeError) {
      console.log('⚠️  Could not check Realtime tables directly, trying alternative method...');
      
      // Alternative: Check if we can subscribe to changes
      console.log('🧪 Testing Realtime subscription...');
      
      const testChannel = supabase
        .channel('realtime-test')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'profiles' },
          (payload) => {
            console.log('✅ Realtime is working! Received update:', payload);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('✅ Realtime subscription successful');
            console.log('✅ Realtime is properly configured and working');
          } else if (status === 'CHANNEL_ERROR') {
            console.log('❌ Realtime subscription failed');
            console.log('   This might indicate Realtime is not enabled or configured properly');
          } else {
            console.log(`⚠️  Realtime subscription status: ${status}`);
          }
        });
      
      // Clean up after 3 seconds
      setTimeout(() => {
        supabase.removeChannel(testChannel);
        console.log('\n📋 Realtime Verification Summary:');
        console.log('   - If you saw "Realtime is working!" above, Realtime is enabled');
        console.log('   - If you saw subscription errors, Realtime may need configuration');
        console.log('\n💡 Next steps:');
        console.log('   1. Go to Supabase Dashboard → Database → Replication');
        console.log('   2. Ensure "Realtime" toggle is ON');
        console.log('   3. Add future social tables to Realtime publication');
        console.log('   4. See SUPABASE_REALTIME_SETUP.md for detailed instructions');
      }, 3000);
      
    } else {
      console.log('✅ Current tables with Realtime enabled:');
      realtimeTables?.forEach(table => {
        console.log(`   - ${table.schemaname}.${table.tablename}`);
      });
      
      // Check for expected tables
      const expectedTables = ['profiles', 'event_votes', 'event_tags', 'event_metadata'];
      const currentTableNames = realtimeTables?.map(t => t.tablename) || [];
      
      console.log('\n📊 Realtime Coverage:');
      expectedTables.forEach(table => {
        const hasRealtime = currentTableNames.includes(table);
        console.log(`   ${hasRealtime ? '✅' : '❌'} ${table}`);
      });
      
      const missingTables = expectedTables.filter(table => !currentTableNames.includes(table));
      if (missingTables.length > 0) {
        console.log('\n⚠️  Missing Realtime for tables:', missingTables.join(', '));
        console.log('   Run the SQL commands in SUPABASE_REALTIME_SETUP.md to enable them');
      } else {
        console.log('\n✅ All current tables have Realtime enabled!');
      }
      
      console.log('\n💡 Future social tables to add:');
      console.log('   - event_reactions (reactions to events)');
      console.log('   - event_comments (comments on events)');
      console.log('   - user_follows (user following)');
      console.log('   - event_bookmarks (user bookmarks)');
      console.log('   - event_shares (event sharing)');
    }
    
  } catch (error) {
    console.log('❌ Error verifying Realtime:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check your Supabase credentials in .env.local');
    console.log('   2. Ensure your Supabase project is active');
    console.log('   3. Verify Realtime is enabled in Supabase Dashboard');
  }
}

// Create a helper function to check Realtime tables (if RPC doesn't exist)
async function createRealtimeCheckFunction(supabase) {
  const { error } = await supabase.rpc('create_realtime_check_function');
  if (error && !error.message.includes('already exists')) {
    console.log('⚠️  Could not create helper function, using alternative method');
  }
}

// Run the verification
if (require.main === module) {
  verifyRealtime();
}

module.exports = { verifyRealtime };
