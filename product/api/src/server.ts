/* eslint-disable import/first */
import path from 'path';
import {fileURLToPath} from 'url';

import dotenv from 'dotenv';

// ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load all environment variables from .env file BEFORE other imports
dotenv.config({path: path.join(__dirname, '.env')});

import config from './config/index.js';

import {app} from './index.js';

app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});
