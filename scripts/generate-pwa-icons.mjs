import sharp from 'sharp';
import { mkdir, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const svg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" fill="#dc2626" rx="64"/>
  <text x="256" y="256" font-size="320" fill="white" text-anchor="middle" dominant-baseline="central" font-family="sans-serif" font-weight="bold">M</text>
</svg>`;

async function generateIcons() {
  const publicDir = join(__dirname, '..', 'public');

  await mkdir(publicDir, { recursive: true });

  await sharp(Buffer.from(svg))
    .resize(192, 192)
    .png()
    .toFile(join(publicDir, 'icon-192.png'));

  await sharp(Buffer.from(svg))
    .resize(512, 512)
    .png()
    .toFile(join(publicDir, 'icon-512.png'));

  console.log('PWA icons generated successfully!');
}

generateIcons().catch(console.error);