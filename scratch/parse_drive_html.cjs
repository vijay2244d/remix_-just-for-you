const fs = require('fs');
const html = fs.readFileSync('C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\5056ef58-a8c3-4979-b00c-79dbb749d74c\\.system_generated\\steps\\348\\content.md', 'utf8');

// Strategy: Find all filenames first, then look backward for the nearest file ID
const results = {};
const nameRegex = /\[\[\["([^"]+\.(mp3|m4a|wav|mp4|ogg))",null,1\]\]\]/g;
let match;

while ((match = nameRegex.exec(html)) !== null) {
  const filename = match[1];
  const endIndex = match.index;
  
  // Look backward up to 2000 chars to find the nearest file ID
  const lookBackStart = Math.max(0, endIndex - 2000);
  const lookBackArea = html.substring(lookBackStart, endIndex);
  
  // Find ALL IDs in the lookback area and take the LAST one (closest to the filename)
  const idMatches = [...lookBackArea.matchAll(/\[null,"([a-zA-Z0-9_-]{33})"\]/g)];
  
  if (idMatches.length > 0) {
    const lastId = idMatches[idMatches.length - 1][1];
    if (!results[filename]) {
      results[filename] = lastId;
    }
  }
}

const sorted = Object.entries(results).sort((a, b) => a[0].localeCompare(b[0]));
console.log(`Found ${sorted.length} audio files:`);
for (const [name, id] of sorted) {
  console.log(`  "${name}": "${id}"`);
}
