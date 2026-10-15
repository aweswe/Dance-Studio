const fs = require('fs');
const inventory = JSON.parse(fs.readFileSync('scripts/extracted-inventory.json', 'utf8'));

console.log('=== Studio training and workshop files ===');
inventory
  .filter(f => f.relPath.startsWith('Studio training and workshop-20261014T132300Z-1-001'))
  .forEach(f => console.log(f.relPath, f.size));

console.log('\n=== Srilanka Images ===');
inventory
  .filter(f => f.relPath.startsWith('Srilanka Images-20261014T132314Z-1-001'))
  .forEach(f => console.log(f.relPath, f.size));
