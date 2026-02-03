const XLSX = require('xlsx');
const path = require('path');

const files = [
    { path: "c:/Users/f.husson/OneDrive - ONEPOINT/Documents/1.Florian/Antigravity/Site web - Attitude Émoi/Médias - Visuels/Calendrier éditorial - Attitude.xlsx", sheets: ["MAI 2025"] },
    { path: "c:/Users/f.husson/OneDrive - ONEPOINT/Documents/1.Florian/Antigravity/Site web - Attitude Émoi/Stratégies/Stratégie SEO/Clusters sémantiques.xlsx", sheets: null } // All sheets
];

files.forEach(fileDef => {
    try {
        console.log(`\n--- Inspecting: ${path.basename(fileDef.path)} ---`);
        const workbook = XLSX.readFile(fileDef.path);

        let sheetsToInspect = fileDef.sheets || workbook.SheetNames;

        console.log("Sheets:", workbook.SheetNames);

        sheetsToInspect.forEach(sheetName => {
            if (!workbook.SheetNames.includes(sheetName)) return;
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, limit: 10 });
            console.log(`\nSheet: "${sheetName}" (First 10 rows):`);
            console.log(JSON.stringify(data, null, 2));
        });

    } catch (error) {
        console.error(`Error reading ${path.basename(fileDef.path)}:`, error.message);
    }
});
