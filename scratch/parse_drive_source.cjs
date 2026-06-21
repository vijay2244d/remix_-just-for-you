const fs = require('fs');

const html = fs.readFileSync('drive_source.html', 'utf8');
const results = {};

// Google Drive embeds file lists as JSON metadata.
// Filenames are typically stored as "filename.mp3" or in JSON arrays.
// Direct file IDs are 33-character alphanumeric strings containing underscores/dashes.

// Let's search for filenames ending in .mp3
const nameRegex = /"([^"\\\n]+\.(mp3|png|m4a|wav))/gi;
let match;
const foundNames = [];

while ((match = nameRegex.exec(html)) !== null) {
  const filename = match[1];
  foundNames.push({ name: filename, index: match.index });
}

console.log(`Found ${foundNames.length} name references in HTML.`);

// Try to pair each audio filename with the closest preceding 33-character Google Drive ID
foundNames.forEach(({ name, index }) => {
  const lookback = html.substring(Math.max(0, index - 5000), index + 1000);
  // Match any 33-character GDrive ID pattern [a-zA-Z0-9_-]{33}
  const idMatches = [...lookback.matchAll(/"([a-zA-Z0-9_-]{33})"/g)];
  if (idMatches.length > 0) {
    // Pick the last unique ID that isn't some known noise (e.g. folder ID itself)
    const folderId = "1eikhO0Uim9klIfGkLcnX-WB_6Hjp2GBA";
    const validIds = idMatches.map(m => m[1]).filter(id => id !== folderId);
    if (validIds.length > 0) {
      results[name] = validIds[validIds.length - 1]; // closest before/around name
    }
  }
});

console.log('--- EXTRACTED MAPPINGS ---');
const sorted = Object.entries(results).sort((a, b) => a[0].localeCompare(b[0]));
for (const [name, id] of sorted) {
  console.log(`"${name}": "${id}",`);
}

// Write to JSON
fs.writeFileSync('extracted_songs_from_source.json', JSON.stringify(results, null, 2));
console.log('Saved to extracted_songs_from_source.json');
