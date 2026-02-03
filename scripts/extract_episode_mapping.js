const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = "c:/Users/f.husson/OneDrive - ONEPOINT/Documents/1.Florian/Antigravity/Site web - Attitude Émoi/Stratégies/Stratégie SEO/Clusters sémantiques.xlsx";
const outputPath = "c:/Users/f.husson/OneDrive - ONEPOINT/Documents/1.Florian/Antigravity/Site web - Attitude Émoi/attitude-emoi-platform/src/lib/episode-mapping.ts";

try {
    const workbook = XLSX.readFile(filePath);
    const sheetNames = workbook.SheetNames;
    console.log("Available sheets:", sheetNames);
    const sheetName = sheetNames.find(s => s.toLowerCase().includes("liste") && s.toLowerCase().includes("pisode"));

    if (!sheetName) {
        throw new Error(`Sheet containing "Liste" and "pisode" not found in: ${sheetNames.join(', ')}`);
    }

    console.log(`Found sheet: "${sheetName}"`);
    const worksheet = workbook.Sheets[sheetName];

    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Find column indices
    const headers = data[0];
    const idxNum = headers.findIndex(h => h && h.toString().includes("Numéro"));
    const idxTitle = headers.findIndex(h => h && h.toString().includes("Titre"));
    const idxMainKw = headers.findIndex(h => h && h.toString().includes("Mot clé principal (Validé)"));
    const idxSecKw = headers.findIndex(h => h && h.toString().includes("Mots clés secondaires"));

    const episodes = [];

    // Skip header row
    for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (!row || !row[idxNum]) continue;

        const mainKw = row[idxMainKw];
        const secKwRaw = row[idxSecKw];

        // Clean secondary keywords (split by comma if string)
        let secKws = [];
        if (typeof secKwRaw === 'string') {
            secKws = secKwRaw.split(',').map(s => s.trim()).filter(s => s);
        }

        if (mainKw) {
            episodes.push({
                number: row[idxNum],
                title: row[idxTitle],
                mainKeyword: mainKw,
                secondaryKeywords: secKws
            });
        }
    }

    const tsContent = `export const EPISODE_MAPPING = ${JSON.stringify(episodes, null, 4)};\n`;

    // Ensure directory exists (src/lib usually exists)
    fs.writeFileSync(outputPath, tsContent);
    console.log(`Extracted ${episodes.length} episodes to ${outputPath}`);

} catch (error) {
    console.error("Error extracting mapping:", error);
}
