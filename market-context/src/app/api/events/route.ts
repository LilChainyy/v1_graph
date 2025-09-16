import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { CompanyEvent } from '@/types/company';

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

    // Fetch events for this ticker
    const events = await prisma.event.findMany({
      where: { tickerId: tickerRecord.id },
      orderBy: { date: 'asc' },
    });

    // Transform database events to CompanyEvent format
    const companyEvents: CompanyEvent[] = events.map(event => ({
      id: event.id,
      ticker: ticker as any, // Type assertion for now
      title: event.title,
      date: event.date,
      time: event.time || undefined,
      eventType: event.eventType as any,
      direct: event.direct,
      isBinary: event.isBinary,
      isRecurring: event.isRecurring as any,
      tags: JSON.parse(event.tags),
      source: event.source as any,
      createdAt: event.createdAt.toISOString(),
      links: event.links ? JSON.parse(event.links) : undefined,
      notes: event.notes || undefined,
    }));

    return NextResponse.json(companyEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
