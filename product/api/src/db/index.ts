import {PGlite} from '@electric-sql/pglite';

import {seedDatabase} from './seed';
import {setupDatabase} from './setup-db';

export const initDb = async () => {
  await setupDatabase();
  await seedDatabase(db);
};

export const db = new PGlite('memory://');
