import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
// Inline logic to avoid module resolution issues
function determineCategories(title: string, description: string): string[] {
    const text = (title + " " + description).toLowerCase();

    // Define keywords for each main category
    const rules = [
        {
            category: "Masculinité & sensibilité",
            keywords: ["homme", "masculin", "virilité", "père", "garçon", "papa"]
        },
        {
            category: "Relations & attachement",
            keywords: ["relation", "couple", "amour", "anniversaire", "rupture", "dépendance", "attachement", "anxieux", "évitant", "toxique", "ex", "rencontre", "appli", "dating", "mère", "maman", "parents", "copine", "conjoint", "mari"]
        },
        {
            category: "Santé mentale",
            keywords: ["thérapie", "psy", "mental", "dépression", "burnout", "angoisse", "stress", "bien-être", "bonheur", "joie", "tristesse", "colère", "hpi", "hpe", "zèbre", "voyage", "sens"]
        },
        {
            category: "Hypersensibilité",
            keywords: ["hypersensib", "sensibili", "émotion", "overthinking", "pensée", "cerveau"]
        }
    ];

    const matched: string[] = [];
    for (const rule of rules) {
        if (rule.keywords.some(k => text.includes(k))) {
            matched.push(rule.category);
        }
    }
    return matched;
}

// Helper: Fix slugify to match standard
const slugify = (text: string) => {
    return text
        .toString()
        .toLowerCase()
        .normalize('NFD') // Split accented characters
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w-]+/g, '') // Remove all non-word chars
        .replace(/--+/g, '-') // Replace multiple - with single -
        .trim();
};

const episodesDir = path.join(process.cwd(), 'content/episodes');

if (!fs.existsSync(episodesDir)) {
    console.error(`Directory not found: ${episodesDir}`);
    process.exit(1);
}

const files = fs.readdirSync(episodesDir).filter(file => file.endsWith('.mdx'));
let updatedCount = 0;

console.log(`Scanning ${files.length} episodes...`);

for (const file of files) {
    const filePath = path.join(episodesDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Migration: Move 'category' to 'categories' if needed
    let categories: string[] = data.categories || [];
    if (data.category) {
        if (!categories.includes(data.category)) {
            categories.push(data.category);
        }
        delete data.category; // Remove old field
    }

    // Auto-detection (augment existing)
    const detected = determineCategories(data.title || '', data.description || content || '');

    // Merge unique
    categories = Array.from(new Set([...categories, ...detected]));

    if (categories.length > 0) {
        // Update data
        data.categories = categories;

        // Reconstruct file
        const newContent = matter.stringify(content, data);
        fs.writeFileSync(filePath, newContent);
        console.log(`✅ [${categories.join(', ')}] -> ${data.title}`);
        updatedCount++;
    } else {
        console.log(`⚠️ No categories found for: ${data.title}`);
    }
}

console.log(`\nDone! Updated ${updatedCount} episodes.`);
