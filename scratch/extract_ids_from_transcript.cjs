const fs = require('fs');
const readline = require('readline');

const path = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\5056ef58-a8c3-4979-b00c-79dbb749d74c\\.system_generated\\logs\\transcript.jsonl';

async function main() {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  const results = new Map();
  
  for await (const line of rl) {
    // Look for patterns like: (Song Name - Google Drive) - https://drive.google.com/file/d/ID/view
    // or similar drive file URL patterns
    const regex = /([a-zA-Z0-9_\-\.\s\(\)]+)\s+-\s+Google\s+Drive[^\n]*https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{33})/gi;
    let match;
    while ((match = regex.exec(line)) !== null) {
      const name = match[1].trim();
      const id = match[2];
      results.set(name, id);
    }
  }
  
  console.log(`Extracted ${results.size} unique file IDs from transcript:`);
  for (const [name, id] of results.entries()) {
    console.log(`  "${name}": "${id}"`);
  }
}

main();
