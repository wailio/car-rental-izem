const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../src/content/izem-reviews.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(sheet);

console.log('Total rows:', data.length);
console.log('Sample row 0:', JSON.stringify(data[0]));
console.log('Sample row 1:', JSON.stringify(data[1]));
console.log('Sample row 2:', JSON.stringify(data[2]));

// Check empty or short reviews
const emptyOrShort = data.filter((r, i) => !r.Reviews || String(r.Reviews).trim().length < 5);
console.log('Empty or very short reviews count:', emptyOrShort.length);
emptyOrShort.forEach((r, idx) => console.log(`Short ${idx}: Name=${r.Names}, Review=${r.Reviews}`));
