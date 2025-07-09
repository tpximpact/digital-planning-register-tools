import {PlanningApplicationNotFoundError} from '../errors';
import {Applications} from '../models';

class PlanningApplicationService {
  constructor() {
    this.getAllPlanningApplications =
      this.getAllPlanningApplications.bind(this);
    this.getPlanningApplicationById =
      this.getPlanningApplicationById.bind(this);
  }

  async getAllPlanningApplications(): Promise<
    Array<{id: number; name: string}>
  > {
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
