#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';

// Allow CLI args for src and out dirs
const srcDir = path.resolve(process.argv[2] ?? path.join(__dirname, 'data'));
const outPath = path.resolve(
  process.argv[3] ?? path.join(__dirname, '..', 'dist', 'openApi.yml'),
);

function getSortedFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter(file => fs.statSync(path.join(dir, file)).isFile())
    .sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });
}

function readFileContent(filePath: string): string {
  const ext = path.extname(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  switch (ext) {
    case '.json':
    case '.yml':
    case '.yaml':
      return content;
    case '.ts':
      return `# [TS FILE: ${path.basename(filePath)}]\n${content}\n`;
    default:
      return content;
  }
}

function combineFiles() {
  if (!fs.existsSync(srcDir)) {
    console.error('Source directory does not exist:', srcDir);
    process.exit(1);
  }

  const files = getSortedFiles(srcDir);
  let combined = '';

  for (const file of files) {
    const filePath = path.join(srcDir, file);
    // combined += `\n# ---- ${file} ----\n`;
    combined += readFileContent(filePath);
  }

  fs.mkdirSync(path.dirname(outPath), {recursive: true});
  fs.writeFileSync(outPath, combined, 'utf-8');
  console.log('Combined file written to:', outPath);
}

// Show help if requested
if (process.argv.includes('--help')) {
  console.log('Usage: ts-node build.ts [srcDir] [outFile]');
  process.exit(0);
}

combineFiles();
