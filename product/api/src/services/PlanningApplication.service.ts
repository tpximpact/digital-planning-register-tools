import {PlanningApplicationNotFoundError} from '../errors';
import {
  PlanningApplications,
  PlanningApplication,
  NewApplicationData,
} from '../models';

class PlanningApplicationService {
  constructor() {
    this.getAllPlanningApplications =
      this.getAllPlanningApplications.bind(this);
    this.getPlanningApplicationById =
      this.getPlanningApplicationById.bind(this);
    this.add = this.add.bind(this);
  }

  async getAllPlanningApplications(): Promise<PlanningApplication[]> {
    const filter = {};
    return await PlanningApplications.find(filter).exec();
  }

  async getPlanningApplicationById(id: number): Promise<PlanningApplication> {
    const foundApplication = await PlanningApplications.findById(id);

    if (!foundApplication) {
      throw new PlanningApplicationNotFoundError(
        `Planning application not found with id: ${id}`,
      );
    }

    return foundApplication;
  }

  async add(application: NewApplicationData): Promise<PlanningApplication> {
    const newApplication = await PlanningApplications.add(application);
    return newApplication;
  }
}

export default new PlanningApplicationService();
