import {db} from '../db';

export interface PlanningApplication {
  id: number;
  reference: string;
  address: string;
  postcode: string;
  description: string;
  latitude: number;
  longitude: number;
  radius?: number;
  consultation_start_date?: Date;
  consultation_end_date?: Date;
  application_decision_date?: Date;
  assessment_decision_date?: Date;
  appeal_decision_date?: Date;
  created_at: Date;
  updated_at: Date;

  // Foreign Keys
  assessment_decision_id?: number;
  process_stage_id: number;
  application_status_id: number;
}

// This new type represents the complete, joined data we want to return from our API.
// It uses Omit to remove the foreign key IDs from the final output.
export type FullPlanningApplication = Omit<
  PlanningApplication,
  'assessment_decision_id' | 'process_stage_id' | 'application_status_id'
> & {
  process_stage: string;
  application_status: string;
  assessment_decision: 'granted' | 'refused' | null;
};

export type NewApplicationData = Omit<
  PlanningApplication,
  'id' | 'created_at' | 'updated_at'
>;

export const PlanningApplications = {
  find: (_filter: Partial<PlanningApplication>) => ({
    exec: async (): Promise<FullPlanningApplication[]> => {
      const {rows} = await db.query<FullPlanningApplication>(
        `SELECT
           pa.id,
           pa.reference,
           pa.address,
           pa.postcode,
           pa.description,
           pa.latitude,
           pa.longitude,
           pa.radius,
           pa.consultation_start_date,
           pa.consultation_end_date,
           pa.application_decision_date,
           pa.assessment_decision_date,
           pa.appeal_decision_date,
           pa.created_at,
           pa.updated_at,
           ps.stage as process_stage,
           aps.status as application_status,
           ad.decision as assessment_decision
         FROM planning_applications pa
         JOIN process_stages ps ON pa.process_stage_id = ps.id
         JOIN application_statuses aps ON pa.application_status_id = aps.id
         LEFT JOIN assessment_decisions ad ON pa.assessment_decision_id = ad.id
         ORDER BY pa.id;`,
      );
      return rows;
    },
  }),

  findById: async (
    id: number,
  ): Promise<FullPlanningApplication | undefined> => {
    const {rows} = await db.query<FullPlanningApplication>(
      `SELECT
         pa.id,
         pa.reference,
         pa.address,
         pa.postcode,
         pa.description,
         pa.latitude,
         pa.longitude,
         pa.radius,
         pa.consultation_start_date,
         pa.consultation_end_date,
         pa.application_decision_date,
         pa.assessment_decision_date,
         pa.appeal_decision_date,
         pa.created_at,
         pa.updated_at,
         ps.stage as process_stage,
         aps.status as application_status,
         ad.decision as assessment_decision
       FROM planning_applications pa
       JOIN process_stages ps ON pa.process_stage_id = ps.id
       JOIN application_statuses aps ON pa.application_status_id = aps.id
       LEFT JOIN assessment_decisions ad ON pa.assessment_decision_id = ad.id
       WHERE pa.id = $1;`,
      [id],
    );
    return rows[0];
  },

  add: async (appData: NewApplicationData): Promise<PlanningApplication> => {
    const {rows} = await db.query<PlanningApplication>(
      `INSERT INTO planning_applications (
         reference, address, postcode, description, latitude, longitude, radius,
         consultation_start_date, consultation_end_date, application_decision_date,
         assessment_decision_date, appeal_decision_date, created_at, updated_at,
         assessment_decision_id, process_stage_id, application_status_id
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
       RETURNING *;`,
      [
        appData.reference,
        appData.address,
        appData.postcode,
        appData.description,
        appData.latitude,
        appData.longitude,
        appData.radius,
        appData.consultation_start_date,
        appData.consultation_end_date,
        appData.application_decision_date,
        appData.assessment_decision_date,
        appData.appeal_decision_date,
        new Date(),
        new Date(),
        appData.assessment_decision_id,
        appData.process_stage_id,
        appData.application_status_id,
      ],
    );
    return rows[0];
  },
};
