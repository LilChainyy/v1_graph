import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addNormalizedTitle() {
  console.log('Adding normalizedTitle to existing events...');
  
  // First, add the column with a default value
  await prisma.$executeRaw`
    ALTER TABLE events ADD COLUMN normalizedTitle TEXT DEFAULT '';
  `;
  
  console.log('Column added. Now updating existing records...');
  
  // Get all events and update them with normalized titles
  const events = await prisma.event.findMany();
  
  for (const event of events) {
    const normalizedTitle = normalizeTitle(event.title, event.category);
    
    await prisma.event.update({
      where: { id: event.id },
      data: { normalizedTitle }
    });
  }
  
  console.log(`Updated ${events.length} events with normalized titles`);
  
  // Now make the column NOT NULL
  await prisma.$executeRaw`
    ALTER TABLE events ALTER COLUMN normalizedTitle SET NOT NULL;
  `;
  
  console.log('Made normalizedTitle NOT NULL');
  
  // Add the unique index
  await prisma.$executeRaw`
    CREATE UNIQUE INDEX events_tickerId_start_category_normalizedTitle_key 
    ON events(tickerId, start, category, normalizedTitle);
  `;
  
  console.log('Added unique index');
  
  await prisma.$disconnect();
}

function normalizeTitle(title: string, category: string): string {
  if (!title || typeof title !== 'string') {
    return '';
  }

  let normalized = title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[()[\]{}]/g, '')
    .replace(/[.,;:!?]/g, '')
    .replace(/^(earnings|q[1-4]|quarterly|annual)\s+/i, '')
    .replace(/\s+(call|conference|webcast|release)$/i, '')
    .replace(/^(fomc|federal\s+reserve)\s+/i, '')
    .replace(/^(cpi|consumer\s+price\s+index)\s+/i, '')
    .replace(/^(jobs|employment|nonfarm\s+payrolls)\s+/i, '')
    .replace(/^(gdp|gross\s+domestic\s+product)\s+/i, '')
    .replace(/^(sec|filing|10-k|10-q|8-k)\s+/i, '')
    .replace(/^(regulatory|compliance|deadline)\s+/i, '')
    .replace(/\s+(20\d{2}|q[1-4]\s+20\d{2})/g, '')
    .replace(/\s+(am|pm|et|pt|utc|est|pst)/g, '')
    .replace(/\s+\d{1,2}:\d{2}/g, '')
    .trim();

  return normalized;
}

addNormalizedTitle().catch(console.error);
