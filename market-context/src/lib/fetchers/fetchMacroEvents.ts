import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MacroEvent {
  title: string;
  date: string;
  category: 'MACRO_FOMC' | 'MACRO_CPI' | 'MACRO_JOBS' | 'MACRO_GDP';
  importance: string;
  actual?: string;
  forecast?: string;
  previous?: string;
}

export async function fetchFOMCEvents(): Promise<void> {
  try {
    console.log('🏦 Fetching FOMC events...');
    
    // Mock FOMC data (in production, use TradingEconomics API)
    const fomcEvents: MacroEvent[] = [
      {
        title: 'FOMC Meeting',
        date: '2025-09-17',
        category: 'MACRO_FOMC',
        importance: 'High',
        actual: 'TBD',
        forecast: 'Rate Decision',
      },
      {
        title: 'FOMC Meeting',
        date: '2025-11-05',
        category: 'MACRO_FOMC',
        importance: 'High',
        actual: 'TBD',
        forecast: 'Rate Decision',
      },
      {
        title: 'FOMC Meeting',
        date: '2025-12-17',
        category: 'MACRO_FOMC',
        importance: 'High',
        actual: 'TBD',
        forecast: 'Rate Decision',
      },
    ];
    
    for (const event of fomcEvents) {
      const eventId = `fomc_${event.date}`;
      
      await prisma.event.upsert({
        where: { id: eventId },
        update: {
          title: event.title,
          start: event.date,
          category: event.category,
          source: 'TRADING_ECONOMICS',
          notes: `Importance: ${event.importance}, Forecast: ${event.forecast}`,
          updatedAt: new Date().toISOString(),
        },
        create: {
          id: eventId,
          tickerId: null, // Global event
          title: event.title,
          start: event.date,
          category: event.category,
          timezone: 'UTC',
          source: 'TRADING_ECONOMICS',
          notes: `Importance: ${event.importance}, Forecast: ${event.forecast}`,
        },
      });
    }
    
    console.log(`✅ Processed ${fomcEvents.length} FOMC events`);
  } catch (error) {
    console.error('❌ Error fetching FOMC events:', error);
  }
}

export async function fetchCPIEvents(): Promise<void> {
  try {
    console.log('📈 Fetching CPI events...');
    
    // Mock CPI data (in production, use TradingEconomics API)
    const cpiEvents: MacroEvent[] = [
      {
        title: 'CPI Release',
        date: '2025-10-15',
        category: 'MACRO_CPI',
        importance: 'High',
        actual: 'TBD',
        forecast: '2.8% YoY',
        previous: '2.9% YoY',
      },
      {
        title: 'CPI Release',
        date: '2025-11-13',
        category: 'MACRO_CPI',
        importance: 'High',
        actual: 'TBD',
        forecast: '2.7% YoY',
        previous: '2.8% YoY',
      },
      {
        title: 'CPI Release',
        date: '2025-12-12',
        category: 'MACRO_CPI',
        importance: 'High',
        actual: 'TBD',
        forecast: '2.6% YoY',
        previous: '2.7% YoY',
      },
    ];
    
    for (const event of cpiEvents) {
      const eventId = `cpi_${event.date}`;
      
      await prisma.event.upsert({
        where: { id: eventId },
        update: {
          title: event.title,
          start: event.date,
          category: event.category,
          source: 'TRADING_ECONOMICS',
          notes: `Forecast: ${event.forecast}, Previous: ${event.previous}`,
          updatedAt: new Date().toISOString(),
        },
        create: {
          id: eventId,
          tickerId: null, // Global event
          title: event.title,
          start: event.date,
          category: event.category,
          timezone: 'UTC',
          source: 'TRADING_ECONOMICS',
          notes: `Forecast: ${event.forecast}, Previous: ${event.previous}`,
        },
      });
    }
    
    console.log(`✅ Processed ${cpiEvents.length} CPI events`);
  } catch (error) {
    console.error('❌ Error fetching CPI events:', error);
  }
}

export async function fetchJobsEvents(): Promise<void> {
  try {
    console.log('💼 Fetching Jobs events...');
    
    // Mock Jobs data (in production, use TradingEconomics API)
    const jobsEvents: MacroEvent[] = [
      {
        title: 'Nonfarm Payrolls',
        date: '2025-10-03',
        category: 'MACRO_JOBS',
        importance: 'High',
        actual: 'TBD',
        forecast: '180K',
        previous: '175K',
      },
      {
        title: 'Nonfarm Payrolls',
        date: '2025-11-07',
        category: 'MACRO_JOBS',
        importance: 'High',
        actual: 'TBD',
        forecast: '185K',
        previous: '180K',
      },
      {
        title: 'Nonfarm Payrolls',
        date: '2025-12-05',
        category: 'MACRO_JOBS',
        importance: 'High',
        actual: 'TBD',
        forecast: '190K',
        previous: '185K',
      },
    ];
    
    for (const event of jobsEvents) {
      const eventId = `jobs_${event.date}`;
      
      await prisma.event.upsert({
        where: { id: eventId },
        update: {
          title: event.title,
          start: event.date,
          category: event.category,
          source: 'TRADING_ECONOMICS',
          notes: `Forecast: ${event.forecast}, Previous: ${event.previous}`,
          updatedAt: new Date().toISOString(),
        },
        create: {
          id: eventId,
          tickerId: null, // Global event
          title: event.title,
          start: event.date,
          category: event.category,
          timezone: 'UTC',
          source: 'TRADING_ECONOMICS',
          notes: `Forecast: ${event.forecast}, Previous: ${event.previous}`,
        },
      });
    }
    
    console.log(`✅ Processed ${jobsEvents.length} Jobs events`);
  } catch (error) {
    console.error('❌ Error fetching Jobs events:', error);
  }
}

export async function fetchGDPEvents(): Promise<void> {
  try {
    console.log('📊 Fetching GDP events...');
    
    // Mock GDP data (in production, use TradingEconomics API)
    const gdpEvents: MacroEvent[] = [
      {
        title: 'GDP Release',
        date: '2025-10-30',
        category: 'MACRO_GDP',
        importance: 'High',
        actual: 'TBD',
        forecast: '2.1% QoQ',
        previous: '2.0% QoQ',
      },
      {
        title: 'GDP Release',
        date: '2025-01-30',
        category: 'MACRO_GDP',
        importance: 'High',
        actual: 'TBD',
        forecast: '2.3% QoQ',
        previous: '2.1% QoQ',
      },
    ];
    
    for (const event of gdpEvents) {
      const eventId = `gdp_${event.date}`;
      
      await prisma.event.upsert({
        where: { id: eventId },
        update: {
          title: event.title,
          start: event.date,
          category: event.category,
          source: 'TRADING_ECONOMICS',
          notes: `Forecast: ${event.forecast}, Previous: ${event.previous}`,
          updatedAt: new Date().toISOString(),
        },
        create: {
          id: eventId,
          tickerId: null, // Global event
          title: event.title,
          start: event.date,
          category: event.category,
          timezone: 'UTC',
          source: 'TRADING_ECONOMICS',
          notes: `Forecast: ${event.forecast}, Previous: ${event.previous}`,
        },
      });
    }
    
    console.log(`✅ Processed ${gdpEvents.length} GDP events`);
  } catch (error) {
    console.error('❌ Error fetching GDP events:', error);
  }
}

export async function fetchAllMacroEvents(): Promise<void> {
  await fetchFOMCEvents();
  await fetchCPIEvents();
  await fetchJobsEvents();
  await fetchGDPEvents();
}

// Run if called directly
if (require.main === module) {
  fetchAllMacroEvents()
    .then(() => {
      console.log('🎉 Macro events fetch completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Macro events fetch failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
