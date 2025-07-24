import {ApiResponse} from '@odp/schemas/types/schemas/postSubmissionApplication/implementation/ApiResponse';
import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';

import config from '../config';

export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Allow all requests in development
  if (config.environment === 'development') {
    return next();
  }

  // const apiKey = req.headers['x-api-key'];
  // if (apiKey === config.apiKey) {
  //   return next();
  // }

  const response: ApiResponse<null> = {
    data: null,
    status: {
      code: StatusCodes.UNAUTHORIZED,
      message: 'Not authorised',
    },
  };
  res.status(StatusCodes.UNAUTHORIZED).json(response);
};
