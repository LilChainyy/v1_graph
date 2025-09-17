import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const symbol = searchParams.get('symbol');

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      );
    }

    // Find the ticker first
    const tickerRecord = await prisma.ticker.findUnique({
      where: { symbol: symbol.toUpperCase() },
    });

    if (!tickerRecord) {
      return NextResponse.json(
        { error: 'Ticker not found' },
        { status: 404 }
      );
    }

    // Fetch both ticker-specific and global events
    const [tickerEvents, globalEvents] = await Promise.all([
      // Ticker-specific events
      prisma.event.findMany({
        where: { tickerId: tickerRecord.id },
        select: { category: true },
      }),
      // Global macro/regulatory events
      prisma.event.findMany({
        where: { tickerId: null },
        select: { category: true },
      }),
    ]);

    // Combine and get unique categories
    const allEvents = [...tickerEvents, ...globalEvents];
    const uniqueCategories = [...new Set(allEvents.map(event => event.category))];
    
    // Sort alphabetically for consistent display
    const sortedCategories = uniqueCategories.sort();

    return NextResponse.json(sortedCategories);
  } catch (error) {
    console.error('Error fetching event types:', error);
    return NextResponse.json(
      { error: 'Failed to fetch event types' },
      { status: 500 }
    );
  }
}
