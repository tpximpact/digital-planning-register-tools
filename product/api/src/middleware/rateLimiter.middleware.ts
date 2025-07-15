import rateLimit from 'express-rate-limit';
import {StatusCodes} from 'http-status-codes';

import config from '../config/index.js';

import type {ApiResponse} from '@odp/schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.js';
import type {Request, Response, NextFunction} from 'express';

const response: ApiResponse<null> = {
  data: null,
  status: {
    code: StatusCodes.TOO_MANY_REQUESTS,
    message: 'Too many requests, please try again later.',
  },
};

export const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: config.rateLimit, // limit each IP to 100 requests per 1-minute window.
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (_req: Request, res: Response, _next: NextFunction) =>
    res.status(StatusCodes.TOO_MANY_REQUESTS).json(response),
});
