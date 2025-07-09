import {Request, Response, NextFunction} from 'express';
import {describe, it, expect, vi, beforeEach} from 'vitest';

import router from './';

describe('routes/index', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  it('should respond to GET / with a mock ODP message', () => {
    // Find the route handler for GET /
    const route = router.stack.find(
      (layer: any) =>
        layer.route && layer.route.path === '/' && layer.route.methods.get,
    );
    expect(route).toBeDefined();

    if (!route || !route.route) {
      throw new Error('Route not found');
    }

    // Call the handler
    route.route.stack[0].handle(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Mock ODP compliant endpoint',
    });
  });

  it('should respond to GET /healthcheck with health data', () => {
    const route = router.stack.find(
      (layer: any) =>
        layer.route &&
        layer.route.path === '/healthcheck' &&
        layer.route.methods.get,
    );
    expect(route).toBeDefined();

    if (!route || !route.route) {
      throw new Error('Route not found');
    }

    // Call the handler
    route.route.stack[0].handle(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(
      expect.objectContaining({
        uptime: expect.any(Number),
        message: 'Ok',
        date: expect.any(Date),
      }),
    );
  });
});
