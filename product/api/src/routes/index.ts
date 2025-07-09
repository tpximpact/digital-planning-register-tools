import express, {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

import docsRouter from './docsRouter.route';
import planningApplicationRouter from './planningApplicationRouter.route';

const router = express.Router();

// eslint-disable-next-line unused-imports/no-unused-vars
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.status(StatusCodes.OK).json({
    message: 'Mock ODP compliant endpoint',
  });
});

router.get(
  '/healthcheck',
  (req: Request, res: Response, next: NextFunction) => {
    const data = {
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date(),
    };

    res.status(StatusCodes.OK).send(data);
    next();
  },
);

router.use('/api/@next/planning_applications', planningApplicationRouter);

router.use('/docs', docsRouter);

export default router;
