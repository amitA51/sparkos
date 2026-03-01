import sharp from 'sharp';
import { readFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const publicDir = join(rootDir, 'public');
const imagesDir = join(publicDir, 'images');

// Ensure images directory exists
mkdirSync(imagesDir, { recursive: true });

// Read the SVG logo
const svgPath = join(publicDir, 'logos', 'ignited-core.svg');
const svgBuffer = readFileSync(svgPath);

// Icon sizes to generate
const sizes = [
    { name: 'spark192.png', size: 192 },
    { name: 'spark512.png', size: 512 },
    { name: 'shortcut-icon.png', size: 96 }  // For shortcuts, smaller icon
];

async function generateIcons() {
    console.log('Generating PWA icons from SVG logo...\n');

    for (const { name, size } of sizes) {
        const outputPath = join(imagesDir, name);

        await sharp(svgBuffer)
            .resize(size, size)
            .png()
            .toFile(outputPath);

        console.log(`✓ Generated ${name} (${size}x${size})`);
    }

    console.log('\n✅ All icons generated successfully!');
}

generateIcons().catch(console.error);
