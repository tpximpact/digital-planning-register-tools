import fs from 'fs';
import path from 'path';

import yaml from 'js-yaml';

const __dirname = import.meta.dirname;
const openApiPath = path.join(__dirname, 'openApi.yml');

// Load and parse the YAML file
let openApiDoc;
try {
  openApiDoc = yaml.load(fs.readFileSync(openApiPath, 'utf8'));
} catch (e) {
  console.error('Failed to load openApi.yml:', e);
  openApiDoc = {};
}

export default openApiDoc;
