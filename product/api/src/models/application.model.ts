export interface Application {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Example in-memory store (for development/testing)
const applications: Application[] = [
  {id: 1, name: 'Application 1', createdAt: new Date(), updatedAt: new Date()},
  {id: 2, name: 'Application 2', createdAt: new Date(), updatedAt: new Date()},
  {id: 3, name: 'Application 3', createdAt: new Date(), updatedAt: new Date()},
];

class Applications {
  constructor() {
    this.find = this.find.bind(this);
    this.getAll = this.getAll.bind(this);
    this.findById = this.findById.bind(this);
  }

  find(filter: Partial<Application>) {
    // Simulate a Mongoose-like API
    return {
      exec: async (): Promise<Application[]> => {
        // For now, ignore filter and return all
        return applications;
      },
    };
  }

  getAll(): Application[] {
    return applications;
  }

  findById(id: number): Application | undefined {
    return applications.find(app => app.id === id);
  }
}

export default new Applications();
