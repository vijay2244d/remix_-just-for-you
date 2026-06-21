const fs = require('fs');

const content = fs.readFileSync('scratch/recovered_songs_list.txt', 'utf8');

// Find all matches for key: val where val is gdrive(...) or array
const regex = /"([a-zA-Z0-9_\-\s]+)"\s*:\s*(gdrive\("([a-zA-Z0-9_-]{33})"\)|\[[\s\S]*?\])/g;
const matches = {};
let match;
while ((match = regex.exec(content)) !== null) {
  const key = match[1].trim();
  const val = match[2].trim().replace(/\s+/g, ' ');
  matches[key] = val;
}

console.log('--- RECOVERED MAPPINGS FROM FILE ---');
console.log(JSON.stringify(matches, null, 2));
