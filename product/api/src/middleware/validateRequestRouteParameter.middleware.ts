import {ValidateFunction, ValidationError} from 'ajv';
import {NextFunction, Request, Response} from 'express';

export function validateRequestRouteParameterMiddleware(
  ajvInstance: ValidateFunction,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const isValid = ajvInstance(req.params);
    if (isValid) {
      return next();
    }
    // Manually create an Ajv.ValidationError instance because ajvInstance is called synchronously
    const error = new ValidationError(ajvInstance.errors || []);
    return next(error);
  };
}
