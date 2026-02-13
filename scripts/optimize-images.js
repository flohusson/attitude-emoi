
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const PUBLIC_DIR = path.join(process.cwd(), 'public');

// Recursively walk directory
async function walk(dir, fileList = []) {
    const files = await fs.promises.readdir(dir);
    for (const file of files) {
        const stat = await fs.promises.stat(path.join(dir, file));
        if (stat.isDirectory()) {
            fileList = await walk(path.join(dir, file), fileList);
        } else {
            if (file.match(/\.(jpg|jpeg|png|JPG|PNG)$/)) {
                fileList.push(path.join(dir, file));
            }
        }
    }
    return fileList;
}

async function optimizeImages() {
    console.log('Starting image optimization...');
    const images = await walk(PUBLIC_DIR);
    let convertedCount = 0;

    for (const imagePath of images) {
        const dir = path.dirname(imagePath);
        const ext = path.extname(imagePath);
        const name = path.basename(imagePath, ext);
        const webpPath = path.join(dir, `${name}.webp`);

        try {
            await fs.promises.access(webpPath);
            // console.log(`Skipping ${name}${ext}, WebP already exists.`);
        } catch (error) {
            // WebP does not exist, create it
            console.log(`Converting ${name}${ext} to WebP...`);
            try {
                await sharp(imagePath)
                    .webp({ quality: 80 })
                    .toFile(webpPath);
                convertedCount++;
                console.log(`✅ Created ${name}.webp`);
            } catch (err) {
                console.error(`❌ Failed to convert ${name}${ext}:`, err);
            }
        }
    }

    console.log(` Optimization complete. ${convertedCount} images converted to WebP.`);
}

optimizeImages();
