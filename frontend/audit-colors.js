const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('./app').concat(walk('./components'));

const searchPatterns = [
  /#000000/i,
  /#000\b/i,
  /#FFFFFF/i,
  /#ffffff/i,
  /#111111/i,
  /#111\b/i,
  /bg-gray-/,
  /text-gray-/,
  /border-gray-/,
  /bg-slate-/,
  /text-slate-/,
  /border-slate-/,
  /bg-zinc-/,
  /text-zinc-/,
  /border-zinc-/,
  /bg-neutral-/,
  /text-neutral-/,
  /border-neutral-/
];

let foundCount = 0;

files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, index) => {
    let match = searchPatterns.find(pattern => pattern.test(line));
    if (match) {
      console.log(`${file}:${index + 1}: ${line.trim()}`);
      foundCount++;
    }
  });
});

console.log(`\nFound ${foundCount} lines with hardcoded colors.`);
