import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

function createIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = ICO
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const entries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width >= 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height >= 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...entries, ...images.map((img) => img.buffer)]);
}

async function buildAllFavicons() {
  const size = 512;
  const padding = 16;
  const cardSize = size - padding * 2; // 480
  const radius = Math.round(cardSize * 0.23); // ~110 (Apple squircle radius)

  // 1. High quality vector squircle card
  const svgCard = `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="rgba(15,23,42,0.12)" />
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="rgba(15,23,42,0.08)" />
        </filter>
      </defs>
      <!-- Subtle shadow layer -->
      <rect x="${padding}" y="${padding}" width="${cardSize}" height="${cardSize}" rx="${radius}" ry="${radius}" fill="#FFFFFF" filter="url(#shadow)" />
      <!-- White card with crisp border -->
      <rect x="${padding}" y="${padding}" width="${cardSize}" height="${cardSize}" rx="${radius}" ry="${radius}" fill="#FFFFFF" stroke="rgba(0,0,0,0.08)" stroke-width="6" />
    </svg>
  `;

  // 2. Trim dz-logo.png to remove excess outer transparent space
  const trimmedLogoBuffer = await sharp('public/images/dz-logo.png')
    .trim()
    .toBuffer();

  const logoMeta = await sharp(trimmedLogoBuffer).metadata();
  const aspect = logoMeta.width / logoMeta.height; // ~1.232

  // DZ letters fill ~82% of card size so it's BIG and clear
  const targetLogoWidth = Math.round(cardSize * 0.82); // ~394
  const targetLogoHeight = Math.round(targetLogoWidth / aspect); // ~320

  const resizedLogo = await sharp(trimmedLogoBuffer)
    .resize(targetLogoWidth, targetLogoHeight, {
      fit: 'contain',
      kernel: 'lanczos3',
    })
    .toBuffer();

  const logoLeft = Math.round((size - targetLogoWidth) / 2);
  const logoTop = Math.round((size - targetLogoHeight) / 2);

  // 3. Composite master 512x512
  const master512Buffer = await sharp(Buffer.from(svgCard))
    .composite([
      {
        input: resizedLogo,
        top: logoTop,
        left: logoLeft,
      },
    ])
    .png()
    .toBuffer();

  console.log('✅ Master 512x512 generated');

  // 4. Generate all required sizes using lanczos3 for extreme clarity
  const png16 = await sharp(master512Buffer).resize(16, 16, { kernel: 'lanczos3' }).png().toBuffer();
  const png32 = await sharp(master512Buffer).resize(32, 32, { kernel: 'lanczos3' }).png().toBuffer();
  const png48 = await sharp(master512Buffer).resize(48, 48, { kernel: 'lanczos3' }).png().toBuffer();
  const png180 = await sharp(master512Buffer).resize(180, 180, { kernel: 'lanczos3' }).png().toBuffer();
  const png192 = await sharp(master512Buffer).resize(192, 192, { kernel: 'lanczos3' }).png().toBuffer();
  const png512 = master512Buffer;

  // 5. Generate multi-resolution ICO file (16, 32, 48)
  const icoBuffer = createIco([
    { width: 16, height: 16, buffer: png16 },
    { width: 32, height: 32, buffer: png32 },
    { width: 48, height: 48, buffer: png48 },
  ]);

  // 6. Save to public directory
  fs.writeFileSync('public/favicon.ico', icoBuffer);
  fs.writeFileSync('public/favicon-16x16.png', png16);
  fs.writeFileSync('public/favicon-32x32.png', png32);
  fs.writeFileSync('public/favicon-48x48.png', png48);
  fs.writeFileSync('public/apple-touch-icon.png', png180);
  fs.writeFileSync('public/android-chrome-192x192.png', png192);
  fs.writeFileSync('public/android-chrome-512x512.png', png512);
  fs.writeFileSync('public/icon.png', png512);

  // 7. Save to Next.js app directory
  fs.writeFileSync('src/app/favicon.ico', icoBuffer);
  fs.writeFileSync('src/app/apple-icon.png', png180);
  fs.writeFileSync('src/app/icon.png', png512);

  console.log('🎉 All favicon and app icon files have been successfully written to public/ and src/app/!');
}

buildAllFavicons().catch((err) => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
