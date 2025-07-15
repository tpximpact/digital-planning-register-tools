import {PlanningApplicationNotFoundError} from '../errors/index.js';
import {Applications} from '../models/index.js';

import type {PlanningApplication} from '../models/planningApplication.model.js';

class PlanningApplicationService {
  constructor() {
    this.getAllPlanningApplications =
      this.getAllPlanningApplications.bind(this);
    this.getPlanningApplicationById =
      this.getPlanningApplicationById.bind(this);
  }

  getAllPlanningApplications(): PlanningApplication[] {
    const filter = {};

    return Applications.find(filter).exec();
  }

  getPlanningApplicationById(id: number) {
    const foundApplication = Applications.findById(id);

    if (!foundApplication) {
      throw new PlanningApplicationNotFoundError(
        `Planning application not found with id: ${id}`,
      );
    }

    return foundApplication;
  }
}

export default new PlanningApplicationService();
