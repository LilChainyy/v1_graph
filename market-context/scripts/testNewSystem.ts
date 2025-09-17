import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testNewSystem() {
  console.log('🧪 Testing new database system...\n');

  // Test 1: Check tickers
  console.log('1. Checking tickers...');
  const tickers = await prisma.ticker.findMany();
  console.log(`✅ Found ${tickers.length} tickers: ${tickers.map(t => t.symbol).join(', ')}`);

  // Test 2: Check events by category
  console.log('\n2. Checking events by category...');
  const categories = ['EARNINGS', 'SEC_FILINGS', 'MACRO_FOMC', 'MACRO_CPI', 'MACRO_JOBS', 'MACRO_GDP', 'REGULATORY'];
  
  for (const category of categories) {
    const count = await prisma.event.count({
      where: { category }
    });
    console.log(`   ${category}: ${count} events`);
  }

  // Test 3: Check ticker-specific vs global events
  console.log('\n3. Checking event distribution...');
  const tickerSpecific = await prisma.event.count({
    where: { tickerId: { not: null } }
  });
  const globalEvents = await prisma.event.count({
    where: { tickerId: null }
  });
  console.log(`   Ticker-specific events: ${tickerSpecific}`);
  console.log(`   Global events: ${globalEvents}`);

  // Test 4: Check HOOD events specifically
  console.log('\n4. Checking HOOD events...');
  const hoodTicker = await prisma.ticker.findUnique({ where: { symbol: 'HOOD' } });
  if (hoodTicker) {
    const hoodEvents = await prisma.event.findMany({
      where: { tickerId: hoodTicker.id },
      orderBy: { start: 'asc' }
    });
    console.log(`   HOOD-specific events: ${hoodEvents.length}`);
    hoodEvents.forEach(event => {
      console.log(`     - ${event.title} (${event.start}) - ${event.category}`);
    });
  }

  // Test 5: Check global events
  console.log('\n5. Checking global events...');
  const global = await prisma.event.findMany({
    where: { tickerId: null },
    orderBy: { start: 'asc' }
  });
  console.log(`   Global events: ${global.length}`);
  global.forEach(event => {
    console.log(`     - ${event.title} (${event.start}) - ${event.category}`);
  });

  // Test 6: Test combined query (like the API would do)
  console.log('\n6. Testing combined query for HOOD...');
  if (hoodTicker) {
    const [hoodSpecific, globalForHood] = await Promise.all([
      prisma.event.findMany({
        where: { tickerId: hoodTicker.id },
        orderBy: { start: 'asc' }
      }),
      prisma.event.findMany({
        where: { tickerId: null },
        orderBy: { start: 'asc' }
      })
    ]);
    
    const totalEvents = hoodSpecific.length + globalForHood.length;
    console.log(`   Total events for HOOD calendar: ${totalEvents}`);
    console.log(`   - HOOD-specific: ${hoodSpecific.length}`);
    console.log(`   - Global: ${globalForHood.length}`);
  }

  console.log('\n🎉 System test completed!');
}

testNewSystem()
  .catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
