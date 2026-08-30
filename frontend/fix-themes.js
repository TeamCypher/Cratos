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

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace bg-white/X with dark:bg-white/X bg-black/5
  content = content.replace(/(?<!dark:)bg-white\/(5|10|20)/g, (match) => {
    if (match === 'bg-white/5') return 'dark:bg-white/5 bg-black/5';
    if (match === 'bg-white/10') return 'dark:bg-white/10 bg-black/10';
    if (match === 'bg-white/20') return 'dark:bg-white/20 bg-black/20';
    return match;
  });

  // Replace border-white/X with dark:border-white/X border-black/5
  content = content.replace(/(?<!dark:)border-white\/(5|10|20)/g, (match) => {
    if (match === 'border-white/5') return 'dark:border-white/5 border-black/5';
    if (match === 'border-white/10') return 'dark:border-white/10 border-black/10';
    if (match === 'border-white/20') return 'dark:border-white/20 border-black/20';
    return match;
  });

  // Replace bg-black/X with dark:bg-black/X bg-black/5 (usually for darker backgrounds in dark mode, light mode needs very light background)
  content = content.replace(/(?<!dark:)bg-black\/(20|40|60|70)/g, (match) => {
    if (match === 'bg-black/20') return 'dark:bg-black/20 bg-black/5';
    if (match === 'bg-black/40') return 'dark:bg-black/40 bg-black/5';
    if (match === 'bg-black/60') return 'dark:bg-black/60 bg-black/10';
    if (match === 'bg-black/70') return 'dark:bg-black/70 bg-black/10';
    return match;
  });

  // Replace text-white/X with dark:text-white/X text-black/X
  content = content.replace(/(?<!dark:)text-white\/(50)/g, (match) => {
    if (match === 'text-white/50') return 'dark:text-white/50 text-black/50';
    return match;
  });

  // Replace specific text-white that should be text-foreground in light
  // (Only where it's not already in a hover/group state that we want to keep white)
  // Let's just do it for simple text-white
  content = content.replace(/text-white(?!\/)/g, 'dark:text-white text-foreground');

  // Fix up hover states
  content = content.replace(/hover:bg-white\/(5|10|20)/g, (match) => {
    if (match === 'hover:bg-white/5') return 'dark:hover:bg-white/5 hover:bg-black/5';
    if (match === 'hover:bg-white/10') return 'dark:hover:bg-white/10 hover:bg-black/10';
    return match;
  });

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
