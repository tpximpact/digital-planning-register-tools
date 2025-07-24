import {PlanningApplicationNotFoundError} from '../errors';
import {PlanningApplications} from '../models';

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

    return await PlanningApplications.find(filter).exec();
  }

  async getPlanningApplicationById(id: number) {
    const foundApplication = await PlanningApplications.findById(id);

    if (!foundApplication) {
      throw new PlanningApplicationNotFoundError(
        `Planning application not found with id: ${id}`,
      );
    }

    return foundApplication;
  }

  async add(appData: {name: string}) {
    return await PlanningApplications.add(appData);
  }
}

export default new PlanningApplicationService();
