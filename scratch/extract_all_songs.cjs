const fs = require('fs');
const html = fs.readFileSync('drive_source.html', 'utf8');

// The pattern: [null,"ID"], followed by null,null,null,"audio/mpeg" (or similar), 
// and then further down, the name of the file like [[["2.mp3",null,1]]]
// Let's search for all file IDs first, which are 33-character strings like: 1[a-zA-Z0-9_-]{32}
// And let's find the nearest filename that occurs right after the ID.

const results = {};
const idRegex = /\[null,"([a-zA-Z0-9_-]{33})"]/g;
let match;
let idsFound = 0;

while ((match = idRegex.exec(html)) !== null) {
  const fileId = match[1];
  const startIndex = match.index;
  idsFound++;
  
  // Look forward up to 1500 chars to find the filename
  const lookAheadArea = html.substring(startIndex, startIndex + 1500);
  const nameMatch = lookAheadArea.match(/\[\[\["([^"]+\.(mp3|m4a|wav|mp4|ogg))",null,1]]]/);
  
  if (nameMatch) {
    const filename = nameMatch[1];
    results[filename] = fileId;
  }
}

console.log(`Parsed ${idsFound} file IDs.`);
console.log(`Successfully mapped ${Object.keys(results).length} audio files:`);

// Sort by filename
const sorted = Object.entries(results).sort((a, b) => a[0].localeCompare(b[0]));
for (const [name, id] of sorted) {
  console.log(`  "${name}": "${id}",`);
}

// Write the output to a JSON file for easy reading
fs.writeFileSync('extracted_songs.json', JSON.stringify(results, null, 2));
