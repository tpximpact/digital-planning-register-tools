import {db} from '../db';

export interface ApplicationStatus {
  id: number;
  status: string;
}

export const ApplicationStatuses = {
  /**
   * Finds an application status by its unique name.
   * @param status - The string name, e.g., 'determined'
   */
  findByStatus: async (
    status: string,
  ): Promise<ApplicationStatus | undefined> => {
    const {rows} = await db.query<ApplicationStatus>(
      'SELECT * FROM application_statuses WHERE status = $1;',
      [status],
    );
    return rows[0];
  },

  /**
   * Finds all application statuses.
   */
  findAll: async (): Promise<ApplicationStatus[]> => {
    const {rows} = await db.query<ApplicationStatus>(
      'SELECT * FROM application_statuses ORDER BY id;',
    );
    return rows;
  },
};
