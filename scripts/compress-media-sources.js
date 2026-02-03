const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const mediaDir = 'c:\\Users\\f.husson\\OneDrive - ONEPOINT\\Documents\\1.Florian\\Antigravity\\Site web - Attitude Émoi\\Médias - Visuels\\Calendrier éditorial\\Site web\\Articles';

async function compressMediaFolder() {
    console.log('🖼️  Compression des images sources...\n');

    let totalBefore = 0;
    let totalAfter = 0;
    let count = 0;

    // Get all subdirectories
    const subDirs = fs.readdirSync(mediaDir).filter(f =>
        fs.statSync(path.join(mediaDir, f)).isDirectory()
    );

    for (const subDir of subDirs) {
        const subDirPath = path.join(mediaDir, subDir);
        const files = fs.readdirSync(subDirPath).filter(f => /\.(png|jpg|jpeg)$/i.test(f));

        for (const imageName of files) {
            const inputPath = path.join(subDirPath, imageName);
            const outputName = imageName.replace(/\.(png|jpg|jpeg)$/i, '.webp');
            const outputPath = path.join(subDirPath, outputName);

            // Skip if webp already exists
            if (fs.existsSync(outputPath)) {
                console.log(`⏭️  ${imageName} - WebP existe déjà`);
                continue;
            }

            const inputStats = fs.statSync(inputPath);
            const inputSizeMB = inputStats.size / 1024 / 1024;
            totalBefore += inputSizeMB;

            try {
                await sharp(inputPath)
                    .webp({ quality: 80 })
                    .toFile(outputPath);

                const outputStats = fs.statSync(outputPath);
                const outputSizeMB = outputStats.size / 1024 / 1024;
                totalAfter += outputSizeMB;
                const reduction = (100 - (outputStats.size / inputStats.size * 100)).toFixed(1);

                console.log(`✅ ${imageName.substring(0, 35)}...`);
                console.log(`   ${inputSizeMB.toFixed(2)} MB → ${outputSizeMB.toFixed(2)} MB (-${reduction}%)\n`);
                count++;
            } catch (err) {
                console.error(`❌ Erreur pour ${imageName}:`, err.message);
                totalAfter += inputSizeMB;
            }
        }
    }

    console.log('─'.repeat(50));
    console.log(`✨ ${count} images compressées!`);
    console.log(`📊 Total avant: ${totalBefore.toFixed(2)} MB`);
    console.log(`📊 Total après: ${totalAfter.toFixed(2)} MB`);
    console.log(`📉 Réduction: ${(100 - (totalAfter / totalBefore * 100)).toFixed(1)}%`);
}

compressMediaFolder();
