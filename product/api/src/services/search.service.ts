import {ApplicationNotFoundError} from '../errors';
import {Applications} from '../models';

class SearchService {
  constructor() {
    this.getAllApplications = this.getAllApplications.bind(this);
  }

  async getAllApplications(): Promise<Array<{id: number; name: string}>> {
    const filter = {};

    return await Applications.find(filter).exec();
  }

  async getApplicationById(id: number) {
    const foundApplication = await Applications.findById(id);

    if (!foundApplication) {
      throw new ApplicationNotFoundError(
        `Application not found with id: ${id}`,
      );
    }

    return foundApplication;
  }
}

export default new SearchService();
