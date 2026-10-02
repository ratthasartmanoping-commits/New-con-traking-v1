import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  return table;
}

const crcTable = createCRC32Table();
function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createChunk(type, data) {
  const len = data.length;
  const buf = Buffer.alloc(8 + len + 4);
  buf.writeUInt32BE(len, 0);
  buf.write(type, 4, 4, 'ascii');
  data.copy(buf, 8);
  const typeAndData = buf.subarray(4, 8 + len);
  const crc = crc32(typeAndData);
  buf.writeUInt32BE(crc, 8 + len);
  return buf;
}

function makePng(width, height, getPixelRGBA) {
  // getPixelRGBA: (x, y) => [r, g, b, a]
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(height * rowBytes);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // Filter type 0 (None)
    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixelRGBA(x, y);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData, { level: 9 });

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // Bit depth
  ihdr[9] = 6; // Color type 6 (RGBA)
  ihdr[10] = 0; // Compression (deflate)
  ihdr[11] = 0; // Filter method
  ihdr[12] = 0; // Interlace (none)

  const header = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', deflated);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
}

// Generate Minimalist Brick App Icon with smooth rounded brick geometry, tactile texture and warm charcoal tone
function generateBrickIcon(size) {
  const cornerRadius = size * 0.22;
  const cx = size / 2;
  const cy = size / 2;

  // Brick symbol geometry (isometric/minimal block in center)
  const blockW = size * 0.44;
  const blockH = size * 0.44;
  const blockX = cx - blockW / 2;
  const blockY = cy - blockH / 2;
  const blockR = size * 0.08;

  return makePng(size, size, (x, y) => {
    // Distance from center for subtle circular vignette
    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const maxDist = size * 0.7;
    const vignette = 1 - Math.min(dist / maxDist, 1) * 0.25;

    // Base background: Dark tactile charcoal (#1A1918 to #262422)
    let r = Math.round((28 + (1 - y / size) * 12) * vignette);
    let g = Math.round((27 + (1 - y / size) * 12) * vignette);
    let b = Math.round((25 + (1 - y / size) * 12) * vignette);
    let a = 255;

    // Check if inside inner brick icon
    const inBlockX = x >= blockX && x <= blockX + blockW;
    const inBlockY = y >= blockY && y <= blockY + blockH;

    // Check rounded corners of the brick block
    let inBrick = false;
    if (inBlockX && inBlockY) {
      let cornerDx = 0;
      let cornerDy = 0;
      if (x < blockX + blockR) cornerDx = (blockX + blockR) - x;
      else if (x > blockX + blockW - blockR) cornerDx = x - (blockX + blockW - blockR);

      if (y < blockY + blockR) cornerDy = (blockY + blockR) - y;
      else if (y > blockY + blockH - blockR) cornerDy = y - (blockY + blockH - blockR);

      if (cornerDx === 0 || cornerDy === 0 || (cornerDx * cornerDx + cornerDy * cornerDy <= blockR * blockR)) {
        inBrick = true;
      }
    }

    if (inBrick) {
      // Warm stone cream with subtle gradient
      const brickProgress = (y - blockY) / blockH;
      r = Math.round(236 - brickProgress * 22);
      g = Math.round(233 - brickProgress * 22);
      b = Math.round(226 - brickProgress * 24);

      // Inner tactile indent dots (3 dots representing Brick detox)
      const dotSpacing = blockW / 4;
      const dotY = blockY + blockH * 0.65;
      const dotR = blockW * 0.06;

      for (let i = 1; i <= 3; i++) {
        const dotX = blockX + dotSpacing * i;
        const ddotX = x - dotX;
        const ddotY = y - dotY;
        if (ddotX * ddotX + ddotY * ddotY <= dotR * dotR) {
          // Dark recessed dot
          r = 38;
          g = 36;
          b = 34;
        }
      }

      // Slanted roof cut or arch in brick
      const archTop = blockY + blockH * 0.22;
      const archBot = blockY + blockH * 0.44;
      const archW = blockW * 0.4;
      const dArchX = Math.abs(x - cx);
      if (y >= archTop && y <= archBot && dArchX <= archW / 2) {
        r = 38;
        g = 36;
        b = 34;
      }
    }

    return [r, g, b, a];
  });
}

// Generate Mockup Screen @3x (1320 x 2868 px) with exact Safe Area
function generateMockupScreen3x() {
  const width = 1320;
  const height = 2868;
  const safeTop = 177; // 59pt * 3
  const safeBottom = 102; // 34pt * 3
  const islandW = 375;
  const islandH = 105;
  const islandX = (width - islandW) / 2;
  const islandY = 36;

  console.log(`Generating @3x Screen Mockup: ${width}x${height} with Safe Area (Top: ${safeTop}px, Bottom: ${safeBottom}px)...`);

  return makePng(width, height, (x, y) => {
    // Dynamic Island
    if (x >= islandX && x <= islandX + islandW && y >= islandY && y <= islandY + islandH) {
      const cornerR = islandH / 2;
      let cdx = 0;
      if (x < islandX + cornerR) cdx = (islandX + cornerR) - x;
      else if (x > islandX + islandW - cornerR) cdx = x - (islandX + islandW - cornerR);
      const cdy = Math.abs(y - (islandY + cornerR));
      if (cdx === 0 || (cdx * cdx + cdy * cdy <= cornerR * cornerR)) {
        return [0, 0, 0, 255];
      }
    }

    // Home indicator at bottom
    const homeW = 420;
    const homeH = 15;
    const homeX = (width - homeW) / 2;
    const homeY = height - 48;
    if (x >= homeX && x <= homeX + homeW && y >= homeY && y <= homeY + homeH) {
      return [30, 29, 27, 230];
    }

    // Navigation bar background (bottom safe area)
    if (y >= height - 280) {
      return [221, 217, 208, 255]; // #DDD9D0
    }

    // Main surface card (#ECE9E2)
    return [236, 233, 226, 255];
  });
}

// Create directories and write files
const publicDir = path.resolve('public');
const iconsDir = path.join(publicDir, 'icons');
const exportsDir = path.join(publicDir, 'exports');

if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

console.log('Writing app icons at various resolutions...');

const icon180 = generateBrickIcon(180); // @3x iPhone 60pt
fs.writeFileSync(path.join(iconsDir, 'icon-180x180.png'), icon180);
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), icon180);
console.log('Saved icon-180x180.png and apple-touch-icon.png');

const icon120 = generateBrickIcon(120); // @3x Spotlight 40pt
fs.writeFileSync(path.join(iconsDir, 'icon-120x120.png'), icon120);
console.log('Saved icon-120x120.png');

const icon60 = generateBrickIcon(60); // @3x Notification 20pt
fs.writeFileSync(path.join(iconsDir, 'icon-60x60.png'), icon60);
console.log('Saved icon-60x60.png');

const icon1024 = generateBrickIcon(512); // High-res master
fs.writeFileSync(path.join(iconsDir, 'icon-1024x1024.png'), icon1024);
console.log('Saved icon-1024x1024.png');

// Also write an SVG favicon
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" width="180" height="180">
  <rect width="180" height="180" rx="40" fill="#1A1918"/>
  <rect x="42" y="42" width="96" height="96" rx="18" fill="#ECE9E2"/>
  <rect x="66" y="62" width="48" height="24" rx="6" fill="#1A1918"/>
  <circle cx="68" cy="108" r="7" fill="#1A1918"/>
  <circle cx="90" cy="108" r="7" fill="#1A1918"/>
  <circle cx="112" cy="108" r="7" fill="#1A1918"/>
</svg>`;
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgIcon);
console.log('Saved favicon.svg');

console.log('All asset files generated successfully.');
