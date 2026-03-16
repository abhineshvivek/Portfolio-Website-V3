import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'public', 'images');
const filesToProcess = ['Frame 1.png', 'Frame 2.png', 'Frame 3.png'];

async function processImages() {
    for (const file of filesToProcess) {
        const inputPath = path.join(directoryPath, file);
        const parsedPath = path.parse(inputPath);
        const outputPath = path.join(directoryPath, `${parsedPath.name}.webp`);

        console.log(`Processing ${file}...`);

        try {
            await sharp(inputPath)
                .webp({ quality: 80 }) // 80 is a good balance for compression vs quality
                .toFile(outputPath);

            const stats = fs.statSync(outputPath);
            console.log(`Successfully created ${parsedPath.name}.webp - Size: ${(stats.size / 1024).toFixed(2)} KB`);
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }
}

processImages();
