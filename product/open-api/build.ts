import fs from 'fs';
import path from 'path';

function getSortedFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter(file => fs.statSync(path.join(dir, file)).isFile())
    .sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
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

export function combineFiles(srcDir: string, outPath: string): void {
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

const srcDir = path.join(__dirname, 'data');
const outPath = path.join(__dirname, 'src', 'openApi.yml');

combineFiles(srcDir, outPath);
