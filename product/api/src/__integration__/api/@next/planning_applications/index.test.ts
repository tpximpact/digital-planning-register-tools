import supertest from 'supertest';
import {describe, expect, it} from 'vitest';

import {app} from '../../../../index.js';
describe('GET /api/@next/planning_applications', () => {
  it('should return message', async () => {
    const response = await supertest(app)
      .get('/api/@next/planning_applications')
      .set('x-api-key', process.env.API_KEY ?? '12345');
    expect(response.status).toBe(200);
  });
});
