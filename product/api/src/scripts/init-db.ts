import {db} from '../db';
import {seedDatabase} from '../db/seed';
import {setupDatabase} from '../db/setup-db';

async function initialize() {
  console.log('Starting manual database initialization...');
  try {
    await setupDatabase();
    await seedDatabase(db);
    console.log('Database initialization completed successfully.');
  } catch (error) {
    console.error('An error occurred during database initialization:', error);
    process.exit(1);
  } finally {
    console.log('Closing database connection.');
    await db.close();
  }
}

initialize();
