import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';

import {SearchService} from '../services';

class SearchController {
  constructor() {
    this.getAllApplications = this.getAllApplications.bind(this);
  }

  async getAllApplications(req: Request, res: Response, next: NextFunction) {
    try {
      const applications = await SearchService.getAllApplications();
      res.status(StatusCodes.OK).json(applications);
      next();
    } catch (err) {
      return next(err);
    }
  }
}

export default new SearchController();
