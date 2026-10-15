const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const zips = [
  'C:\\Users\\adars\\Downloads\\Srilanka Images-20261014T132314Z-1-001.zip',
  'C:\\Users\\adars\\Downloads\\2026 NEW Website Galley and Canada workshops-20261014T132346Z-1-001.zip',
  'C:\\Users\\adars\\Downloads\\Studio training and workshop-20261014T132300Z-1-001.zip',
];

const destBase = path.join(process.cwd(), 'extracted_assets');
if (!fs.existsSync(destBase)) fs.mkdirSync(destBase, { recursive: true });

const psScript = `
Add-Type -AssemblyName System.IO.Compression.FileSystem
$zips = @(
  'C:\\Users\\adars\\Downloads\\Srilanka Images-20261014T132314Z-1-001.zip',
  'C:\\Users\\adars\\Downloads\\2026 NEW Website Galley and Canada workshops-20261014T132346Z-1-001.zip',
  'C:\\Users\\adars\\Downloads\\Studio training and workshop-20261014T132300Z-1-001.zip'
)
$destBase = '${destBase.replace(/\\/g, '\\\\')}'

foreach ($zip in $zips) {
  if (Test-Path $zip) {
    Write-Host "Processing: $zip"
    $name = [System.IO.Path]::GetFileNameWithoutExtension($zip)
    $targetDir = Join-Path $destBase $name
    if (-not (Test-Path $targetDir)) {
      New-Item -ItemType Directory -Path $targetDir -Force | Out-Null
    }
    Write-Host "Extracting to $targetDir..."
    [System.IO.Compression.ZipFile]::ExtractToDirectory($zip, $targetDir)
    Write-Host "Extraction complete for $name"
  } else {
    Write-Host "Zip not found: $zip"
  }
}
`;

fs.writeFileSync('scripts/run_extract.ps1', psScript);
console.log('Starting extraction...');
try {
  const out = execSync('powershell -ExecutionPolicy Bypass -File scripts/run_extract.ps1', {
    encoding: 'utf8',
    maxBuffer: 50 * 1024 * 1024,
  });
  console.log(out);
} catch (e) {
  console.error('Error during extraction:', e.message);
} finally {
  if (fs.existsSync('scripts/run_extract.ps1')) fs.unlinkSync('scripts/run_extract.ps1');
}
