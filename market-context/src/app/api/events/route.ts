import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { DatabaseEvent } from '@/types/company';
import { deduplicateEvents } from '@/lib/eventDeduplication';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get('ticker');

    if (!ticker) {
      return NextResponse.json(
        { error: 'Ticker parameter is required' },
        { status: 400 }
      );
    }

    // Find the ticker first
    const tickerRecord = await prisma.ticker.findUnique({
      where: { symbol: ticker.toUpperCase() },
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
        orderBy: { start: 'asc' },
      }),
      // Global macro/regulatory events
      prisma.event.findMany({
        where: { tickerId: null },
        orderBy: { start: 'asc' },
      }),
    ]);

    // Combine and transform events
    const allEvents = [...tickerEvents, ...globalEvents];
    
    const databaseEvents: DatabaseEvent[] = allEvents.map(event => ({
      id: event.id,
      tickerId: event.tickerId || undefined,
      title: event.title,
      start: event.start,
      end: event.end || undefined,
      category: event.category as any,
      timezone: event.timezone,
      source: event.source as any,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
      links: event.links ? JSON.parse(event.links) : undefined,
      notes: event.notes || undefined,
      externalId: event.externalId || undefined,
    }));

    // Apply deduplication safeguard
    const deduplicatedEvents = deduplicateEvents(databaseEvents);

    return NextResponse.json(deduplicatedEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
