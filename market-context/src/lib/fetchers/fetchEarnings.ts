import { PrismaClient } from '@prisma/client';
import { createUpsertEventData } from '../eventDeduplication';

const prisma = new PrismaClient();

interface PolygonEarningsResponse {
  results?: Array<{
    ticker: string;
    date: string;
    time: string;
    eps_estimate?: number;
    eps_actual?: number;
    revenue_estimate?: number;
    revenue_actual?: number;
  }>;
}

export async function fetchEarningsFromPolygon(ticker: string, apiKey: string): Promise<void> {
  try {
    console.log(`📊 Fetching earnings for ${ticker} from Polygon...`);
    
    const response = await fetch(
      `https://api.polygon.io/vX/reference/earnings?ticker=${ticker}&apiKey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Polygon API error: ${response.status}`);
    }
    
    const data: PolygonEarningsResponse = await response.json();
    
    if (!data.results || data.results.length === 0) {
      console.log(`No earnings data found for ${ticker}`);
      return;
    }
    
    // Find ticker in database
    const tickerRecord = await prisma.ticker.findUnique({
      where: { symbol: ticker }
    });
    
    if (!tickerRecord) {
      console.log(`Ticker ${ticker} not found in database`);
      return;
    }
    
    for (const earning of data.results) {
      const title = `${ticker} Earnings Call`;
      const eventData = createUpsertEventData({
        tickerId: tickerRecord.id,
        title,
        start: earning.date,
        category: 'EARNINGS',
        source: 'POLYGON',
        externalId: `${ticker}_${earning.date}`,
        notes: `EPS Estimate: ${earning.eps_estimate || 'N/A'}, Revenue Estimate: ${earning.revenue_estimate || 'N/A'}`,
      });
      
      await prisma.event.upsert({
        where: {
          tickerId_start_category_normalizedTitle: {
            tickerId: tickerRecord.id,
            start: earning.date,
            category: 'EARNINGS',
            normalizedTitle: eventData.normalizedTitle,
          }
        },
        update: {
          title: eventData.title,
          end: eventData.end,
          source: eventData.source,
          notes: eventData.notes,
          externalId: eventData.externalId,
          links: eventData.links,
          updatedAt: new Date(),
        },
        create: {
          id: `polygon_${ticker}_${earning.date}_earnings`,
          ...eventData,
        },
      });
    }
    
    console.log(`✅ Processed ${data.results.length} earnings events for ${ticker}`);
  } catch (error) {
    console.error(`❌ Error fetching earnings for ${ticker}:`, error);
  }
}

export async function fetchAllEarnings(): Promise<void> {
  const apiKey = process.env.POLYGON_API_KEY;
  if (!apiKey) {
    console.log('⚠️ POLYGON_API_KEY not found, skipping earnings fetch');
    return;
  }
  
  // Get all tickers from database
  const tickers = await prisma.ticker.findMany({
    select: { symbol: true }
  });
  
  for (const ticker of tickers) {
    await fetchEarningsFromPolygon(ticker.symbol, apiKey);
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Run if called directly
if (require.main === module) {
  fetchAllEarnings()
    .then(() => {
      console.log('🎉 Earnings fetch completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Earnings fetch failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
