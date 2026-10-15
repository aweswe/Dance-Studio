const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function main() {
  const base = path.join(process.cwd(), 'extracted_assets');
  const pub = path.join(process.cwd(), 'public', 'images');

  // 1. Branding
  const brandDir = path.join(pub, 'branding');
  if (!fs.existsSync(brandDir)) fs.mkdirSync(brandDir, { recursive: true });

  const iaoSrc = path.join(base, '2026 NEW Website Galley and Canada workshops-20261014T132346Z-1-001', '2026 NEW Website Galley and Canada workshops', 'IAO logo.png');
  const ftbSrc = path.join(base, '2026 NEW Website Galley and Canada workshops-20261014T132346Z-1-001', '2026 NEW Website Galley and Canada workshops', 'feel the beat.png');

  if (fs.existsSync(iaoSrc)) {
    await sharp(iaoSrc).png({ quality: 90 }).toFile(path.join(brandDir, 'iao-logo.png'));
    console.log('Processed iao-logo.png');
  }
  if (fs.existsSync(ftbSrc)) {
    await sharp(ftbSrc).png({ quality: 90 }).toFile(path.join(brandDir, 'feel-the-beat.png'));
    console.log('Processed feel-the-beat.png');
  }

  // 2. Programmes
  const progDir = path.join(pub, 'programmes');
  if (!fs.existsSync(progDir)) fs.mkdirSync(progDir, { recursive: true });

  const batchSrc = path.join(base, '2026 NEW Website Galley and Canada workshops-20261014T132346Z-1-001', '2026 NEW Website Galley and Canada workshops', 'Batch Cover Image');
  
  const kidsSrc = path.join(batchSrc, 'Kid Programmer cover Image.jpg');
  if (fs.existsSync(kidsSrc)) {
    await sharp(kidsSrc).jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(progDir, 'kids-programme-cover.jpg'));
    console.log('Processed kids-programme-cover.jpg');
  }

  const adultSrc = path.join(batchSrc, 'Adult Programmer Cover image.jpg');
  if (fs.existsSync(adultSrc)) {
    await sharp(adultSrc).jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(progDir, 'adults-programme-cover.jpg'));
    console.log('Processed adults-programme-cover.jpg');
  }

  const kuchiSrc = path.join(batchSrc, 'IMG_0371.JPG');
  if (fs.existsSync(kuchiSrc)) {
    await sharp(kuchiSrc).jpeg({ quality: 85, mozjpeg: true }).toFile(path.join(progDir, 'kuchipudi-programme-cover.jpg'));
    console.log('Processed kuchipudi-programme-cover.jpg');
  }

  // 3. Studio Rental
  const rentalDir = path.join(pub, 'studio-rental');
  if (!fs.existsSync(rentalDir)) fs.mkdirSync(rentalDir, { recursive: true });

  const studioConv = path.join(base, 'studio_converted');
  if (fs.existsSync(path.join(studioConv, 'IMG_1327.jpg'))) {
    await sharp(path.join(studioConv, 'IMG_1327.jpg')).resize(1600, null, { withoutEnlargement: true }).jpeg({ quality: 85 }).toFile(path.join(rentalDir, 'studio-floor-wide.jpg'));
    console.log('Processed studio-floor-wide.jpg');
  }
  if (fs.existsSync(path.join(studioConv, 'IMG_1323.jpg'))) {
    await sharp(path.join(studioConv, 'IMG_1323.jpg')).resize(1600, null, { withoutEnlargement: true }).jpeg({ quality: 85 }).toFile(path.join(rentalDir, 'studio-floor-mirror.jpg'));
    console.log('Processed studio-floor-mirror.jpg');
  }

  // 4. Team Photos
  const teamDir = path.join(pub, 'team');
  if (!fs.existsSync(teamDir)) fs.mkdirSync(teamDir, { recursive: true });

  const teamSrcDir = path.join(base, '2026 NEW Website Galley and Canada workshops-20261014T132346Z-1-001', '2026 NEW Website Galley and Canada workshops', 'Team Photos');

  const teamMap = [
    { src: 'Nitish Kumar Founder & Artistic Director.jpg', dest: 'nitish-kumar.jpg' },
    { src: 'Amulya Rajendran Co-Founder & Legal Advisor.jpg', dest: 'amulya-rajendran.jpg' },
    { src: 'Swapna Sujit - Studio Manager.png', dest: 'swapna-sujit.jpg' },
    { src: 'Saurabh Sureka Director of Event Management.jpg', dest: 'saurabh-sureka.jpg' },
    { src: 'Sheel Awasthi- Strategic Partner.jpg', dest: 'sheel-awasthi.jpg' },
    { src: 'Meghna Menon Content Creator & Writer.jpg', dest: 'meghna-menon.jpg' },
    { src: 'Deepak Rao- Bollywood_ Freestyle.jpg', dest: 'deepak-rao.jpg' },
    { src: 'Kajal Devi Bollywood _Semi Classical _ Kids Specialist.jpg', dest: 'kajal-devi.jpg' },
    { src: 'Pranith Nair Hip hop _ Contemporary Trainer.jpg', dest: 'pranith-nair.jpg' },
    { src: 'Shailaja Puri- Dance and Fitness.jpg', dest: 'shailaja-puri.jpg' },
    { src: 'Srikanth Sree - gymnastic trainer.jpg', dest: 'srikanth-sree.jpg' },
    { src: 'Srushti Nidhi -Kuchipudi_.jpg', dest: 'srushti-nidhi.jpg' },
  ];

  for (const m of teamMap) {
    const sPath = path.join(teamSrcDir, m.src);
    if (fs.existsSync(sPath)) {
      await sharp(sPath).resize(800, 1000, { fit: 'cover', position: 'top' }).jpeg({ quality: 88 }).toFile(path.join(teamDir, m.dest));
      console.log(`Processed team: ${m.dest}`);
    } else {
      console.warn(`File not found: ${m.src}`);
    }
  }

  console.log('\nAll assets copied and optimized successfully!');
}

main().catch(console.error);
