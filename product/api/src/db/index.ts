import {PGlite} from '@electric-sql/pglite';

import {seedDatabase} from './seed';

export const initDb = async () => {
  await setupDatabase();
};

export const db = new PGlite('memory://');

export async function setupDatabase() {
  console.log('Setting up database schema...');

  await db.exec(`
    CREATE TABLE IF NOT EXISTS planning_applications (
      id SERIAL PRIMARY KEY,
      reference VARCHAR(50) UNIQUE NOT NULL,
      address TEXT,
      postcode TEXT,
      description TEXT,
      created_at TIMESTAMP,
      updated_at TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_postcode ON planning_applications (postcode);
    CREATE INDEX IF NOT EXISTS idx_address_gin ON planning_applications USING GIN (to_tsvector('english', address));
  `);

  await seedDatabase(db);

  console.log('Database setup complete.');
}
