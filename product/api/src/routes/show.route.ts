import express from 'express';

import {ShowController} from '../controllers';

const router = express.Router();

router.get('/:id', ShowController.getById);

export default router;
