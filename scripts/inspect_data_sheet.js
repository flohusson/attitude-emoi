const XLSX = require('xlsx');
const filePath = "c:/Users/f.husson/OneDrive - ONEPOINT/Documents/1.Florian/Antigravity/Site web - Attitude Émoi/Stratégies/Stratégie SEO/Clusters sémantiques.xlsx";

try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = "Data";
    const worksheet = workbook.Sheets[sheetName];
    if (worksheet) {
        const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, limit: 10 });
        console.log(`\nSheet: "${sheetName}" (First 10 rows):`);
        console.log(JSON.stringify(data, null, 2));
    } else {
        console.log("Sheet 'Data' not found");
    }
} catch (error) {
    console.error("Error:", error);
}
