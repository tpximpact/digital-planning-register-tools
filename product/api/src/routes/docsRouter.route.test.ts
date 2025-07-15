import {describe, it, expect} from 'vitest';

import router from './docsRouter.route.js';

describe('docsRouter', () => {
  it('should have a GET / route', () => {
    const route = router.stack.find(
      (layer: any) =>
        layer.route && layer.route.path === '/' && layer.route.methods.get,
    );
    expect(route).toBeDefined();
  });
});
