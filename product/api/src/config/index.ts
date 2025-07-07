import path from 'path';

import dotenv from 'dotenv';

// Load all environment variables from .env file
dotenv.config({path: path.join(__dirname, '..', '.env')});

export default {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
};
