const fs = require('fs');
const path = require('path');

function createVIcon() {
  const width = 32;
  const height = 32;

  // Pixel buffer: 32 rows, each row 32 pixels, bottom-to-top, BGRA format
  const pixels = Buffer.alloc(width * height * 4, 0);

  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= width || y < 0 || y >= height) return;
    // In BMP inside ICO, rows are stored bottom-to-top (y = 0 is bottom row)
    const bmpY = (height - 1 - y);
    const offset = (bmpY * width + x) * 4;
    pixels[offset + 0] = b;
    pixels[offset + 1] = g;
    pixels[offset + 2] = r;
    pixels[offset + 3] = a;
  }

  // Draw background: rounded rectangle with ink #1B1A17 (r:27, g:26, b:23)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Rounded corner check (radius 6)
      const inCornerTL = x < 6 && y < 6 && (x - 6) ** 2 + (y - 6) ** 2 > 36;
      const inCornerTR = x >= 26 && y < 6 && (x - 25) ** 2 + (y - 6) ** 2 > 36;
      const inCornerBL = x < 6 && y >= 26 && (x - 6) ** 2 + (y - 25) ** 2 > 36;
      const inCornerBR = x >= 26 && y >= 26 && (x - 25) ** 2 + (y - 25) ** 2 > 36;

      if (!inCornerTL && !inCornerTR && !inCornerBL && !inCornerBR) {
        // Subtle border check
        const isBorder = (x === 1 || x === 30 || y === 1 || y === 30);
        if (isBorder && ((x + y) % 3 !== 0)) {
          // Yellow tape accent #F3C94B (r:243, g:201, b:75)
          setPixel(x, y, 243, 201, 75, 180);
        } else {
          // Dark ink #1B1A17
          setPixel(x, y, 27, 26, 23, 255);
        }
      }
    }
  }

  // Draw 'V' shape
  // Left leg: from (6, 7) down to (14, 25) - Sheet paper #FBF7EA (r:251, g:247, b:234)
  for (let y = 7; y <= 25; y++) {
    const t = (y - 7) / (25 - 7);
    const leftX = Math.round(7 + t * 7);
    for (let w = 0; w < 4; w++) {
      setPixel(leftX + w, y, 251, 247, 234, 255);
    }
  }

  // Right leg: from (24, 7) down to (16, 25) - Carbon Blue #2540D9 (r:37, g:64, b:217)
  for (let y = 7; y <= 25; y++) {
    const t = (y - 7) / (25 - 7);
    const rightX = Math.round(23 - t * 7);
    for (let w = 0; w < 4; w++) {
      setPixel(rightX + w, y, 37, 64, 217, 255);
    }
  }

  // Vermilion stamp proof dot #D8381C (r:216, g:56, b:28) at top right
  for (let dy = -2; dy <= 2; dy++) {
    for (let dx = -2; dx <= 2; dx++) {
      if (dx * dx + dy * dy <= 4) {
        setPixel(24 + dx, 7 + dy, 216, 56, 28, 255);
      }
    }
  }

  // AND mask: 32 rows of 4 bytes each = 128 bytes (all 0 for 32-bit ARGB)
  const andMask = Buffer.alloc(width * height / 8, 0);

  // BITMAPINFOHEADER (40 bytes)
  const bih = Buffer.alloc(40);
  bih.writeUInt32LE(40, 0);          // biSize
  bih.writeInt32LE(width, 4);        // biWidth
  bih.writeInt32LE(height * 2, 8);    // biHeight (doubled for XOR + AND)
  bih.writeUInt16LE(1, 12);          // biPlanes
  bih.writeUInt16LE(32, 14);         // biBitCount
  bih.writeUInt32LE(0, 16);          // biCompression (BI_RGB)
  bih.writeUInt32LE(pixels.length + andMask.length, 20); // biSizeImage
  bih.writeInt32LE(0, 24);           // biXPelsPerMeter
  bih.writeInt32LE(0, 28);           // biYPelsPerMeter
  bih.writeUInt32LE(0, 32);          // biClrUsed
  bih.writeUInt32LE(0, 36);          // biClrImportant

  const imageBytes = Buffer.concat([bih, pixels, andMask]);

  // ICONDIR (6 bytes)
  const iconDir = Buffer.alloc(6);
  iconDir.writeUInt16LE(0, 0); // reserved
  iconDir.writeUInt16LE(1, 2); // type: 1 = ICO
  iconDir.writeUInt16LE(1, 4); // 1 image

  // ICONDIRENTRY (16 bytes)
  const entry = Buffer.alloc(16);
  entry.writeUInt8(width, 0);
  entry.writeUInt8(height, 1);
  entry.writeUInt8(0, 2); // color count
  entry.writeUInt8(0, 3); // reserved
  entry.writeUInt16LE(1, 4); // planes
  entry.writeUInt16LE(32, 6); // bpp
  entry.writeUInt32LE(imageBytes.length, 8); // bytes in res
  entry.writeUInt32LE(6 + 16, 12); // image offset (22)

  return Buffer.concat([iconDir, entry, imageBytes]);
}

const icoBuffer = createVIcon();

// Write to src/app/favicon.ico, public/favicon.ico
fs.writeFileSync(path.join(__dirname, '..', 'src', 'app', 'favicon.ico'), icoBuffer);
fs.writeFileSync(path.join(__dirname, '..', 'public', 'favicon.ico'), icoBuffer);

console.log('Successfully generated Case File "V" logo favicon.ico (' + icoBuffer.length + ' bytes)');
