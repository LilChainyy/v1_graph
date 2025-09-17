import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateNormalizedTitles() {
  console.log('Updating normalizedTitle for existing events...');
  
  // Get all events and update them with normalized titles
  const events = await prisma.event.findMany();
  
  console.log(`Found ${events.length} events to update`);
  
  for (const event of events) {
    const normalizedTitle = normalizeTitle(event.title, event.category);
    
    await prisma.event.update({
      where: { id: event.id },
      data: { normalizedTitle }
    });
    
    console.log(`Updated: ${event.title} -> ${normalizedTitle}`);
  }
  
  console.log(`Updated ${events.length} events with normalized titles`);
  
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

updateNormalizedTitles().catch(console.error);
