#!/usr/bin/env ts-node

import {writeFileSync, mkdirSync} from 'fs';
import {join} from 'path';

import {capitalize} from '@lib/example-ts-build';
import {unique} from '@lib/example-ts-utils';

const data = ['one', 'two', 'two', 'three', 'four', 'four', 'five'];

const output = unique(data).map(capitalize);

// Ensure the dist directory exists
const distDir = join(__dirname, '../dist');
mkdirSync(distDir, {recursive: true});

// Write the output array to a file in dist/output.json
writeFileSync(
  join(distDir, 'output.json'),
  JSON.stringify(output, null, 2),
  'utf-8',
);
