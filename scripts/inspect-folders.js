const fs = require('fs');
const inventory = JSON.parse(fs.readFileSync('scripts/extracted-inventory.json', 'utf8'));

console.log('=== .DOCX FILES ===');
inventory.filter(f => f.ext === '.docx').forEach(f => console.log(f.relPath, f.size));

console.log('\n=== VIDEOS (.mp4, .mov) ===');
inventory.filter(f => f.ext === '.mp4' || f.ext === '.mov').forEach(f => console.log(f.relPath, f.size));

console.log('\n=== TEAM PHOTOS ===');
inventory.filter(f => f.relPath.includes('Team Photos')).forEach(f => console.log(f.relPath));

console.log('\n=== BATCH COVER IMAGES ===');
inventory.filter(f => f.relPath.includes('Batch Cover Image')).forEach(f => console.log(f.relPath));

console.log('\n=== STUDIO PHOTOS ===');
inventory.filter(f => f.relPath.includes('Studio Photo')).forEach(f => console.log(f.relPath));
