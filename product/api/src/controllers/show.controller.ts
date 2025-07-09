import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';

import {SearchService} from '../services';

class ShowController {
  constructor() {
    this.getById = this.getById.bind(this);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const {id} = req.params;

      const application = await SearchService.getApplicationById(parseInt(id));
      res.status(StatusCodes.OK).json(application);
      next();
    } catch (err) {
      return next(err);
    }
  }
}

export default new ShowController();
