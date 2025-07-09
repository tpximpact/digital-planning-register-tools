import cors from 'cors';
import express from 'express';

import {
  authenticationMiddleware,
  rateLimiter,
  routeNotFoundErrorMiddleware,
  unhandledErrorMiddleware,
} from './middleware';
import router from './routes';

export const app = express();

app.use(rateLimiter);
app.use(authenticationMiddleware);
app.use(express.json());
app.use(cors());

// Mount the routes
app.use(router);

app.use(routeNotFoundErrorMiddleware);
app.use(unhandledErrorMiddleware);
