import cors from 'cors';
import express from 'express';

import {initDb} from './db';
import {
  rateLimiter,
  routeNotFoundErrorMiddleware,
  unhandledErrorMiddleware,
} from './middleware';
import router from './routes';

const app = express();
app.use(rateLimiter);
initDb();
app.use(express.json());
app.use(cors());
app.use(router);
app.use(routeNotFoundErrorMiddleware);
app.use(unhandledErrorMiddleware);

export {app};
