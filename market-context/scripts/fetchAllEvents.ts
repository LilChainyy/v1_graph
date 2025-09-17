#!/usr/bin/env tsx

import { fetchAllEarnings } from '../src/lib/fetchers/fetchEarnings';
import { fetchAllSecFilings } from '../src/lib/fetchers/fetchSecFilings';
import { fetchAllMacroEvents } from '../src/lib/fetchers/fetchMacroEvents';
import { fetchRegulatoryEvents } from '../src/lib/fetchers/fetchRegulatory';

async function fetchAllEvents() {
  console.log('🚀 Starting comprehensive event fetch...\n');
  
  const startTime = Date.now();
  
  try {
    // Run all fetchers in parallel for better performance
    await Promise.all([
      fetchAllEarnings(),
      fetchAllSecFilings(),
      fetchAllMacroEvents(),
      fetchRegulatoryEvents(),
    ]);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`\n🎉 All events fetched successfully in ${duration.toFixed(2)}s`);
  } catch (error) {
    console.error('❌ Event fetch failed:', error);
    process.exit(1);
  }
}

// Run the fetcher
fetchAllEvents();
