// Backfill script to generate tags for existing events
// Run with: node scripts/backfill-tags.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Tag mapping based on event categories and patterns
function generateTags(event) {
  const tags = [];
  
  // Primary category tags
  switch (event.category) {
    case 'MACRO_FOMC':
      tags.push('MACRO_FOMC', 'HIGH_IMPACT', 'BINARY', 'RECURRING');
      break;
    case 'MACRO_CPI':
      tags.push('MACRO_CPI', 'HIGH_IMPACT', 'RECURRING');
      break;
    case 'MACRO_JOBS':
      tags.push('MACRO_JOBS', 'HIGH_IMPACT', 'RECURRING');
      break;
    case 'MACRO_GDP':
      tags.push('MACRO_GDP', 'MEDIUM_IMPACT', 'RECURRING');
      break;
    case 'EARNINGS':
      tags.push('EARNINGS', 'HIGH_IMPACT', 'BINARY', 'RECURRING');
      // Add quarter if detectable from title
      if (event.title.includes('Q1')) tags.push('EARNINGS_Q1');
      else if (event.title.includes('Q2')) tags.push('EARNINGS_Q2');
      else if (event.title.includes('Q3')) tags.push('EARNINGS_Q3');
      else if (event.title.includes('Q4')) tags.push('EARNINGS_Q4');
      break;
    case 'SEC_FILINGS':
      tags.push('SEC_FILINGS', 'MEDIUM_IMPACT', 'RECURRING');
      // Add specific filing type
      if (event.title.includes('10-K')) tags.push('SEC_10K');
      else if (event.title.includes('10-Q')) tags.push('SEC_10Q');
      else if (event.title.includes('8-K')) tags.push('SEC_8K');
      break;
    case 'REGULATORY':
      tags.push('REGULATORY', 'MEDIUM_IMPACT');
      if (event.title.includes('FINRA')) tags.push('REGULATORY_FINRA');
      else if (event.title.includes('SEC')) tags.push('REGULATORY_SEC');
      break;
  }
  
  // Company-specific tags
  if (event.ticker) {
    const tickerSymbol = event.ticker.symbol;
    tags.push(tickerSymbol);
    
    // Sector tags based on company
    switch (tickerSymbol) {
      case 'NVDA':
        tags.push('TECH', 'AI', 'SEMIS');
        break;
      case 'AAPL':
        tags.push('TECH', 'CONSUMER');
        break;
      case 'TSLA':
        tags.push('TECH', 'AUTOMOTIVE', 'ENERGY');
        break;
      case 'HOOD':
        tags.push('FINANCE', 'TECH', 'BROKERAGE');
        break;
      case 'META':
        tags.push('TECH', 'SOCIAL_MEDIA');
        break;
      case 'AMZN':
        tags.push('TECH', 'RETAIL', 'CLOUD');
        break;
    }
  } else {
    // Global events
    tags.push('GLOBAL', 'BROAD_MARKET');
  }
  
  // Time-based tags (if detectable from title)
  if (event.title.toLowerCase().includes('earnings call')) {
    tags.push('AFTER_MARKET');
  } else if (event.title.toLowerCase().includes('auction')) {
    tags.push('DURING_MARKET');
  }
  
  // Impact level refinement
  if (event.title.toLowerCase().includes('fomc') || 
      event.title.toLowerCase().includes('earnings') ||
      event.title.toLowerCase().includes('cpi')) {
    // Already set above
  } else if (event.title.toLowerCase().includes('filing') || 
             event.title.toLowerCase().includes('deadline')) {
    // Already set above
  }
  
  return [...new Set(tags)]; // Remove duplicates
}

async function exportEventsToCSV() {
  try {
    console.log('🔄 Fetching events from database...');
    
    // Fetch all events with their ticker information
    const events = await prisma.event.findMany({
      include: {
        ticker: true
      },
      orderBy: {
        start: 'asc'
      }
    });
    
    console.log(`📊 Found ${events.length} events`);
    
    // Generate CSV data
    const csvData = events.map(event => {
      const tags = generateTags(event);
      return {
        event_id: event.id,
        ticker_id: event.ticker?.symbol || null,
        tags: tags.join(',')
      };
    });
    
    // Create CSV content
    const csvHeader = 'event_id,ticker_id,tags\n';
    const csvRows = csvData.map(row => 
      `${row.event_id},${row.ticker_id || ''},${row.tags}`
    ).join('\n');
    
    const csvContent = csvHeader + csvRows;
    
    // Write to file
    const outputPath = path.join(__dirname, '..', 'events-tags-backfill.csv');
    fs.writeFileSync(outputPath, csvContent);
    
    console.log(`✅ CSV exported to: ${outputPath}`);
    console.log(`📝 Sample entries:`);
    
    // Show sample entries
    csvData.slice(0, 5).forEach((row, index) => {
      console.log(`  ${index + 1}. ${row.event_id} | ${row.ticker_id || 'GLOBAL'} | ${row.tags}`);
    });
    
    // Show tag statistics
    const allTags = csvData.flatMap(row => row.tags.split(','));
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n📈 Tag statistics:');
    Object.entries(tagCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([tag, count]) => {
        console.log(`  ${tag}: ${count} events`);
      });
    
    return outputPath;
    
  } catch (error) {
    console.error('❌ Error exporting events:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the export
if (require.main === module) {
  exportEventsToCSV()
    .then(outputPath => {
      console.log(`\n🎉 Export complete! Import this CSV into Supabase:`);
      console.log(`   1. Go to Supabase Dashboard → Table Editor`);
      console.log(`   2. Select the 'event_tags' table`);
      console.log(`   3. Click 'Import data from CSV'`);
      console.log(`   4. Upload: ${outputPath}`);
    })
    .catch(error => {
      console.error('💥 Export failed:', error);
      process.exit(1);
    });
}

module.exports = { exportEventsToCSV, generateTags };
