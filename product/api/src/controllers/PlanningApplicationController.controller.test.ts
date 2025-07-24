import {describe, it, expect, vi, beforeEach} from 'vitest';

import {PlanningApplicationService} from '../services/index.js';

import PlanningApplicationController from './PlanningApplicationController.controller.js';

import type {Request, Response, NextFunction} from 'express';

vi.mock('../services', () => ({
  PlanningApplicationService: {
    getAllPlanningApplications: vi.fn(),
    getPlanningApplicationById: vi.fn(),
    addPlanningApplication: vi.fn(),
  },
}));

function createMockRes() {
  const res: Partial<Response> = {};
  res.status = vi.fn().mockReturnThis();
  res.json = vi.fn().mockReturnThis();
  return res as Response;
}

describe('PlanningApplicationController', () => {
  let req: Partial<Request>;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = createMockRes();
    next = vi.fn();
    vi.clearAllMocks();
  });

  describe('getAllPlanningApplications', () => {
    it('should return all planning applications', async () => {
      const mockApps = [{id: 1, name: 'App1'}];
      (
        PlanningApplicationService.getAllPlanningApplications as any
      ).mockResolvedValue(mockApps);

      await PlanningApplicationController.getAllPlanningApplications(
        req as Request,
        res,
        next,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockApps);
    });

    it('should call next on error in getAllPlanningApplications', async () => {
      const error = new Error('fail');
      (
        PlanningApplicationService.getAllPlanningApplications as any
      ).mockRejectedValue(error);

      await PlanningApplicationController.getAllPlanningApplications(
        req as Request,
        res,
        next,
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('getPlanningApplicationById', () => {
    it('should return application by id', async () => {
      const mockApp = {id: 1, name: 'App1'};
      req.params = {id: '1'};
      (
        PlanningApplicationService.getPlanningApplicationById as any
      ).mockResolvedValue(mockApp);

      await PlanningApplicationController.getById(req as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockApp);
    });

    it('should call next on error in getById', async () => {
      const error = new Error('fail');
      req.params = {id: '1'};
      (
        PlanningApplicationService.getPlanningApplicationById as any
      ).mockRejectedValue(error);

      await PlanningApplicationController.getById(req as Request, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('add', () => {
    it('should add a new application', async () => {
      req.body = {name: 'New App'};

      await PlanningApplicationController.add(req as Request, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'New App',
          id: expect.any(Number),
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        }),
      );
    });

    it('should call next on error in add', async () => {
      req.body = {name: 'New App'};
      // Simulate error by throwing in res.json
      (res.json as any).mockImplementation(() => {
        throw new Error('fail');
      });

      await PlanningApplicationController.add(req as Request, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
