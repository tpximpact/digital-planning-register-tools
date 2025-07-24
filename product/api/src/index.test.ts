import {describe, it, expect} from 'vitest';

import {app} from './index.js';

describe('app', () => {
  it('should be an express application', () => {
    expect(typeof app).toBe('function');
    expect(app).toHaveProperty('use');
    expect(app).toHaveProperty('listen');
  });
});
