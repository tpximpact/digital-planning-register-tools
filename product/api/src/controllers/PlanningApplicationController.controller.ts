import {StatusCodes} from 'http-status-codes';

import {PlanningApplicationService} from '../services/index.js';

import type {Request, Response, NextFunction} from 'express';

class PlanningApplicationController {
  constructor() {
    this.getAllPlanningApplications =
      this.getAllPlanningApplications.bind(this);
    this.getById = this.getById.bind(this);
    this.add = this.add.bind(this);
  }

  getAllPlanningApplications(_req: Request, res: Response, next: NextFunction) {
    try {
      const applications =
        PlanningApplicationService.getAllPlanningApplications();
      res.status(StatusCodes.OK).json(applications);
    } catch (err) {
      return next(err);
    }
  }

  getById(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = req.params;

      const application = PlanningApplicationService.getPlanningApplicationById(
        parseInt(id),
      );
      res.status(StatusCodes.OK).json(application);
    } catch (err) {
      return next(err);
    }
  }

  add(req: Request, res: Response, next: NextFunction) {
    try {
      const {name} = req.body;

      // Fake add: push to in-memory array (replace with your model/service as needed)
      const newApplication = {
        id: Date.now(), // simple unique id for demo
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // This assumes you have an in-memory array or a service to handle this
      // For example, if using ApplicationsModel from earlier:
      // ApplicationsModel.add(newApplication);

      // For demonstration, just return the new application
      res.status(StatusCodes.CREATED).json(newApplication);
    } catch (err) {
      return next(err);
    }
  }
}

export default new PlanningApplicationController();
