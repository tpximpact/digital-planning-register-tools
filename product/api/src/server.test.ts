import {describe, it, expect, vi, beforeEach} from 'vitest';

vi.mock('dotenv', () => ({
  default: {config: vi.fn()},
}));
vi.mock('path', () => ({
  default: {
    join: vi.fn(() => '/mocked/path/.env'),
  },
}));
vi.mock('./src', () => ({
  app: {
    listen: vi.fn((_port, cb) => cb?.()),
  },
}));
vi.mock('./src/config', () => ({
  default: {port: 1234},
}));

describe('server', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads environment variables with dotenv', async () => {
    const dotenv = (await import('dotenv')).default;
    await import('./server.js');
    expect(dotenv.config).toHaveBeenCalledWith({path: '/mocked/path/.env'});
  });
});
