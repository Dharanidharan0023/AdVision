const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function compress() {
  const assetsDir = path.join(__dirname, 'src', 'assets');
  const profilePath = path.join(assetsDir, 'profile.png');
  const ytPath = path.join(assetsDir, 'YT1.png');

  if (fs.existsSync(profilePath)) {
    await sharp(profilePath).webp({ quality: 80 }).toFile(path.join(assetsDir, 'profile.webp'));
    console.log('profile.webp created');
  }
  if (fs.existsSync(ytPath)) {
    await sharp(ytPath).webp({ quality: 80 }).toFile(path.join(assetsDir, 'YT1.webp'));
    console.log('YT1.webp created');
  }
}

compress().catch(console.error);
