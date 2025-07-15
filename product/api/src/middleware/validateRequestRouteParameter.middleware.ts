import {ValidationError} from 'ajv';

import type {ValidateFunction} from 'ajv';
import type {NextFunction, Request, Response} from 'express';

export function validateRequestRouteParameterMiddleware(
  ajvInstance: ValidateFunction,
) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const isValid = ajvInstance(req.params);
    if (isValid) {
      return next();
    }
    // Manually create an Ajv.ValidationError instance because ajvInstance is called synchronously
    const error = new ValidationError(ajvInstance.errors ?? []);
    return next(error);
  };
}
