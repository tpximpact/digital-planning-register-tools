import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';

const CONFIG_PATH = './index.ts';

describe('config', () => {
  const originalEnv = process.env.NODE_ENV;
  const originalPort = process.env.PORT;

  beforeEach(() => {
    // Reset modules and environment variables before each test
    vi.resetModules();
    delete process.env.NODE_ENV;
    delete process.env.PORT;
  });

  afterEach(() => {
    // Restore environment variables after each test
    process.env.NODE_ENV = originalEnv;
    process.env.PORT = originalPort;
  });

  it('should have a default environment of development', async () => {
    const config = (await import(CONFIG_PATH)).default;
    expect(config.environment).toBe('development');
  });

  it('should use NODE_ENV if set', async () => {
    process.env.NODE_ENV = 'production';
    const config = (await import(CONFIG_PATH)).default;
    expect(config.environment).toBe('production');
  });

  it('should have a default port of 4000', async () => {
    const config = (await import(CONFIG_PATH)).default;
    expect(config.port).toBe(4000);
  });

  it('should use PORT if set', async () => {
    process.env.PORT = '1234';
    const config = (await import(CONFIG_PATH)).default;
    expect(config.port).toBe('1234');
  });
});
