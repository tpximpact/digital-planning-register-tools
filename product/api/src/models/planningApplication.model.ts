import {db} from '../db';

export interface PlanningApplication {
  id: number;
  reference: string;
  address: string;
  postcode: string;
  description: string;
  created_at: Date;
  updated_at: Date;
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
  add: async (appData: {
    reference: string;
    address: string;
    postcode: string;
    description: string;
  }): Promise<PlanningApplication> => {
    const {rows} = await db.query<PlanningApplication>(
      `INSERT INTO planning_applications (reference, address, postcode, description, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *;`,
      [
        appData.reference,
        appData.address,
        appData.postcode,
        appData.description,
        new Date(),
        new Date(),
      ],
    );
    return rows[0];
  },
};
