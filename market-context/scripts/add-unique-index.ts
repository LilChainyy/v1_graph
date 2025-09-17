import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addUniqueIndex() {
  console.log('Adding unique index for deduplication...');
  
  try {
    // Add the unique index
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX events_tickerId_start_category_normalizedTitle_key 
      ON events(tickerId, start, category, normalizedTitle);
    `;
    
    console.log('Unique index added successfully');
  } catch (error: any) {
    if (error.message.includes('already exists')) {
      console.log('Unique index already exists');
    } else {
      console.error('Error adding unique index:', error);
    }
  }
  
  await prisma.$disconnect();
}

addUniqueIndex().catch(console.error);
