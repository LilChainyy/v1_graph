import { NextResponse } from 'next/server';
import { fetchMorningWraps, sceneFromWraps } from '@/lib/morningWraps';

export async function GET() {
  try {
    const wraps = await fetchMorningWraps();
    const sceneData = sceneFromWraps(wraps);
    
    return NextResponse.json(sceneData);
  } catch (error) {
    console.warn('Failed to fetch scene data:', error);
    
    // Return default data on error
    return NextResponse.json({
      marketTrend: 'flat',
      sentiment: 'neutral',
      rates: 'steady',
      fear: 'normal',
      nextEvent: {
        type: 'CPI',
        weekday: 'Thu',
        why: 'checks price pressures'
      },
      sources: [],
      attribution: 'auto summary (defaults)'
    });
  }
}
