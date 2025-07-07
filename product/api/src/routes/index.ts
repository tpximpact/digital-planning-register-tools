import express, {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

import searchRouter from './search.route';
// import studentRouter from './student.route';

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

router.use('/api/@next/search', searchRouter);
// router.use('/api/students', studentRouter);

export default router;
