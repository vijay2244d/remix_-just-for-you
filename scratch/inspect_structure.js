const fs = require('fs');
const html = fs.readFileSync('drive_source.html', 'utf8');

// Find all occurrences of .mp3
const regex = /"([^"]+\.mp3)"/g;
let match;
const mp3Files = [];

while ((match = regex.exec(html)) !== null) {
  const name = match[1];
  const index = match.index;
  mp3Files.push({ name, index });
}

console.log(`Found ${mp3Files.length} references to .mp3 in HTML`);

// For the first few references, print the surrounding 2000 characters to see where the ID is stored
for (let i = 0; i < Math.min(5, mp3Files.length); i++) {
  const file = mp3Files[i];
  const start = Math.max(0, file.index - 1000);
  const end = Math.min(html.length, file.index + 1000);
  console.log(`\n======================================================`);
  console.log(`FILE: ${file.name} at index ${file.index}`);
  console.log(`======================================================`);
  console.log(html.substring(start, end));
}
