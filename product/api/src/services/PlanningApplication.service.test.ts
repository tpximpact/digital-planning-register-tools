import {describe, it, expect, vi, beforeEach} from 'vitest';

import {PlanningApplicationNotFoundError} from '../errors/index.js';
import {Applications} from '../models/index.js';

import PlanningApplicationService from './PlanningApplication.service.js';

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

  it('getAllPlanningApplications returns all applications', () => {
    const result = PlanningApplicationService.getAllPlanningApplications();
    expect(Applications.find).toHaveBeenCalled();
    expect(result).toEqual([
      {id: 1, name: 'App1'},
      {id: 2, name: 'App2'},
    ]);
  });

  it('getPlanningApplicationById returns the correct application', () => {
    const result = PlanningApplicationService.getPlanningApplicationById(1);
    expect(Applications.findById).toHaveBeenCalledWith(1);
    expect(result).toEqual({id: 1, name: 'App1'});
  });

  it('getPlanningApplicationById throws if not found', () => {
    expect(
      PlanningApplicationService.getPlanningApplicationById(999),
    ).rejects.toBeInstanceOf(PlanningApplicationNotFoundError);
  });
});
