import path from 'path';

import dotenv from 'dotenv';

import {app} from './src';
import config from './src/config';

// Load all environment variables from .env file
dotenv.config({path: path.join(__dirname, '..', '.env')});

app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});
