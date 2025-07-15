import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

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
