import {db} from '../db';

export interface AssessmentDecision {
  id: number;
  decision: 'granted' | 'refused';
}

export const AssessmentDecisions = {
  /**
   * Finds an assessment decision by its unique name.
   * @param decision - The string name, 'granted' or 'refused'
   */
  findByDecision: async (
    decision: 'granted' | 'refused',
  ): Promise<AssessmentDecision | undefined> => {
    const {rows} = await db.query<AssessmentDecision>(
      'SELECT * FROM assessment_decisions WHERE decision = $1;',
      [decision],
    );
    return rows[0];
  },

  /**
   * Finds all assessment decisions.
   */
  findAll: async (): Promise<AssessmentDecision[]> => {
    const {rows} = await db.query<AssessmentDecision>(
      'SELECT * FROM assessment_decisions ORDER BY id;',
    );
    return rows;
  },
};
