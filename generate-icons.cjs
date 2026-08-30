const sharp = require('sharp');
const { Jimp } = require('jimp');
const path = require('path');
const fs = require('fs');

const sizes = [192, 512];
const icoPath = path.join(__dirname, 'public', 'logopwa.ico');
const tempPng = path.join(__dirname, 'public', 'temp-ico.png');

async function generateIcons() {
  const img = await Jimp.read(icoPath);
  await img.write(tempPng);

  for (const size of sizes) {
    await sharp(tempPng)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, 'public', `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }

  fs.unlinkSync(tempPng);
  console.log('Done!');
}

generateIcons().catch(console.error);
