import {describe, it, expect} from 'vitest';

import validate from './validate-id.schema.js';

describe('validate-id.schema', () => {
  it('validates a valid uuid', () => {
    const valid = validate({id: '123e4567-e89b-12d3-a456-426614174000'});
    expect(valid).toBe(true);
    expect(validate.errors).toBeNull();
  });

  it('validates a non-empty string', () => {
    const valid = validate({id: 'some-string-id'});
    expect(valid).toBe(true);
    expect(validate.errors).toBeNull();
  });

  it('fails for empty string', () => {
    const valid = validate({id: ''});
    expect(valid).toBe(false);
    expect(validate.errors).not.toBeNull();
    expect(validate.errors?.[0]?.message).toMatch(/must match format/);
  });

  it('fails for missing id', () => {
    const valid = validate({});
    expect(valid).toBe(false);
    expect(validate.errors).not.toBeNull();
    expect(validate.errors?.[0]?.message).toMatch(
      /must have required property 'id'/,
    );
  });

  it('fails for non-string id', () => {
    const valid = validate({id: 123});
    expect(valid).toBe(false);
    expect(validate.errors).not.toBeNull();
    expect(validate.errors?.[0]?.message).toMatch(/must be string/);
  });
});
