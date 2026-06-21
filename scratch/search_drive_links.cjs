const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';

async function searchFile(filePath) {
  if (!fs.existsSync(filePath)) return [];
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  const matches = [];
  let lineNum = 0;
  
  for await (const line of rl) {
    lineNum++;
    if (line.includes('drive.google.com/file/d/')) {
      matches.push({ lineNum, line });
    }
  }
  return matches;
}

async function main() {
  const folders = fs.readdirSync(brainDir);
  console.log(`Searching for Google Drive links in ${folders.length} conversation folders...`);
  
  const allLinks = new Map();
  
  for (const folder of folders) {
    const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
    try {
      const matches = await searchFile(logPath);
      for (const m of matches) {
        // Find URLs
        const regex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{33})/gi;
        let match;
        while ((match = regex.exec(m.line)) !== null) {
          const id = match[1];
          // Try to extract name near it
          const start = Math.max(0, match.index - 150);
          const end = Math.min(m.line.length, match.index + 200);
          const context = m.line.substring(start, end).replace(/\\n/g, '\n').replace(/\\"/g, '"');
          allLinks.set(id, { folder, lineNum: m.lineNum, context });
        }
      }
    } catch (err) {
      // Ignore errors
    }
  }
  
  console.log(`\nFound ${allLinks.size} unique Google Drive file IDs:`);
  for (const [id, info] of allLinks.entries()) {
    console.log(`ID: ${id} (Found in folder ${info.folder}, line ${info.lineNum})`);
    console.log(`Context:\n${info.context}`);
    console.log('--------------------------------------------------');
  }
}

main();
