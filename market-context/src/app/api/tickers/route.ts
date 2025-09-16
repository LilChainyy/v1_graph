import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query || query.trim().length < 1) {
      return NextResponse.json([]);
    }

    const tickers = await prisma.ticker.findMany({
      where: {
        OR: [
          {
            symbol: {
              contains: query,
            },
          },
          {
            name: {
              contains: query,
            },
          },
        ],
      },
      take: 10, // Limit results
      orderBy: [
        {
          symbol: 'asc',
        },
      ],
    });

    return NextResponse.json(tickers);
  } catch (error) {
    console.error('Error fetching tickers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tickers' },
      { status: 500 }
    );
  }
}
