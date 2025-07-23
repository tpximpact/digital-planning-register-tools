import cors from 'cors';
import express from 'express';

import {
  rateLimiter,
  routeNotFoundErrorMiddleware,
  unhandledErrorMiddleware,
} from './middleware';
import {setupDatabase} from './models/planningApplication.model';
import router from './routes';

export const createApp = async () => {
  await setupDatabase();

  const app = express();
  app.use(rateLimiter);
  app.use(express.json());
  app.use(cors());
  app.use(router);
  app.use(routeNotFoundErrorMiddleware);
  app.use(unhandledErrorMiddleware);

  return app;
};
