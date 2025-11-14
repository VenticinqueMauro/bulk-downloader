import sharp from 'sharp';
import { readFileSync } from 'fs';
import { join } from 'path';

const sizes = [16, 32, 48, 128];
// Using icon.svg as source would be better, but for now we'll keep the existing generated icons
// If you need to regenerate icons, you'll need to restore newIcon.png from git or use icon.svg
const pngBuffer = readFileSync(join(process.cwd(), 'icons', 'icon128.png'));

async function generateIcons() {
  console.log('🎨 Generating icons...\n');

  for (const size of sizes) {
    const outputPath = join(process.cwd(), 'icons', `icon${size}.png`);

    await sharp(pngBuffer)
      .resize(size, size, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .png()
      .toFile(outputPath);

    console.log(`✅ Generated icon${size}.png (${size}x${size})`);
  }

  console.log('\n🎉 All icons generated successfully!');
}

generateIcons().catch(console.error);
