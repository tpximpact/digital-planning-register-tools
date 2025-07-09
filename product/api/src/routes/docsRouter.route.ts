import openApiDoc from '@product/open-api';
import express from 'express';
import swaggerUi from 'swagger-ui-express';

const router = express.Router();

const uiOptions = {
  explorer: true,
  swaggerOptions: {
    validatorUrl: null,
  },
};

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(openApiDoc, uiOptions));

export default router;
