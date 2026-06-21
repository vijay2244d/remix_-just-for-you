const fs = require('fs');
const readline = require('readline');

const path = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\5056ef58-a8c3-4979-b00c-79dbb749d74c\\.system_generated\\logs\\transcript.jsonl';

async function main() {
  const fileStream = fs.createReadStream(path);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  const found = new Set();
  
  for await (const line of rl) {
    // Find all occurrences of drive links
    const regex = /https:\/\/drive\.google\.com\/[a-zA-Z0-9_\-\/]+/gi;
    let match;
    while ((match = regex.exec(line)) !== null) {
      const url = match[0];
      if (!found.has(url)) {
        found.add(url);
        // Find the context (e.g. 150 chars before and after)
        const start = Math.max(0, match.index - 150);
        const end = Math.min(line.length, match.index + url.length + 150);
        const context = line.substring(start, end).replace(/\\n/g, '\n').replace(/\\"/g, '"');
        console.log(`URL: ${url}`);
        console.log(`Context:\n${context}\n-----------------------------------------`);
      }
    }
  }
}

main();
