import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const hoodEvents = [
  {
    title: "HOOD Q3 2025 Earnings Call",
    date: "2025-11-07",
    time: "17:00 ET",
    eventType: "Earnings",
    direct: true,
    isBinary: true,
    isRecurring: "fixed",
    tags: ["Tech", "Finance"],
    source: "IR",
    links: ["https://investors.robinhood.com/"],
    notes: "Q3 2025 earnings release and conference call"
  },
  {
    title: "FOMC Decision Impact on HOOD",
    date: "2025-09-17",
    time: "14:00 ET",
    eventType: "FOMC",
    direct: false,
    isBinary: true,
    isRecurring: "fixed",
    tags: ["Bonds", "Rates", "Broad Market"],
    source: "FOMC",
    links: ["https://www.federalreserve.gov/"],
    notes: "Federal Reserve policy decision affecting trading volumes and interest rates"
  },
  {
    title: "Treasury Auction Impact on HOOD",
    date: "2025-09-15",
    time: "13:00 ET",
    eventType: "Treasury Auction",
    direct: false,
    isBinary: false,
    isRecurring: "fixed",
    tags: ["Bonds", "Rates", "Broad Market"],
    source: "Treasury",
    links: ["https://www.treasurydirect.gov/"],
    notes: "U.S. Treasury auction affecting interest rates and trading activity"
  },
  {
    title: "HOOD Product Launch - New Trading Features",
    date: "2025-10-20",
    eventType: "Product",
    direct: true,
    isBinary: false,
    isRecurring: "episodic",
    tags: ["Tech", "Finance"],
    source: "IR",
    links: ["https://robinhood.com/"],
    notes: "Launch of new trading features and platform updates"
  }
];

async function main() {
  console.log('🚀 Adding HOOD ticker and events...');

  // Create HOOD ticker
  const hoodTicker = await prisma.ticker.upsert({
    where: { symbol: 'HOOD' },
    update: {},
    create: {
      symbol: 'HOOD',
      name: 'Robinhood Markets Inc.',
    },
  });

  console.log(`✅ Created/updated ticker: ${hoodTicker.symbol} - ${hoodTicker.name}`);

  // Clear existing events for HOOD (if any)
  await prisma.event.deleteMany({
    where: { tickerId: hoodTicker.id },
  });

  console.log('🗑️  Cleared existing HOOD events');

  // Create HOOD events
  for (const eventData of hoodEvents) {
    const event = await prisma.event.create({
      data: {
        tickerId: hoodTicker.id,
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

  console.log('🎉 HOOD ticker and events added successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Failed to add HOOD:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
