import {StatusCodes} from 'http-status-codes';

import config from '../config/index.js';

import type {ApiResponse} from 'digital-planning-data-schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse.d.ts';
import type {Request, Response, NextFunction} from 'express';

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Allow all requests in development
  if (config.environment === 'development') {
    next();
    return;
  }

  const apiKey = req.headers['x-api-key'];
  if (apiKey === config.apiKey) {
    next();
    return;
  }

  const response: ApiResponse<null> = {
    data: null,
    status: {
      code: StatusCodes.UNAUTHORIZED,
      message: 'Not authorised',
    },
  };
  res.status(StatusCodes.UNAUTHORIZED).json(response);
};
