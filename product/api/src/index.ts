import cors from 'cors';
import express from 'express';

import {
  rateLimiter,
  routeNotFoundErrorMiddleware,
  unhandledErrorMiddleware,
} from './middleware';
import router from './routes';

const app = express();

app.use(rateLimiter);
app.use(express.json());
app.use(cors());

// Mount the routes
app.use(router);

app.use(routeNotFoundErrorMiddleware);
app.use(unhandledErrorMiddleware);

export {app};
