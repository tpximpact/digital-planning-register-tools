import express from 'express';

import {PlanningApplicationController} from '../controllers';
import {
  validateRequestBodyMiddleware,
  validateRequestRouteParameterMiddleware,
} from '../middleware';
import {AddPlanningApplicationSchema, validateIdSchema} from '../schemas';

const router = express.Router();

/**
 * @openapi
 * /api/@next/planning_applications:
 *   get:
 *     description: Welcome to swagger-jsdoc!
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
 */
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
