import express from 'express';

import {PlanningApplicationController} from '../controllers';
import {
  validateRequestBodyMiddleware,
  validateRequestRouteParameterMiddleware,
} from '../middleware';
import {AddPlanningApplicationSchema, validateIdSchema} from '../schemas';

const router = express.Router();

router.get('/', PlanningApplicationController.getAllPlanningApplications);
router.get(
  '/:id',
  validateRequestRouteParameterMiddleware(validateIdSchema),
  PlanningApplicationController.getById,
);
router.post(
  '/',
  validateRequestBodyMiddleware(AddPlanningApplicationSchema),
  PlanningApplicationController.add,
);

export default router;
