import path from 'path';

import dotenv from 'dotenv';

// Load all environment variables from .env file BEFORE other imports
dotenv.config({path: path.join(__dirname, '.env')});

import {createApp} from './src';
import config from './src/config';

const startServer = async () => {
  try {
    const app = await createApp();

    app.listen(config.port, () => {
      console.log(`Server is running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
