import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';

import {PlanningApplicationService} from '../services';

class PlanningApplicationController {
  constructor() {
    this.getAllPlanningApplications =
      this.getAllPlanningApplications.bind(this);
    this.getById = this.getById.bind(this);
    this.add = this.add.bind(this);
  }

  async getAllPlanningApplications(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const applications =
        await PlanningApplicationService.getAllPlanningApplications();
      res.status(StatusCodes.OK).json(applications);
    } catch (err) {
      return next(err);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = req.params;
      const application =
        await PlanningApplicationService.getPlanningApplicationById(
          parseInt(id),
        );
      res.status(StatusCodes.OK).json(application);
    } catch (err) {
      return next(err);
    }
  }

  async add(req: Request, res: Response, next: NextFunction) {
    try {
      const rawData = req.body;

      const newApplication = await PlanningApplicationService.add(rawData);

      res.status(StatusCodes.CREATED).json(newApplication);
    } catch (err) {
      return next(err);
    }
  }
}

export default new PlanningApplicationController();
