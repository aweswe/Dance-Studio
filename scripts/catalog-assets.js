const fs = require('fs');
const path = require('path');

const base = path.join(process.cwd(), 'extracted_assets');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else {
      results.push({
        relPath: path.relative(base, fullPath).replace(/\\/g, '/'),
        size: stat.size,
        ext: path.extname(file).toLowerCase(),
      });
    }
  });
  return results;
}

const files = walk(base);
console.log('Total files extracted:', files.length);

// Group by top folder and extension
const byExt = {};
const byTopDir = {};
files.forEach(f => {
  byExt[f.ext] = (byExt[f.ext] || 0) + 1;
  const top = f.relPath.split('/')[0];
  byTopDir[top] = (byTopDir[top] || 0) + 1;
});

console.log('\n=== BY EXTENSION ===');
console.log(byExt);

console.log('\n=== BY TOP FOLDER ===');
console.log(byTopDir);

// List all directories/subdirectories
const dirs = new Set();
files.forEach(f => {
  const parts = f.relPath.split('/');
  parts.pop(); // remove filename
  dirs.add(parts.join('/'));
});

console.log('\n=== SUBDIRECTORIES ===');
Array.from(dirs).sort().forEach(d => console.log(' -', d));

// Save detailed list
fs.writeFileSync('scripts/extracted-inventory.json', JSON.stringify(files, null, 2));
console.log('\nSaved full inventory to scripts/extracted-inventory.json');
