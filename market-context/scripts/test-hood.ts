import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testHoodIntegration() {
  console.log('🧪 Testing HOOD integration...\n');

  // Test 1: Check HOOD ticker exists
  console.log('1. Checking HOOD ticker...');
  const hoodTicker = await prisma.ticker.findUnique({
    where: { symbol: 'HOOD' }
  });
  
  if (hoodTicker) {
    console.log(`✅ HOOD ticker found: ${hoodTicker.symbol} - ${hoodTicker.name}`);
  } else {
    console.log('❌ HOOD ticker not found');
    return;
  }

  // Test 2: Check HOOD events
  console.log('\n2. Checking HOOD events...');
  const hoodEvents = await prisma.event.findMany({
    where: { tickerId: hoodTicker.id },
    orderBy: { date: 'asc' }
  });
  
  console.log(`✅ Found ${hoodEvents.length} HOOD events:`);
  hoodEvents.forEach(event => {
    console.log(`   - ${event.title} (${event.date}) - ${event.eventType} - ${event.direct ? 'Direct' : 'Indirect'}`);
  });

  // Test 3: Test search functionality
  console.log('\n3. Testing search functionality...');
  
  const searchTests = [
    { query: 'hood', expected: 'HOOD' },
    { query: 'HOOD', expected: 'HOOD' },
    { query: 'robin', expected: 'HOOD' },
    { query: 'Robinhood', expected: 'HOOD' }
  ];

  for (const test of searchTests) {
    const results = await prisma.ticker.findMany({
      where: {
        OR: [
          { symbol: { contains: test.query } },
          { name: { contains: test.query } }
        ]
      }
    });
    
    const found = results.some(t => t.symbol === test.expected);
    console.log(`   ${found ? '✅' : '❌'} Search "${test.query}" ${found ? 'found' : 'did not find'} ${test.expected}`);
  }

  // Test 4: Verify event classification
  console.log('\n4. Verifying event classification...');
  
  const directEvents = hoodEvents.filter(e => e.direct);
  const indirectEvents = hoodEvents.filter(e => !e.direct);
  
  console.log(`✅ Direct events: ${directEvents.length}`);
  console.log(`✅ Indirect events: ${indirectEvents.length}`);
  
  // Check required fields
  const requiredFields = ['title', 'date', 'eventType', 'direct', 'isBinary', 'isRecurring', 'tags', 'source', 'createdAt'];
  const allEventsValid = hoodEvents.every(event => {
    return requiredFields.every(field => event[field as keyof typeof event] !== null && event[field as keyof typeof event] !== undefined);
  });
  
  console.log(`${allEventsValid ? '✅' : '❌'} All events have required fields: ${allEventsValid}`);

  // Test 5: Check event sources
  console.log('\n5. Checking event sources...');
  const sources = [...new Set(hoodEvents.map(e => e.source))];
  console.log(`✅ Event sources: ${sources.join(', ')}`);

  console.log('\n🎉 HOOD integration test completed!');
}

testHoodIntegration()
  .catch((e) => {
    console.error('❌ Test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
