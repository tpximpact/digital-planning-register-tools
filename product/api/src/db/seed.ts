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

  const lookups = {
    stages: new Map<string, number>(),
    statuses: new Map<string, number>(),
    decisions: new Map<string, number>(),
  };

  const stagesData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'processStages.json'), 'utf-8'),
  );
  for (const item of stagesData) {
    lookups.stages.set(item.stage, item.id);
  }

  const statusesData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'applicationStatuses.json'), 'utf-8'),
  );
  for (const item of statusesData) {
    lookups.statuses.set(item.status, item.id);
  }

  const decisionsData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'assessmentDecisions.json'), 'utf-8'),
  );
  for (const item of decisionsData) {
    lookups.decisions.set(item.decision, item.id);
  }

  const allFiles = fs
    .readdirSync(dataDir)
    .filter(file => file.endsWith('.json'));
  const lookupFiles = allFiles.filter(
    file => !file.startsWith('planningApplications'),
  );
  const applicationFiles = allFiles.filter(file =>
    file.startsWith('planningApplications'),
  );

  for (const file of lookupFiles) {
    console.log(`- Processing lookup seed file: ${file}`);
    const filePath = path.join(dataDir, file);
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);
    let insertSql = '';

    if (file === 'processStages.json') {
      for (const item of data) {
        insertSql += `INSERT INTO process_stages (id, stage) VALUES (${item.id}, '${item.stage}');\n`;
      }
    } else if (file === 'applicationStatuses.json') {
      for (const item of data) {
        insertSql += `INSERT INTO application_statuses (id, status) VALUES (${item.id}, '${item.status}');\n`;
      }
    } else if (file === 'assessmentDecisions.json') {
      for (const item of data) {
        insertSql += `INSERT INTO assessment_decisions (id, decision) VALUES (${item.id}, '${item.decision}');\n`;
      }
    } else {
      console.warn(
        `  - WARNING: No seeding logic defined for lookup file ${file}. Skipping.`,
      );
      continue;
    }

    if (insertSql) {
      await db.exec(insertSql);
      console.log(`  - Seeded ${data.length} lookup records from ${file}.`);
    }
  }

  for (const file of applicationFiles) {
    console.log(`- Processing main seed file: ${file}`);
    const filePath = path.join(dataDir, file);
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(jsonData);
    let insertSql = '';

    for (const app of data) {
      const processStageId = lookups.stages.get(app.processStage);
      const applicationStatusId = lookups.statuses.get(app.applicationStatus);
      const assessmentDecisionId = app.assessmentDecision
        ? lookups.decisions.get(app.assessmentDecision)
        : null;

      if (!processStageId || !applicationStatusId) {
        console.error(
          `Could not find ID for stage "${app.processStage}" or status "${app.applicationStatus}" in record ${app.reference}. Skipping.`,
        );
        continue;
      }

      const createdAt = app.created_at || new Date().toISOString();
      const updatedAt = app.updated_at || new Date().toISOString();
      const safeAddress = app.address.replace(/'/g, "''");
      const safeDescription = app.description.replace(/'/g, "''");

      insertSql += `
        INSERT INTO planning_applications (
          reference, address, postcode, description, latitude, longitude, radius,
          consultation_start_date, consultation_end_date, assessment_decision_date,
          created_at, updated_at,
          process_stage_id, application_status_id, assessment_decision_id
        ) VALUES (
          '${app.reference}', '${safeAddress}', '${app.postcode}', '${safeDescription}', ${app.latitude}, ${app.longitude}, ${app.radius ?? 'NULL'},
          ${app.consultation_start_date ? `'${app.consultation_start_date}'` : 'NULL'},
          ${app.consultation_end_date ? `'${app.consultation_end_date}'` : 'NULL'},
          ${app.assessment_decision_date ? `'${app.assessment_decision_date}'` : 'NULL'},
          '${createdAt}', '${updatedAt}',
          ${processStageId}, ${applicationStatusId}, ${assessmentDecisionId ?? 'NULL'}
        );
      `;
    }

    if (insertSql) {
      await db.exec(insertSql);
      console.log(
        `  - Seeded ${data.length} application records from ${file}.`,
      );
    }
  }
}
