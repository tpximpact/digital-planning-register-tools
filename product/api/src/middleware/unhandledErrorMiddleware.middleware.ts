import Ajv from 'ajv';
import {Request, Response, NextFunction} from 'express';
import {StatusCodes} from 'http-status-codes';

import config from '../config';
import {ApplicationNotFoundError} from '../errors';

export const unhandledErrorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let type = 'Server error';
  let message = 'An error has occured, please try again later.';
  let details: any = undefined;

  if (err instanceof ApplicationNotFoundError) {
    statusCode = StatusCodes.NOT_FOUND;
    type = 'Resource not found error';
    message = err.message;
  } else if (
    err instanceof Ajv.ValidationError &&
    err.errors &&
    err.errors.length
  ) {
    statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
    type = 'Validation error';
    message = 'Invalid request';

    details = err.errors.map((schemaError: any) => ({
      instancePath: schemaError.instancePath,
      params: schemaError.params,
      message: schemaError.message,
    }));
  }

  const errorResponse = {
    type,
    message,
    details,
    detailed: config.environment === 'development' ? err.message : undefined,
    stack: config.environment === 'development' ? err.stack : undefined,
  };

  res.status(statusCode).json(errorResponse);
  return;
};
