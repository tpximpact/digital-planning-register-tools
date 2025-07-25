import * as fs from 'fs';
import * as path from 'path';

import {PGlite} from '@electric-sql/pglite';

/**
 * Seeds the database by reading all .json files from the data directory.
 * @param db - The PGlite database instance to seed.
 */
export async function seedDatabase(db: PGlite) {
  const {rows} = await db.query(`SELECT * FROM planning_applications LIMIT 1;`);
  if (rows.length > 0) {
    console.log('Database already contains data. Skipping seed process.');
    return;
  }

  console.log(
    'Database is empty. Seeding with initial data from all JSON files...',
  );

  const dataDir = path.resolve(process.cwd(), 'src', 'db', 'data');

  if (!fs.existsSync(dataDir)) {
    console.error('FATAL: Data directory not found at', dataDir);
    return;
  }

  const filesToSeed = fs
    .readdirSync(dataDir)
    .filter(file => file.endsWith('.json'));

  for (const file of filesToSeed) {
    console.log(`- Processing seed file: ${file}`);
    const filePath = path.join(dataDir, file);
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);

    let insertSql = '';
    let tableName = '';

    // This allows multiple files to target the same table.
    if (file.startsWith('planningApplications')) {
      tableName = 'planning_applications';
      for (const app of data) {
        const createdAt = app.created_at || new Date().toISOString();
        const updatedAt = app.updated_at || new Date().toISOString();
        const safeAddress = app.address.replace(/'/g, "''");
        const safeDescription = app.description.replace(/'/g, "''");

        insertSql += `
          INSERT INTO planning_applications (reference, address, postcode, description, created_at, updated_at)
          VALUES ('${app.reference}', '${safeAddress}', '${app.postcode}', '${safeDescription}', '${createdAt}', '${updatedAt}');
        `;
      }
    } else {
      console.warn(
        `  - WARNING: No seeding logic defined for this file pattern: ${file}. Skipping.`,
      );
      continue;
    }

    if (insertSql) {
      await db.exec(insertSql);
      console.log(
        `  - Seeded ${data.length} records into '${tableName}' from ${file}.`,
      );
    }
  }
}
