import {StatusCodes} from 'http-status-codes';
import {describe, it, expect, vi} from 'vitest';

import {routeNotFoundErrorMiddleware} from './routeNotFoundError.middleware.js';

describe('routeNotFoundErrorMiddleware', () => {
  it('should respond with 404 and correct message', () => {
    const req = {originalUrl: '/not-found'} as any;
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as any;
    const next = vi.fn();

    routeNotFoundErrorMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(StatusCodes.NOT_FOUND);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Path not found',
      detail: 'Path not found: /not-found',
    });
    expect(next).not.toHaveBeenCalled();
  });
});
