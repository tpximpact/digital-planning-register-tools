import {describe, it, expect, vi, beforeEach} from 'vitest';

import {PlanningApplicationNotFoundError} from '../errors';
import {Applications} from '../models';

import PlanningApplicationService from './PlanningApplication.service';

vi.mock('../models', () => {
  const mockApps = [
    {id: 1, name: 'App1'},
    {id: 2, name: 'App2'},
  ];
  return {
    Applications: {
      find: vi.fn(() => ({
        exec: vi.fn().mockResolvedValue(mockApps),
      })),
      findById: vi.fn((id: number) => {
        return mockApps.find(app => app.id === id);
      }),
    },
  };
});

describe('PlanningApplicationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllPlanningApplications returns all applications', async () => {
    const result =
      await PlanningApplicationService.getAllPlanningApplications();
    expect(Applications.find).toHaveBeenCalled();
    expect(result).toEqual([
      {id: 1, name: 'App1'},
      {id: 2, name: 'App2'},
    ]);
  });

  it('getPlanningApplicationById returns the correct application', async () => {
    const result =
      await PlanningApplicationService.getPlanningApplicationById(1);
    expect(Applications.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual({id: 1, name: 'App1'});
  });

  it('getPlanningApplicationById throws if not found', async () => {
    await expect(
      PlanningApplicationService.getPlanningApplicationById(999),
    ).rejects.toBeInstanceOf(PlanningApplicationNotFoundError);
  });
});
