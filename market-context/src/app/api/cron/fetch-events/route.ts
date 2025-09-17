import { NextRequest, NextResponse } from 'next/server';
import { fetchAllEarnings } from '@/lib/fetchers/fetchEarnings';
import { fetchAllSecFilings } from '@/lib/fetchers/fetchSecFilings';
import { fetchAllMacroEvents } from '@/lib/fetchers/fetchMacroEvents';
import { fetchRegulatoryEvents } from '@/lib/fetchers/fetchRegulatory';

export async function GET(request: NextRequest) {
  try {
    // Verify this is a cron request (optional security check)
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('🚀 Starting scheduled event fetch...');
    
    const startTime = Date.now();
    
    // Run all fetchers
    await Promise.all([
      fetchAllEarnings(),
      fetchAllSecFilings(),
      fetchAllMacroEvents(),
      fetchRegulatoryEvents(),
    ]);
    
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;
    
    console.log(`✅ Scheduled event fetch completed in ${duration.toFixed(2)}s`);
    
    return NextResponse.json({ 
      success: true, 
      duration: `${duration.toFixed(2)}s`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Scheduled event fetch failed:', error);
    return NextResponse.json(
      { error: 'Event fetch failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
