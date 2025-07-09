export class PlanningApplicationNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PlanningApplicationNotFoundError';
  }
}
