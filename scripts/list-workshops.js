const fs = require('fs');
const inventory = JSON.parse(fs.readFileSync('scripts/extracted-inventory.json', 'utf8'));

console.log('=== India workshop files ===');
inventory
  .filter(f => f.relPath.includes('India workshop'))
  .forEach(f => console.log(f.relPath, f.size));

console.log('\n=== Canada Workshop files ===');
inventory
  .filter(f => f.relPath.includes('Canada Workshop'))
  .forEach(f => console.log(f.relPath, f.size));
