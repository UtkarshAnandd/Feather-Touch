import fs from 'node:fs';
import path from 'node:path';

const siteDir = path.resolve('_site');

if (!fs.existsSync(siteDir)) {
  console.error(`Error: Output directory ${siteDir} does not exist. Build first.`);
  process.exit(1);
}

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

const allFiles = getAllFiles(siteDir);

// Budgets in bytes
const BUDGETS = {
  htmlPerPage: 75 * 1024,      // 75 KB
  cssMain: 50 * 1024,          // 50 KB
  jsTotal: 40 * 1024,          // 40 KB
  fontsTotal: 120 * 1024,      // 120 KB
};

let failures = 0;
let totalFontSize = 0;
let totalJsSize = 0;

for (const filePath of allFiles) {
  const relPath = path.relative(siteDir, filePath);
  const size = fs.statSync(filePath).size;

  if (relPath.endsWith('.html')) {
    if (size > BUDGETS.htmlPerPage) {
      console.error(`[BUDGET FAIL] HTML file ${relPath} exceeds budget: ${(size / 1024).toFixed(1)} KB > ${(BUDGETS.htmlPerPage / 1024)} KB`);
      failures++;
    }
  } else if (relPath.endsWith('main.css')) {
    if (size > BUDGETS.cssMain) {
      console.error(`[BUDGET FAIL] CSS file ${relPath} exceeds budget: ${(size / 1024).toFixed(1)} KB > ${(BUDGETS.cssMain / 1024)} KB`);
      failures++;
    }
  } else if (relPath.endsWith('.js')) {
    totalJsSize += size;
  } else if (relPath.endsWith('.woff2') || relPath.endsWith('.woff')) {
    totalFontSize += size;
  }
}

if (totalJsSize > BUDGETS.jsTotal) {
  console.error(`[BUDGET FAIL] Total JS size exceeds budget: ${(totalJsSize / 1024).toFixed(1)} KB > ${(BUDGETS.jsTotal / 1024)} KB`);
  failures++;
}

if (totalFontSize > BUDGETS.fontsTotal) {
  console.error(`[BUDGET FAIL] Total font size exceeds budget: ${(totalFontSize / 1024).toFixed(1)} KB > ${(BUDGETS.fontsTotal / 1024)} KB`);
  failures++;
}

if (failures > 0) {
  console.error(`Asset budget check failed with ${failures} error(s).`);
  process.exit(1);
} else {
  console.log(`Asset budget check PASSED: All generated assets are within limits.`);
  console.log(`  - Total Fonts: ${(totalFontSize / 1024).toFixed(1)} KB (Budget: ${(BUDGETS.fontsTotal / 1024)} KB)`);
  console.log(`  - Total JS: ${(totalJsSize / 1024).toFixed(1)} KB (Budget: ${(BUDGETS.jsTotal / 1024)} KB)`);
  process.exit(0);
}
