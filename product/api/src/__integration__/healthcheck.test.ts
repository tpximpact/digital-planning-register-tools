import supertest from 'supertest';
import {describe, expect, it} from 'vitest';

import {app} from '../index.js';

import type {HealthCheckData} from '../routes/index.js';

describe('GET /healthcheck', () => {
  it('should return message', async () => {
    const response = await supertest(app).get('/healthcheck');

    expect(response.status).toBe(200);

    const responseBody = response.body as HealthCheckData;
    expect(responseBody).toHaveProperty('uptime');
    expect(typeof responseBody.uptime).toBe('number');
    expect(responseBody).toHaveProperty('message', 'Ok');
    expect(responseBody).toHaveProperty('date');
    expect(new Date(responseBody.date)).toBeInstanceOf(Date);
  });
});
