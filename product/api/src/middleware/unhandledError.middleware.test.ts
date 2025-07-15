import Ajv from 'ajv';
import {StatusCodes} from 'http-status-codes';
import {describe, it, expect, vi, beforeEach} from 'vitest';

import {PlanningApplicationNotFoundError} from '../errors/index.js';

import {unhandledErrorMiddleware} from './unhandledError.middleware.js';

// Mock config to control environment
vi.mock('../config', () => ({
  default: {environment: 'development'},
}));

describe('unhandledErrorMiddleware', () => {
  let req: any;
  let res: any;
  let next: any;

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  it('handles PlanningApplicationNotFoundError', () => {
    const err = new PlanningApplicationNotFoundError('Not found!');
    unhandledErrorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'Resource not found error',
        message: 'Not found!',
        details: undefined,
        detailed: 'Not found!',
        stack: expect.any(String),
      }),
    );
  });

  it('handles Ajv.ValidationError', () => {
    const ajvError = new Ajv.ValidationError([
      {
        instancePath: '/id',
        schemaPath: '#/properties/id/type',
        keyword: 'type',
        params: {type: 'string'},
        message: 'must be string',
      },
    ]);
    unhandledErrorMiddleware(ajvError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.UNPROCESSABLE_ENTITY);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'Validation error',
        message: 'Invalid request',
        details: [
          {
            instancePath: '/id',
            params: {type: 'string'},
            message: 'must be string',
          },
        ],
        detailed: ajvError.message,
        stack: expect.any(String),
      }),
    );
  });

  it('handles generic errors', () => {
    const err = new Error('Something went wrong');
    unhandledErrorMiddleware(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'Server error',
        message: 'An error has occured, please try again later.',
        details: undefined,
        detailed: 'Something went wrong',
        stack: expect.any(String),
      }),
    );
  });

  it('omits detailed and stack in production', async () => {
    vi.resetModules();
    // Change the mocked config to production
    vi.doMock('../config', () => ({
      default: {environment: 'production'},
    }));
    // Need to re-import the middleware after mocking config
    const {unhandledErrorMiddleware: prodMiddleware} = await import(
      './unhandledError.middleware.js'
    );
    const err = new Error('Prod error');
    prodMiddleware(err, req, res, next);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        detailed: undefined,
        stack: undefined,
      }),
    );
  });
});
