import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const sizes = [16, 32, 48, 128];
const svgBuffer = readFileSync(join(process.cwd(), 'icons', 'icon.svg'));

async function generateIcons() {
  console.log('🎨 Generating icons...\n');

  for (const size of sizes) {
    const outputPath = join(process.cwd(), 'icons', `icon${size}.png`);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated icon${size}.png (${size}x${size})`);
  }

  console.log('\n🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);
