import * as fs from 'fs';
import * as path from 'path';

import {db} from '.';

/**
 * Creates the database schema by reading and executing the schema.sql file.
 */
export async function setupDatabase() {
  console.log('Setting up database schema from schema.sql file...');

  const schemaFilePath = path.resolve(process.cwd(), 'src', 'db', 'schema.sql');

  if (!fs.existsSync(schemaFilePath)) {
    console.error('FATAL: schema.sql file not found at', schemaFilePath);
    throw new Error('Schema file is missing.');
  }

  const schemaSql = fs.readFileSync(schemaFilePath, 'utf-8');

  await db.exec(schemaSql);

  console.log('Schema setup complete.');
}
