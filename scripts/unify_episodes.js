const fs = require('fs');
const path = require('path');

const EPISODES_DIR = 'c:\\Users\\f.husson\\OneDrive - ONEPOINT\\Documents\\1.Florian\\Antigravity\\Site web - Attitude Émoi\\attitude-emoi-platform\\content\\episodes';
const OUTPUT_FILE = 'c:\\Users\\f.husson\\.gemini\\antigravity\\brain\\6da9814e-6df8-473e-9acf-8bfb4421979b\\attitude_complete_sources.txt';

// List of filenames to INCLUDE (excluding the 2 deleted ones: 'comment-mon-chat-mapporte...' and 'reprendre-ses-etudes...')
// I will verify the filenames based on the previous list_dir output.
const FILES_TO_INCLUDE = [
    "se-decouvrir-hypersensible-a-28-ans-reconnaitre-les-signes-de-lhypersensibilite.mdx",
    "dependance-affective-comment-la-reperer-et-se-liberer-de-cette-situation-toxique.mdx",
    // "comment-mon-chat-mapporte-une-stabilite-emotionnelle.mdx", // DELETED
    "relation-mere-enfant-hypersensibilite-et-attachement-a-ma-maman.mdx",
    "surmonter-loverthinking-comment-gerer-quand-mon-cerveau-laisse-place-aux-emotions.mdx",
    "relation-a-mon-papa-hommes-hypersensibles-de-pere-en-fils.mdx",
    "hypersensible-dans-les-relations-amoureuses-sattacher-trop-vite-aimer-trop-fort.mdx",
    // "reprendre-ses-etudes-pour-donner-du-sens-a-sa-vie.mdx", // DELETED
    "applis-de-rencontre-relations-rapides-et-perte-destime-de-soi.mdx",
    "comment-gerer-la-vie-de-couple-quand-on-est-hypersensible.mdx",
    "mon-premier-voyage-en-solo.mdx",
    "pourquoi-jai-arrete-temporairement-mon-podcast-attitude-.mdx",
    "comprendre-lattachement-anxieux-relations-attachements-emotionnels-et-dependance-affective.mdx",
    "comment-jai-fait-face-a-mes-peurs-pour-lancer-mon-podcast-attitude.mdx",
    "hypersensible-au-masculin-faites-place-aux-emotions-masculines.mdx",
    "pourquoi-jai-decide-de-commencer-une-therapie.mdx",
    "suis-je-hypersensible-les-5-signes-qui-mettent-sur-la-voie.mdx",
    "je-suis-hypersensible-et-maintenant-le-passage-a-laction-apres-la-prise-de-conscience.mdx"
];

let fullContent = "# TEXTES INTÉGRAUX DES ÉPISODES (SOURCE DE VÉRITÉ)\n\n";

FILES_TO_INCLUDE.forEach((filename, index) => {
    try {
        const filePath = path.join(EPISODES_DIR, filename);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            // Basic clean up: remove frontmatter (between --- and ---)
            const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---/, '');

            fullContent += `\n\n===================================================================\n`;
            fullContent += `EPISODE SOURCE ${index + 1} : ${filename.replace('.mdx', '')}\n`;
            fullContent += `===================================================================\n\n`;
            fullContent += contentWithoutFrontmatter.trim();
        } else {
            console.log(`Warning: File not found: ${filename}`);
        }
    } catch (e) {
        console.error(`Error reading ${filename}: ${e.message}`);
    }
});

fs.writeFileSync(OUTPUT_FILE, fullContent, 'utf-8');
console.log(`Successfully created ${OUTPUT_FILE}`);
