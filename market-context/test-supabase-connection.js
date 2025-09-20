// Test script to verify Supabase connection
// Run with: node test-supabase-connection.js

require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('Environment Variables:');
  console.log(`✅ SUPABASE_URL: ${supabaseUrl ? 'Set' : '❌ Missing'}`);
  console.log(`✅ SUPABASE_ANON_KEY: ${supabaseAnonKey ? 'Set' : '❌ Missing'}`);
  console.log(`✅ SERVICE_ROLE_KEY: ${serviceRoleKey ? 'Set' : '❌ Missing'}\n`);
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('❌ Missing required environment variables!');
    console.log('Please update .env.local with your Supabase credentials.');
    return;
  }
  
  if (supabaseUrl === 'your_supabase_project_url' || supabaseAnonKey === 'your_supabase_anon_key') {
    console.log('❌ Please replace placeholder values in .env.local with your actual Supabase credentials!');
    return;
  }
  
  try {
    // Test client initialization
    console.log('🔧 Initializing Supabase client...');
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized successfully\n');
    
    // Test basic connection
    console.log('🌐 Testing connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.log('❌ Connection failed:', error.message);
      if (error.message.includes('relation "profiles" does not exist')) {
        console.log('💡 This is expected if you haven\'t set up the profiles table yet.');
        console.log('   The connection is working, but the table needs to be created.');
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('✅ Supabase is properly configured and accessible.');
    }
    
    // Test auth functionality
    console.log('\n🔐 Testing auth functionality...');
    const { data: { session }, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('❌ Auth test failed:', authError.message);
    } else {
      console.log('✅ Auth functionality working');
      console.log(`   Current session: ${session ? 'Active' : 'No active session'}`);
    }
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

testSupabaseConnection();
