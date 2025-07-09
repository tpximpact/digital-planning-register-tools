import supertest from 'supertest';
import {describe, expect, it} from 'vitest';

import {app} from '../src';
describe('GET /healthcheck', () => {
  it('should return message', async () => {
    const response = await supertest(app).get('/healthcheck');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('uptime');
    expect(typeof response.body.uptime).toBe('number');
    expect(response.body).toHaveProperty('message', 'Ok');
    expect(response.body).toHaveProperty('date');
    expect(new Date(response.body.date)).toBeInstanceOf(Date);
  });
});
