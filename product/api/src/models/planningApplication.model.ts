export interface PlanningApplication {
  id: number;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Example in-memory store (for development/testing)
const applications: PlanningApplication[] = [
  {id: 1, name: 'Application 1', createdAt: new Date(), updatedAt: new Date()},
  {id: 2, name: 'Application 2', createdAt: new Date(), updatedAt: new Date()},
  {id: 3, name: 'Application 3', createdAt: new Date(), updatedAt: new Date()},
];

class PlanningApplications {
  constructor() {
    this.find = this.find.bind(this);
    this.getAll = this.getAll.bind(this);
    this.findById = this.findById.bind(this);
  }

  find(_filter: Partial<PlanningApplication>) {
    // Simulate an async API
    return {
      exec: (): PlanningApplication[] => {
        // For now, ignore filter and return all
        return applications;
      },
    };
  }

  getAll(): PlanningApplication[] {
    return applications;
  }

  findById(id: number): PlanningApplication | undefined {
    return applications.find(app => app.id === id);
  }
}

export default new PlanningApplications();
