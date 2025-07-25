import {db} from '../db';
import {setupDatabase} from '../db/setup-db';

async function initialize() {
  console.log('Starting manual database initialization...');
  try {
    await setupDatabase();
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
