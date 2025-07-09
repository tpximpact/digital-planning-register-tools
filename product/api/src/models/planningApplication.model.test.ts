import {describe, it, expect} from 'vitest';

import PlanningApplications from './planningApplication.model';

describe('PlanningApplications model', () => {
  it('getAll should return all applications', () => {
    const all = PlanningApplications.getAll();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
    expect(all[0]).toHaveProperty('id');
    expect(all[0]).toHaveProperty('name');
  });

  it('find should return all applications (ignoring filter)', async () => {
    const result = await PlanningApplications.find({}).exec();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('id');
    expect(result[0]).toHaveProperty('name');
  });

  it('findById should return the correct application', () => {
    const app = PlanningApplications.findById(1);
    expect(app).toBeDefined();
    expect(app?.id).toBe(1);
    expect(app?.name).toBe('Application 1');
  });

  it('findById should return undefined for non-existent id', () => {
    const app = PlanningApplications.findById(999);
    expect(app).toBeUndefined();
  });
});
