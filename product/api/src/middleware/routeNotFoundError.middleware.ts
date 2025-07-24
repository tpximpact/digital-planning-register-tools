import {StatusCodes} from 'http-status-codes';

import type {NextFunction, Request, Response} from 'express';

export const routeNotFoundErrorMiddleware = (
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: 'Path not found',
    detail: `Path not found: ${req.originalUrl}`,
  });
  return;
};
