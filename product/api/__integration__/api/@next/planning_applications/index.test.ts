import supertest from 'supertest';
import {describe, expect, it} from 'vitest';

import {app} from '../../../../src';

describe('GET /api/@next/planning_applications', () => {
  it('should return message', async () => {
    const response = await supertest(app).get(
      '/api/@next/planning_applications',
    );
    expect(response.status).toBe(200);
  });
});
