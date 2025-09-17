import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface SecFiling {
  form: string;
  filingDate: string;
  reportDate: string;
  accessionNumber: string;
  primaryDocument: string;
}

interface SecResponse {
  filings?: {
    recent?: {
      form: string[];
      filingDate: string[];
      reportDate: string[];
      accessionNumber: string[];
      primaryDocument: string[];
    };
  };
}

// CIK mapping for known tickers
const TICKER_CIK_MAP: Record<string, string> = {
  'NVDA': '0001045810',
  'HOOD': '0001783879',
  'AAPL': '0000320193',
  'TSLA': '0001318605',
  'META': '0001326801',
  'AMZN': '0001018724',
};

export async function fetchSecFilingsForTicker(ticker: string): Promise<void> {
  try {
    console.log(`📄 Fetching SEC filings for ${ticker}...`);
    
    const cik = TICKER_CIK_MAP[ticker];
    if (!cik) {
      console.log(`No CIK mapping found for ${ticker}`);
      return;
    }
    
    const response = await fetch(
      `https://data.sec.gov/submissions/CIK${cik.padStart(10, '0')}.json`,
      {
        headers: {
          'User-Agent': 'MarketContext/1.0 (contact@example.com)',
          'Accept': 'application/json',
        },
      }
    );
    
    if (!response.ok) {
      throw new Error(`SEC API error: ${response.status}`);
    }
    
    const data: SecResponse = await response.json();
    
    if (!data.filings?.recent) {
      console.log(`No filings data found for ${ticker}`);
      return;
    }
    
    const filings = data.filings.recent;
    const filingCount = filings.form.length;
    
    // Find ticker in database
    const tickerRecord = await prisma.ticker.findUnique({
      where: { symbol: ticker }
    });
    
    if (!tickerRecord) {
      console.log(`Ticker ${ticker} not found in database`);
      return;
    }
    
    // Process recent filings (last 20)
    for (let i = 0; i < Math.min(filingCount, 20); i++) {
      const form = filings.form[i];
      const filingDate = filings.filingDate[i];
      const accessionNumber = filings.accessionNumber[i];
      const primaryDocument = filings.primaryDocument[i];
      
      // Only process specific form types
      if (!['10-Q', '10-K', '8-K', 'DEF 14A'].includes(form)) {
        continue;
      }
      
      const eventId = `sec_${ticker}_${accessionNumber}`;
      const title = `${ticker} ${form} Filing`;
      
      await prisma.event.upsert({
        where: { id: eventId },
        update: {
          title,
          start: filingDate,
          category: 'SEC_FILINGS',
          source: 'SEC_EDGAR',
          externalId: accessionNumber,
          links: JSON.stringify([`https://www.sec.gov/Archives/edgar/data/${cik}/${accessionNumber.replace(/-/g, '')}/${primaryDocument}`]),
          notes: `Form ${form} filed on ${filingDate}`,
          updatedAt: new Date().toISOString(),
        },
        create: {
          id: eventId,
          tickerId: tickerRecord.id,
          title,
          start: filingDate,
          category: 'SEC_FILINGS',
          timezone: 'UTC',
          source: 'SEC_EDGAR',
          externalId: accessionNumber,
          links: JSON.stringify([`https://www.sec.gov/Archives/edgar/data/${cik}/${accessionNumber.replace(/-/g, '')}/${primaryDocument}`]),
          notes: `Form ${form} filed on ${filingDate}`,
        },
      });
    }
    
    console.log(`✅ Processed SEC filings for ${ticker}`);
  } catch (error) {
    console.error(`❌ Error fetching SEC filings for ${ticker}:`, error);
  }
}

export async function fetchAllSecFilings(): Promise<void> {
  const tickers = Object.keys(TICKER_CIK_MAP);
  
  for (const ticker of tickers) {
    await fetchSecFilingsForTicker(ticker);
    // Add delay to respect API rate limits
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

// Run if called directly
if (require.main === module) {
  fetchAllSecFilings()
    .then(() => {
      console.log('🎉 SEC filings fetch completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ SEC filings fetch failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
