const fs = require('fs');
const path = require('path');

const articlesDir = './content/articles';

// Get all MDX files
const mdxFiles = fs.readdirSync(articlesDir).filter(f => f.endsWith('.mdx'));

console.log('📝 Mise à jour des références d\'images dans les articles MDX...\n');

let updatedCount = 0;

for (const mdxFile of mdxFiles) {
    const filePath = path.join(articlesDir, mdxFile);
    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if it has a coverImage reference to uploads folder with png/jpg extension
    const regex = /(coverImage:\s*\/uploads\/[^\s]+)\.(png|jpg|jpeg)/gi;

    if (regex.test(content)) {
        const newContent = content.replace(regex, '$1.webp');
        fs.writeFileSync(filePath, newContent, 'utf-8');
        console.log(`✅ ${mdxFile} - coverImage mis à jour vers .webp`);
        updatedCount++;
    }
}

console.log(`\n✨ ${updatedCount} fichiers MDX mis à jour!`);
