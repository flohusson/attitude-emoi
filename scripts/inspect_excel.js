const XLSX = require('xlsx');
const path = require('path');

const files = [
    "c:/Users/f.husson/OneDrive - ONEPOINT/Documents/1.Florian/Antigravity/Site web - Attitude Émoi/Médias - Visuels/Calendrier éditorial - Attitude.xlsx",
    "c:/Users/f.husson/OneDrive - ONEPOINT/Documents/1.Florian/Antigravity/Site web - Attitude Émoi/Stratégies/Stratégie SEO/Clusters sémantiques.xlsx"
];

files.forEach(filePath => {
    try {
        console.log(`\n--- Inspecting: ${path.basename(filePath)} ---`);
        const workbook = XLSX.readFile(filePath);
        console.log("Sheets:", workbook.SheetNames);

        workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, limit: 5 }); // Get first 5 rows as arrays
            console.log(`\nSheet: "${sheetName}" (First 5 rows):`);
            console.log(JSON.stringify(data, null, 2));
        });

    } catch (error) {
        console.error(`Error reading ${path.basename(filePath)}:`, error.message);
    }
});
