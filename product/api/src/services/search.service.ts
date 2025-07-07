class SearchService {
  constructor() {
    this.getAllApplications = this.getAllApplications.bind(this);
  }

  async getAllApplications(): Promise<Array<{id: number; name: string}>> {
    const filter = {};

    // throw new ApplicationNotFoundError(
    //   `Application not found with reference: blerg`,
    // );

    return Promise.resolve([
      {id: 1, name: 'Application 1'},
      {id: 2, name: 'Application 2'},
      {id: 3, name: 'Application 3'},
    ]);
  }
}

export default new SearchService();
