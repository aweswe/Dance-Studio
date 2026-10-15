const { execSync } = require('child_process');
const fs = require('fs');

const docxPath = 'extracted_assets/2026 NEW Website Galley and Canada workshops-20261014T132346Z-1-001/2026 NEW Website Galley and Canada workshops/Main page.docx';

try {
  const xml = execSync(`tar -xf "${docxPath}" word/document.xml -O`, { maxBuffer: 10 * 1024 * 1024, encoding: 'utf8' });
  const text = xml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  fs.writeFileSync('scripts/docx-extracted-text.txt', text);
  console.log('Docx text length:', text.length);
  console.log('Sample text:\n', text.slice(0, 1500));
} catch (e) {
  console.error('Error:', e.message);
}
