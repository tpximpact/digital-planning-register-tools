import {db} from '../db';
import {seedDatabase} from '../db/seed';

async function run() {
  console.log('Manually running database seeding...');
  try {
    await seedDatabase(db);
    console.log('Manual seeding completed successfully.');
  } catch (error) {
    console.error('An error occurred during the manual seed process:', error);
    process.exit(1);
  } finally {
    console.log('Closing database connection.');
    await db.close();
  }
}

run();
