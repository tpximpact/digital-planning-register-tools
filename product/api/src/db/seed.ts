// product/api/src/db/seed.ts

import * as fs from 'fs';
import * as path from 'path';

import {PGlite} from '@electric-sql/pglite';

/**
 * Seeds the database with initial data from a JSON file.
 * This function checks if the table is empty before inserting data.
 * @param db - The PGlite database instance to seed.
 */
export async function seedDatabase(db: PGlite) {
  const {rows} = await db.query(`SELECT * FROM planning_applications LIMIT 1;`);

  if (rows.length > 0) {
    console.log('Database already contains data. Skipping seed.');
    return;
  }

  console.log('Database is empty. Seeding with initial data from JSON...');

  const dataFilePath = path.resolve(
    process.cwd(),
    'src',
    'db',
    'data',
    'planningApplications.json',
  );

  if (!fs.existsSync(dataFilePath)) {
    console.error('FATAL: Seed data file not found at', dataFilePath);
    return;
  }

  const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
  const applications = JSON.parse(jsonData);

  let insertSql = '';
  for (const app of applications) {
    const createdAt = app.created_at || new Date().toISOString();
    const updatedAt = app.updated_at || new Date().toISOString();
    const safeAddress = app.address.replace(/'/g, "''");
    const safeDescription = app.description.replace(/'/g, "''");

    insertSql += `
      INSERT INTO planning_applications (reference, address, postcode, description, created_at, updated_at)
      VALUES ('${app.reference}', '${safeAddress}', '${app.postcode}', '${safeDescription}', '${createdAt}', '${updatedAt}');
    `;
  }

  if (insertSql) {
    await db.exec(insertSql);
    console.log(`Seeded ${applications.length} applications.`);
  }
}
