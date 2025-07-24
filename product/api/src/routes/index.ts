import express from 'express';
import {StatusCodes} from 'http-status-codes';

import {authenticationMiddleware} from '../middleware/index.js';

import docsRouter from './docsRouter.route.js';
import planningApplicationRouter from './planningApplicationRouter.route.js';

import type {NextFunction, Request, Response} from 'express';

export interface HealthCheckData {
  uptime: number;
  message: string;
  date: Date;
}

const router = express.Router();

router.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  res.status(StatusCodes.OK).json({
    message: 'Mock ODP compliant endpoint',
  });
});

router.get(
  '/healthcheck',
  (_req: Request, res: Response, next: NextFunction) => {
    const data: HealthCheckData = {
      uptime: process.uptime(),
      message: 'Ok',
      date: new Date(),
    };

    res.status(StatusCodes.OK).send(data);
    next();
  },
);

router.use(
  '/api/@next/planning_applications',
  authenticationMiddleware,
  planningApplicationRouter,
);

router.use('/docs', docsRouter);

export default router;
