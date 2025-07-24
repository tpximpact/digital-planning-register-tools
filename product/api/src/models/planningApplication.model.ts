import {PGlite} from '@electric-sql/pglite';
export interface PlanningApplication {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}
const db = new PGlite('memory://');

export async function setupDatabase() {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS planning_applications (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      "createdAt" TIMESTAMP,
      "updatedAt" TIMESTAMP
    );
  `);
  // Uncomment the following lines to seed the database with initial data
  const {rows} = await db.query<PlanningApplication>(
    `SELECT * FROM planning_applications LIMIT 1;`,
  );

  if (rows.length === 0) {
    console.log('Database is empty. Seeding with initial data...');
    await db.exec(`
      INSERT INTO planning_applications (name, "createdAt", "updatedAt") VALUES ('Application 1', '2025-07-23T14:54:49.000Z', '2025-07-23T14:54:49.000Z');
      INSERT INTO planning_applications (name, "createdAt", "updatedAt") VALUES ('Application 2', '2025-07-23T14:54:49.000Z', '2025-07-23T14:54:49.000Z');
      INSERT INTO planning_applications (name, "createdAt", "updatedAt") VALUES ('Application 3', '2025-07-23T14:54:49.000Z', '2025-07-23T14:54:49.000Z');
    `);
  } else {
    console.log('Database already contains data. Skipping seed.');
  }

  console.log('Database setup complete.');
}
export const PlanningApplications = {
  find: (_filter: Partial<PlanningApplication>) => ({
    exec: async (): Promise<PlanningApplication[]> => {
      const {rows} = await db.query<PlanningApplication>(
        'SELECT * FROM planning_applications ORDER BY id;',
      );
      return rows;
    },
  }),

  findById: async (id: number): Promise<PlanningApplication | undefined> => {
    const {rows} = await db.query<PlanningApplication>(
      'SELECT * FROM planning_applications WHERE id = $1;',
      [id],
    );
    return rows[0];
  },

  /**
   * Adds a new application to the database.
   */
  add: async (appData: {name: string}): Promise<PlanningApplication> => {
    const {rows} = await db.query<PlanningApplication>(
      'INSERT INTO planning_applications (name, "createdAt", "updatedAt") VALUES ($1, $2, $3) RETURNING *;',
      [appData.name, new Date(), new Date()],
    );
    return rows[0];
  },
};
