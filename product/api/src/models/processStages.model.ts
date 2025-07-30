import {db} from '../db';

export interface ProcessStage {
  id: number;
  stage: string;
}

export const ProcessStages = {
  /**
   * Finds a process stage by its unique name.
   * @param stage - The string name, e.g., 'submission'
   */
  findByStage: async (stage: string): Promise<ProcessStage | undefined> => {
    const {rows} = await db.query<ProcessStage>(
      'SELECT * FROM process_stages WHERE stage = $1;',
      [stage],
    );
    return rows[0];
  },

  /**
   * Finds all process stages.
   */
  findAll: async (): Promise<ProcessStage[]> => {
    const {rows} = await db.query<ProcessStage>(
      'SELECT * FROM process_stages ORDER BY id;',
    );
    return rows;
  },
};
