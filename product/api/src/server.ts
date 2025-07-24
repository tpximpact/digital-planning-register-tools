/* eslint-disable import-x/no-nodejs-modules */
import path from 'path';

import dotenv from 'dotenv';

// Load all environment variables from .env file BEFORE other imports
dotenv.config({path: path.join(__dirname, '.env')});

import {app} from './index.js';

// eslint-disable-next-line import-x/order
import config from './config/index.js';

app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});
