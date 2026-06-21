const fs = require('fs');
const html = fs.readFileSync('drive_source.html', 'utf8');

const results = {};
const idRegex = /\[null,"([a-zA-Z0-9_-]{33})"]/g;
let match;
let idsFound = 0;

while ((match = idRegex.exec(html)) !== null) {
  const fileId = match[1];
  const startIndex = match.index;
  idsFound++;
  
  // Look forward up to 1500 chars to find the filename with any extension
  const lookAheadArea = html.substring(startIndex, startIndex + 1500);
  const nameMatch = lookAheadArea.match(/\[\[\["([^"]+\.[a-zA-Z0-9]{2,4})",null/);
  
  if (nameMatch) {
    const filename = nameMatch[1];
    results[filename] = fileId;
  }
}

console.log(`Parsed ${idsFound} file IDs.`);
console.log(`Successfully mapped ${Object.keys(results).length} files of all types:`);

const sorted = Object.entries(results).sort((a, b) => a[0].localeCompare(b[0]));
for (const [name, id] of sorted) {
  console.log(`  "${name}": "${id}",`);
}
