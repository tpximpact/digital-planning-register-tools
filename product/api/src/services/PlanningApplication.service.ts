import {PlanningApplicationNotFoundError} from '../errors';
import {
  FullPlanningApplication,
  PlanningApplications,
  NewApplicationData,
} from '../models';
import {ApplicationStatuses} from '../models/applicationStatuses.model';
import {AssessmentDecisions} from '../models/assessmentDecision.model';
import {ProcessStages} from '../models/processStages.model';

export type RawApplicationData = {
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
  processStage: string;
  applicationStatus: string;
  assessmentDecision?: 'granted' | 'refused';
};

class PlanningApplicationService {
  async getAllPlanningApplications(): Promise<FullPlanningApplication[]> {
    const filter = {};
    return await PlanningApplications.find(filter).exec();
  }

  async getPlanningApplicationById(
    id: number,
  ): Promise<FullPlanningApplication> {
    const foundApplication = await PlanningApplications.findById(id);
    if (!foundApplication) {
      throw new PlanningApplicationNotFoundError(
        `Planning application not found with id: ${id}`,
      );
    }
    return foundApplication;
  }

  /**
   * Adds a new planning application.
   * This method translates text-based codes/names into foreign key IDs
   * before inserting the data into the database.
   * @param rawData - The raw application data from the controller.
   */
  async add(rawData: RawApplicationData) {
    const processStage = await ProcessStages.findByStage(rawData.processStage);
    if (!processStage) {
      throw new Error(`Invalid process stage: ${rawData.processStage}`);
    }

    const applicationStatus = await ApplicationStatuses.findByStatus(
      rawData.applicationStatus,
    );
    if (!applicationStatus) {
      throw new Error(
        `Invalid application status: ${rawData.applicationStatus}`,
      );
    }

    let assessmentDecisionId: number | undefined = undefined;
    if (rawData.assessmentDecision) {
      const assessmentDecision = await AssessmentDecisions.findByDecision(
        rawData.assessmentDecision,
      );
      if (!assessmentDecision) {
        throw new Error(
          `Invalid assessment decision: ${rawData.assessmentDecision}`,
        );
      }
      assessmentDecisionId = assessmentDecision.id;
    }

    const applicationDataForDb: NewApplicationData = {
      ...rawData,
      process_stage_id: processStage.id,
      application_status_id: applicationStatus.id,
      assessment_decision_id: assessmentDecisionId,
    };

    const newApplication = await PlanningApplications.add(applicationDataForDb);

    return await this.getPlanningApplicationById(newApplication.id);
  }
}

export default new PlanningApplicationService();
