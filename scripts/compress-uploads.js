const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadsDir = './public/uploads';

async function compressUploads() {
    console.log('🖼️  Compression des images du dossier uploads...\n');

    const files = fs.readdirSync(uploadsDir);
    const imageFiles = files.filter(f => /\.(png|jpg|jpeg)$/i.test(f));

    let totalBefore = 0;
    let totalAfter = 0;
    let count = 0;

    for (const imageName of imageFiles) {
        const inputPath = path.join(uploadsDir, imageName);
        const outputName = imageName.replace(/\.(png|jpg|jpeg)$/i, '.webp');
        const outputPath = path.join(uploadsDir, outputName);

        const inputStats = fs.statSync(inputPath);
        const inputSizeMB = inputStats.size / 1024 / 1024;
        totalBefore += inputSizeMB;

        // Skip if already small (< 500KB)
        if (inputStats.size < 500000) {
            console.log(`⏭️  ${imageName} déjà petit (${inputSizeMB.toFixed(2)} MB), ignoré`);
            continue;
        }

        try {
            await sharp(inputPath)
                .webp({ quality: 80 })
                .toFile(outputPath);

            const outputStats = fs.statSync(outputPath);
            const outputSizeMB = outputStats.size / 1024 / 1024;
            totalAfter += outputSizeMB;
            const reduction = (100 - (outputStats.size / inputStats.size * 100)).toFixed(1);

            console.log(`✅ ${imageName.substring(0, 40)}...`);
            console.log(`   ${inputSizeMB.toFixed(2)} MB → ${outputSizeMB.toFixed(2)} MB (-${reduction}%)\n`);
            count++;
        } catch (err) {
            console.error(`❌ Erreur pour ${imageName}:`, err.message);
            totalAfter += inputSizeMB;
        }
    }

    console.log('─'.repeat(50));
    console.log(`✨ ${count} images compressées!`);
    console.log(`📊 Total avant: ${totalBefore.toFixed(2)} MB`);
    console.log(`📊 Total après: ${totalAfter.toFixed(2)} MB`);
    console.log(`📉 Réduction: ${(100 - (totalAfter / totalBefore * 100)).toFixed(1)}%`);
}

compressUploads();
