import {describe, it, expect} from 'vitest';

import router from './planningApplicationRouter.route';

describe('planningApplicationRouter', () => {
  it('should have a GET / route', () => {
    const route = router.stack.find(
      (layer: any) =>
        layer.route && layer.route.path === '/' && layer.route.methods.get,
    );
    expect(route).toBeDefined();
  });

  it('should have a GET /:id route with validation and controller', () => {
    const route = router.stack.find(
      (layer: any) =>
        layer.route && layer.route.path === '/:id' && layer.route.methods.get,
    );
    expect(route).toBeDefined();
    if (!route || !route.route) throw new Error('Route not found');
    const stack = route.route.stack;
    // Should have at least two handlers: validation and controller
    expect(stack.length).toBeGreaterThanOrEqual(2);
    expect(typeof stack[0].handle).toBe('function');
    expect(typeof stack[1].handle).toBe('function');
  });

  it('should have a POST / route with validation and controller', () => {
    const route = router.stack.find(
      (layer: any) =>
        layer.route && layer.route.path === '/' && layer.route.methods.post,
    );
    expect(route).toBeDefined();
    if (!route || !route.route) throw new Error('Route not found');
    const stack = route.route.stack;
    // Should have at least two handlers: validation and controller
    expect(stack.length).toBeGreaterThanOrEqual(2);
    expect(typeof stack[0].handle).toBe('function');
    expect(typeof stack[1].handle).toBe('function');
  });
});
