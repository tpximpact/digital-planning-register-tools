import {db} from '../db';

export interface PlanningApplication {
  id: number;
  reference: string;
  address: string;
  postcode: string;
  description: string;
  consultation_start_date?: Date;
  consultation_end_date?: Date;
  latitude: number;
  longitude: number;
  radius?: number;
  created_at: Date;
  updated_at: Date;
}

export type NewApplicationData = Omit<
  PlanningApplication,
  'id' | 'created_at' | 'updated_at'
>;

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
  add: async (appData: NewApplicationData): Promise<PlanningApplication> => {
    const radius = appData.radius === undefined ? null : appData.radius;
    const consultation_start_date =
      appData.consultation_start_date === undefined
        ? null
        : appData.consultation_start_date;
    const consultation_end_date =
      appData.consultation_end_date === undefined
        ? null
        : appData.consultation_end_date;

    const {rows} = await db.query<PlanningApplication>(
      `INSERT INTO planning_applications (reference, address, postcode, description, consultation_start_date, consultation_end_date, latitude, longitude, radius, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *;`,
      [
        appData.reference,
        appData.address,
        appData.postcode,
        appData.description,
        consultation_start_date,
        consultation_end_date,
        appData.latitude,
        appData.longitude,
        radius,
        new Date(),
        new Date(),
      ],
    );
    return rows[0];
  },
};
