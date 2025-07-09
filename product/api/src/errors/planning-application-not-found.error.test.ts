import {describe, it, expect} from 'vitest';

import {PlanningApplicationNotFoundError} from './planning-application-not-found.error';

describe('PlanningApplicationNotFoundError', () => {
  it('should set the correct name and message', () => {
    const error = new PlanningApplicationNotFoundError('Not found!');
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(PlanningApplicationNotFoundError);
    expect(error.name).toBe('PlanningApplicationNotFoundError');
    expect(error.message).toBe('Not found!');
  });

  it('should have a stack trace', () => {
    const error = new PlanningApplicationNotFoundError('Missing');
    expect(error.stack).toBeDefined();
    expect(typeof error.stack).toBe('string');
  });
});
