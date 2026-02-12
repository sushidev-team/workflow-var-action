const fs = require('fs');
const path = require('path');
const { replaceVars } = require('./src/replace');

const filename = process.argv[2] || process.env.INPUT_FILENAME;

if (!filename) {
  console.error('Error: The path to the file is required');
  process.exit(1);
}

const filePath = path.resolve(filename);

if (!fs.existsSync(filePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf8');
const result = replaceVars(content, process.env);

// Log which placeholders were replaced
const placeholders = content.match(/__[A-Za-z_][A-Za-z0-9_]*__/g) || [];
const unique = [...new Set(placeholders)];
for (const p of unique) {
  const key = p.slice(2, -2);
  if (process.env[key] !== undefined) {
    console.log(`Replaced ${p}`);
  } else {
    console.log(`Skipped ${p} (no matching env var)`);
  }
}

fs.writeFileSync(filePath, result, 'utf8');
console.log(`Done. Processed ${unique.length} placeholder(s) in ${filename}`);
