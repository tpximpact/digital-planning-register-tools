import {ValidationError} from 'ajv';
import {describe, it, expect, vi, beforeEach} from 'vitest';

import {validateRequestBodyMiddleware} from './validateRequestBody.middleware.js';

describe('validateRequestBodyMiddleware', () => {
  const req = {body: {foo: 'bar'}} as any;
  const res = {} as any;
  let next: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    next = vi.fn();
  });

  it('calls next() if validation passes', async () => {
    const ajvInstance = vi.fn().mockReturnValue(true) as any;
    const middleware = validateRequestBodyMiddleware(ajvInstance);

    await middleware(req, res, next);

    expect(ajvInstance).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(); // No error
  });

  it('calls next() with ValidationError if validation fails', async () => {
    const ajvInstance = vi.fn().mockReturnValue(false) as any;
    ajvInstance.errors = [{instancePath: '/foo', message: 'Invalid'}];
    const middleware = validateRequestBodyMiddleware(ajvInstance);

    await middleware(req, res, next);

    expect(ajvInstance).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalledTimes(1);
    const errorArg = next.mock.calls[0]?.[0];
    expect(errorArg).toBeInstanceOf(ValidationError);
    expect(errorArg.errors).toEqual(ajvInstance.errors);
  });

  it('calls next() with ValidationError if validation fails and ajv.errors is undefined', async () => {
    const ajvInstance = vi.fn().mockReturnValue(false) as any;
    // ajvInstance.errors is not set (undefined)
    const middleware = validateRequestBodyMiddleware(ajvInstance);

    await middleware(req, res, next);

    expect(ajvInstance).toHaveBeenCalledWith(req.body);
    expect(next).toHaveBeenCalledTimes(1);
    const errorArg = next.mock.calls[0]?.[0];
    expect(errorArg).toBeInstanceOf(ValidationError);
    expect(errorArg.errors).toEqual([]); // Should default to empty array
  });
});
