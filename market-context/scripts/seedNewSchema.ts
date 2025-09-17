import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedNewSchema() {
  console.log('🌱 Seeding new database schema...\n');

  // Create tickers
  const tickers = [
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'HOOD', name: 'Robinhood Markets Inc.' },
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'META', name: 'Meta Platforms, Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  ];

  for (const tickerData of tickers) {
    await prisma.ticker.upsert({
      where: { symbol: tickerData.symbol },
      update: {},
      create: tickerData,
    });
    console.log(`✅ Created/updated ticker: ${tickerData.symbol}`);
  }

  // Create sample events for NVDA
  const nvdaTicker = await prisma.ticker.findUnique({ where: { symbol: 'NVDA' } });
  if (nvdaTicker) {
    const nvdaEvents = [
      {
        title: 'NVDA Q3 FY2026 Earnings Call',
        start: '2025-11-19',
        category: 'EARNINGS',
        source: 'POLYGON',
        notes: 'Q3 FY2026 earnings release and conference call',
      },
      {
        title: 'NVDA 10-Q Filing',
        start: '2025-11-26',
        category: 'SEC_FILINGS',
        source: 'SEC_EDGAR',
        notes: 'Quarterly regulatory filing with detailed financials',
      },
    ];

    for (const eventData of nvdaEvents) {
      await prisma.event.upsert({
        where: { id: `nvda_${eventData.start}_${eventData.category.toLowerCase()}` },
        update: {},
        create: {
          id: `nvda_${eventData.start}_${eventData.category.toLowerCase()}`,
          tickerId: nvdaTicker.id,
          title: eventData.title,
          start: eventData.start,
          category: eventData.category,
          timezone: 'UTC',
          source: eventData.source,
          notes: eventData.notes,
        },
      });
      console.log(`✅ Created NVDA event: ${eventData.title}`);
    }
  }

  // Create sample events for HOOD
  const hoodTicker = await prisma.ticker.findUnique({ where: { symbol: 'HOOD' } });
  if (hoodTicker) {
    const hoodEvents = [
      {
        title: 'HOOD Q3 2025 Earnings Call',
        start: '2025-11-07',
        category: 'EARNINGS',
        source: 'POLYGON',
        notes: 'Q3 2025 earnings release and conference call',
      },
      {
        title: 'HOOD 10-Q Filing',
        start: '2025-11-14',
        category: 'SEC_FILINGS',
        source: 'SEC_EDGAR',
        notes: 'Quarterly regulatory filing',
      },
    ];

    for (const eventData of hoodEvents) {
      await prisma.event.upsert({
        where: { id: `hood_${eventData.start}_${eventData.category.toLowerCase()}` },
        update: {},
        create: {
          id: `hood_${eventData.start}_${eventData.category.toLowerCase()}`,
          tickerId: hoodTicker.id,
          title: eventData.title,
          start: eventData.start,
          category: eventData.category,
          timezone: 'UTC',
          source: eventData.source,
          notes: eventData.notes,
        },
      });
      console.log(`✅ Created HOOD event: ${eventData.title}`);
    }
  }

  // Create global macro events
  const globalEvents = [
    {
      title: 'FOMC Meeting',
      start: '2025-09-17',
      category: 'MACRO_FOMC',
      source: 'TRADING_ECONOMICS',
      notes: 'Federal Reserve policy decision',
    },
    {
      title: 'CPI Release',
      start: '2025-10-15',
      category: 'MACRO_CPI',
      source: 'TRADING_ECONOMICS',
      notes: 'Consumer Price Index release',
    },
    {
      title: 'Nonfarm Payrolls',
      start: '2025-11-01',
      category: 'MACRO_JOBS',
      source: 'TRADING_ECONOMICS',
      notes: 'Employment situation report',
    },
    {
      title: 'SEC Filing Deadline - 10-Q',
      start: '2025-10-31',
      category: 'REGULATORY',
      source: 'SEC_SCRAPER',
      notes: 'Quarterly report filing deadline',
    },
  ];

  for (const eventData of globalEvents) {
    await prisma.event.upsert({
      where: { id: `global_${eventData.start}_${eventData.category.toLowerCase()}` },
      update: {},
      create: {
        id: `global_${eventData.start}_${eventData.category.toLowerCase()}`,
        tickerId: null, // Global event
        title: eventData.title,
        start: eventData.start,
        category: eventData.category,
        timezone: 'UTC',
        source: eventData.source,
        notes: eventData.notes,
      },
    });
    console.log(`✅ Created global event: ${eventData.title}`);
  }

  console.log('\n🎉 Database seeding completed!');
}

seedNewSchema()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
