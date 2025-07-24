import {describe, it, expect} from 'vitest';

import validate from './add-planning-application.schema.js';

describe('add-planning-application.schema', () => {
  it('validates a valid name', () => {
    const valid = validate({name: 'Valid Application Name'});
    expect(valid).toBe(true);
    expect(validate.errors).toBeNull();
  });

  it('fails for missing name', () => {
    const valid = validate({});
    expect(valid).toBe(false);
    expect(validate.errors).not.toBeNull();
    expect(validate.errors?.[0]?.message).toMatch(
      /must have required property 'name'/,
    );
  });

  it('fails for name that is too short', () => {
    const valid = validate({name: 'A'});
    expect(valid).toBe(false);
    expect(validate.errors).not.toBeNull();
    expect(validate.errors?.[0]?.message).toMatch(
      /must NOT have fewer than 2 characters/,
    );
  });

  it('fails for name that is too long', () => {
    const longName = 'A'.repeat(201);
    const valid = validate({name: longName});
    expect(valid).toBe(false);
    expect(validate.errors).not.toBeNull();
    expect(validate.errors?.[0]?.message).toMatch(
      /must NOT have more than 200 characters/,
    );
  });

  it('fails for non-string name', () => {
    const valid = validate({name: 123});
    expect(valid).toBe(false);
    expect(validate.errors).not.toBeNull();
    expect(validate.errors?.[0]?.message).toMatch(/must be string/);
  });

  it('fails for additional properties', () => {
    const valid = validate({name: 'Valid Name', extra: 'not allowed'});
    expect(valid).toBe(false);
    expect(validate.errors).not.toBeNull();
    expect(validate.errors?.[0]?.message).toMatch(
      /must NOT have additional properties/,
    );
  });
});
