import path from 'path';

import dotenv from 'dotenv';

// Load all environment variables from .env file BEFORE other imports
dotenv.config({path: path.join(__dirname, '.env')});

import {app} from '.';

// eslint-disable-next-line import/order
import config from './config';

app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});
