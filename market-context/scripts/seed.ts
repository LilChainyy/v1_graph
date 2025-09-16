import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nvdaEvents = [
  {
    title: "NVDA Q3 FY2026 Earnings (After Close)",
    date: "2025-11-19",
    time: "16:20 ET",
    eventType: "Earnings",
    direct: true,
    isBinary: true,
    isRecurring: "fixed",
    tags: ["Tech", "AI", "Semis"],
    source: "IR",
    links: ["https://ir.nvidia.com/"],
    notes: "Q3 FY2026 earnings release and conference call"
  },
  {
    title: "GTC Spring 2025 - AI Conference",
    date: "2025-03-17",
    time: "09:00 PT",
    eventType: "Product",
    direct: true,
    isBinary: false,
    isRecurring: "episodic",
    tags: ["Tech", "AI", "Semis", "DataCenter"],
    source: "IR",
    links: ["https://www.nvidia.com/gtc/"],
    notes: "Major AI product announcements, Rubin architecture updates"
  },
  {
    title: "Goldman Sachs Communacopia + Technology Conference",
    date: "2025-09-08",
    time: "TBD",
    eventType: "Conference",
    direct: true,
    isBinary: false,
    isRecurring: "episodic",
    tags: ["Tech", "AI", "Semis", "Finance"],
    source: "IR",
    links: ["https://www.goldmansachs.com/"],
    notes: "Management fireside chat and Q&A session"
  },
  {
    title: "Rubin CPX Architecture Launch",
    date: "2025-09-09",
    eventType: "Product",
    direct: true,
    isBinary: false,
    isRecurring: "one-off",
    tags: ["Tech", "AI", "Semis", "DataCenter"],
    source: "IR",
    links: ["https://www.nvidia.com/"],
    notes: "Massive-context inference positioning, follow-on coverage expected"
  },
  {
    title: "SEC 10-Q Filing (Q3 FY2026)",
    date: "2025-11-26",
    eventType: "Legal/Reg",
    direct: true,
    isBinary: false,
    isRecurring: "fixed",
    tags: ["Tech", "AI", "Semis"],
    source: "IR",
    links: ["https://www.sec.gov/"],
    notes: "Quarterly regulatory filing with detailed financials"
  },
  {
    title: "Major Automotive Partnership Announcement",
    date: "2025-10-15",
    eventType: "Partnership",
    direct: true,
    isBinary: false,
    isRecurring: "episodic",
    tags: ["Tech", "AI", "Semis", "Automotive"],
    source: "IR",
    links: ["https://www.nvidia.com/automotive/"],
    notes: "Strategic partnership with major automaker for autonomous driving"
  },
  {
    title: "FOMC September 2025 Decision",
    date: "2025-09-17",
    time: "14:00 ET",
    eventType: "FOMC",
    direct: false,
    isBinary: true,
    isRecurring: "fixed",
    tags: ["Bonds", "Rates", "Broad Market"],
    source: "FOMC",
    links: ["https://www.federalreserve.gov/"],
    notes: "Federal Reserve policy decision and economic projections"
  },
  {
    title: "Treasury 10-Year Note Auction",
    date: "2025-09-15",
    time: "13:00 ET",
    eventType: "Treasury Auction",
    direct: false,
    isBinary: false,
    isRecurring: "fixed",
    tags: ["Bonds", "Rates", "Broad Market"],
    source: "Treasury",
    links: ["https://www.treasurydirect.gov/"],
    notes: "U.S. Treasury 10-year note auction affecting interest rates"
  },
  {
    title: "USTR Export Controls Update",
    date: "2025-10-01",
    eventType: "Tariff",
    direct: false,
    isBinary: true,
    isRecurring: "episodic",
    tags: ["Materials", "Manufacturing", "Broad Market"],
    source: "USTR",
    links: ["https://ustr.gov/"],
    notes: "Potential updates to semiconductor export controls"
  },
  {
    title: "AMD Instinct MI400 Series Launch",
    date: "2025-11-05",
    eventType: "Competitor",
    direct: false,
    isBinary: false,
    isRecurring: "episodic",
    tags: ["Tech", "AI", "Semis"],
    source: "Competitor",
    links: ["https://www.amd.com/"],
    notes: "AMD's next-gen AI accelerator launch, competitive pressure"
  },
  {
    title: "CPI September 2025 Release",
    date: "2025-10-15",
    time: "08:30 ET",
    eventType: "MacroPrint",
    direct: false,
    isBinary: false,
    isRecurring: "fixed",
    tags: ["Bonds", "Rates", "USD", "Broad Market"],
    source: "BIS",
    links: ["https://www.bls.gov/"],
    notes: "Consumer Price Index release, inflation data"
  },
  {
    title: "Nonfarm Payrolls October 2025",
    date: "2025-11-01",
    time: "08:30 ET",
    eventType: "MacroPrint",
    direct: false,
    isBinary: false,
    isRecurring: "fixed",
    tags: ["Bonds", "Rates", "USD", "Broad Market"],
    source: "BIS",
    links: ["https://www.bls.gov/"],
    notes: "Employment situation report, labor market data"
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  // Create NVDA ticker
  const nvdaTicker = await prisma.ticker.upsert({
    where: { symbol: 'NVDA' },
    update: {},
    create: {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
    },
  });

  console.log(`✅ Created/updated ticker: ${nvdaTicker.symbol}`);

  // Clear existing events for NVDA
  await prisma.event.deleteMany({
    where: { tickerId: nvdaTicker.id },
  });

  console.log('🗑️  Cleared existing NVDA events');

  // Create events
  for (const eventData of nvdaEvents) {
    const event = await prisma.event.create({
      data: {
        tickerId: nvdaTicker.id,
        title: eventData.title,
        date: eventData.date,
        time: eventData.time || null,
        eventType: eventData.eventType,
        direct: eventData.direct,
        isBinary: eventData.isBinary,
        isRecurring: eventData.isRecurring,
        tags: JSON.stringify(eventData.tags),
        source: eventData.source,
        links: eventData.links ? JSON.stringify(eventData.links) : null,
        notes: eventData.notes || null,
      },
    });
    console.log(`✅ Created event: ${event.title}`);
  }

  // Add a few more tickers for testing
  const additionalTickers = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'TSLA', name: 'Tesla, Inc.' },
    { symbol: 'META', name: 'Meta Platforms, Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  ];

  for (const tickerData of additionalTickers) {
    await prisma.ticker.upsert({
      where: { symbol: tickerData.symbol },
      update: {},
      create: tickerData,
    });
    console.log(`✅ Created/updated ticker: ${tickerData.symbol}`);
  }

  console.log('🎉 Database seed completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
