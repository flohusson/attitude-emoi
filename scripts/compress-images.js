const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const imagesDir = './public/images';

const imagesToCompress = [
    'florian-portrait.png',
    'podcast-bg.png',
    'homepage-hero.png',
    'attitude-podcast.jpg',
    'blog-bg.png',
    'home-banner.png',
    'home-banner-v2.png'
];

async function compressImages() {
    console.log('🖼️  Compression des images...\n');

    for (const imageName of imagesToCompress) {
        const inputPath = path.join(imagesDir, imageName);
        const outputName = imageName.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        const outputPath = path.join(imagesDir, outputName);

        if (!fs.existsSync(inputPath)) {
            console.log(`⚠️  ${imageName} non trouvé, ignoré`);
            continue;
        }

        const inputStats = fs.statSync(inputPath);
        const inputSizeMB = (inputStats.size / 1024 / 1024).toFixed(2);

        try {
            await sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath);

            const outputStats = fs.statSync(outputPath);
            const outputSizeMB = (outputStats.size / 1024 / 1024).toFixed(2);
            const reduction = (100 - (outputStats.size / inputStats.size * 100)).toFixed(1);

            console.log(`✅ ${imageName}`);
            console.log(`   ${inputSizeMB} MB → ${outputSizeMB} MB (-${reduction}%)`);
            console.log(`   Sauvé: ${outputName}\n`);
        } catch (err) {
            console.error(`❌ Erreur pour ${imageName}:`, err.message);
        }
    }

    console.log('✨ Compression terminée!');
}

compressImages();
