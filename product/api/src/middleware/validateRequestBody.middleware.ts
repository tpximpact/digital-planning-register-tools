import {ValidateFunction, ValidationError} from 'ajv';
import {Request, Response, NextFunction} from 'express';

export const validateRequestBodyMiddleware = (
  ajvInstance: ValidateFunction,
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const isValid = ajvInstance(req.body);
    if (isValid) {
      return next();
    }
    // Manually create an Ajv.ValidationError instance because ajvInstance is called synchronously
    const error = new ValidationError(ajvInstance.errors || []);
    return next(error);
  };
};
