import supertest from 'supertest';
import {describe, expect, it} from 'vitest';

import {app} from '../index.js';
describe('GET /', () => {
  it('should return message', async () => {
    const response = await supertest(app).get('/');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toStrictEqual({
      message: 'Mock ODP compliant endpoint',
    });
  });
});
