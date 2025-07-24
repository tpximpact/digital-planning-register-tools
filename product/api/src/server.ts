// Load all environment variables from .env file BEFORE other imports
// dotenv.config({path: path.join(__dirname, '.env')});

import config from './config';

import {app} from '.';

app.listen(config.port, () => {
  console.log(`Server is running at http://localhost:${config.port}`);
});
