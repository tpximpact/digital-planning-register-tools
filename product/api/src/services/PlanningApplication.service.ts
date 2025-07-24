import {PlanningApplicationNotFoundError} from '../errors/index.js';
import {Applications} from '../models/index.js';

class PlanningApplicationService {
  constructor() {
    this.getAllPlanningApplications =
      this.getAllPlanningApplications.bind(this);
    this.getPlanningApplicationById =
      this.getPlanningApplicationById.bind(this);
  }

  async getAllPlanningApplications(): Promise<{id: number; name: string}[]> {
    const filter = {};

    return await Applications.find(filter).exec();
  }

  async getPlanningApplicationById(id: number) {
    const foundApplication = await Applications.findById(id);

    if (!foundApplication) {
      throw new PlanningApplicationNotFoundError(
        `Planning application not found with id: ${id}`,
      );
    }

    return foundApplication;
  }
}

export default new PlanningApplicationService();
