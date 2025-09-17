import { PrismaClient } from '@prisma/client';
import { deduplicateEvents } from '../src/lib/eventDeduplication';

const prisma = new PrismaClient();

async function cleanupDuplicates() {
  console.log('Cleaning up duplicate events...');
  
  // Get all events
  const allEvents = await prisma.event.findMany({
    orderBy: { updatedAt: 'desc' }
  });
  
  console.log(`Found ${allEvents.length} total events`);
  
  // Group events by unique key and find duplicates
  const grouped = new Map<string, typeof allEvents>();
  
  allEvents.forEach(event => {
    const key = `${event.tickerId || 'GLOBAL'}|${event.start}|${event.category}|${event.normalizedTitle}`;
    
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key)!.push(event);
  });
  
  // Find groups with duplicates
  const duplicateGroups = Array.from(grouped.entries()).filter(([_, events]) => events.length > 1);
  
  console.log(`Found ${duplicateGroups.length} groups with duplicates`);
  
  let totalDeleted = 0;
  
  for (const [key, events] of duplicateGroups) {
    console.log(`\nProcessing group: ${key}`);
    console.log(`  Found ${events.length} duplicates`);
    
    // Keep the most recent event (first in the array since we sorted by updatedAt desc)
    const keepEvent = events[0];
    const deleteEvents = events.slice(1);
    
    console.log(`  Keeping: ${keepEvent.title} (${keepEvent.updatedAt})`);
    
    for (const deleteEvent of deleteEvents) {
      console.log(`  Deleting: ${deleteEvent.title} (${deleteEvent.updatedAt})`);
      
      await prisma.event.delete({
        where: { id: deleteEvent.id }
      });
      
      totalDeleted++;
    }
  }
  
  console.log(`\nCleanup complete! Deleted ${totalDeleted} duplicate events`);
  
  // Verify no duplicates remain
  const remainingEvents = await prisma.event.findMany();
  const deduplicated = deduplicateEvents(remainingEvents);
  
  if (remainingEvents.length === deduplicated.length) {
    console.log('✅ No duplicates remain in the database');
  } else {
    console.log(`❌ Warning: ${remainingEvents.length - deduplicated.length} duplicates still exist`);
  }
  
  await prisma.$disconnect();
}

cleanupDuplicates().catch(console.error);
