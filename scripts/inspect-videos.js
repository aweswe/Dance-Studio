const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.join(process.cwd(), 'scripts', 'video_previews');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const vids = [
  { name: 'hero-section', filePath: 'public/videos/hero-section.mp4' },
  { name: 'hyderabad-diaries', filePath: 'public/videos/hyderabaddiaries-reel.mp4' },
  { name: 'spotlight-1', filePath: 'public/videos/spotlight-1.mp4' },
  { name: 'spotlight-2', filePath: 'public/videos/spotlight-2.mp4' },
  { name: 'spotlight-3', filePath: 'public/videos/spotlight-3.mp4' },
  { name: 'canada-1', filePath: 'extracted_assets/2026 NEW Website Galley and Canada workshops-20261014T132346Z-1-001/2026 NEW Website Galley and Canada workshops/Canada Workshop and Music Video Project/236a36b4-81fa-42b4-90cc-d4a9c39070d7.mp4' },
  { name: 'canada-2', filePath: 'extracted_assets/2026 NEW Website Galley and Canada workshops-20261014T132346Z-1-001/2026 NEW Website Galley and Canada workshops/Canada Workshop and Music Video Project/bd34a1ee-5f6d-492f-9003-4038897911d6.mp4' }
];

vids.forEach(v => {
  try {
    const probe = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=p=0 "${v.filePath}"`, { encoding: 'utf8' }).trim();
    console.log(v.name, probe);
    const outImg = path.join(outDir, `${v.name}.jpg`);
    execSync(`ffmpeg -y -ss 00:00:02 -i "${v.filePath}" -vframes 1 "${outImg}"`, { stdio: 'ignore' });
  } catch(e) {
    console.error('Error for ' + v.name, e.message);
  }
});
console.log('Frames saved to scripts/video_previews');
