const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';
const folders = fs.readdirSync(brainDir);
const results = new Map();

folders.forEach(folder => {
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(logPath)) {
    try {
      const content = fs.readFileSync(logPath, 'utf8');
      // Look for patterns like: (name.mp3 - Google Drive) - https://drive.google.com/file/d/ID/view
      const regex = /([a-zA-Z0-9_\-\.\s\(\)]+\.mp3)\s+-\s+Google\s+Drive[^\n]*https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{33})/gi;
      let match;
      while ((match = regex.exec(content)) !== null) {
        const name = match[1].trim();
        const id = match[2];
        results.set(name.toLowerCase(), { name, id });
      }
    } catch(e) {}
  }
});

console.log('--- ALL EXTRACTED AUDIO DRIVE IDS ---');
const sorted = Array.from(results.values()).sort((a, b) => a.name.localeCompare(b.name));
sorted.forEach(item => {
  console.log(`  "${item.name}": "${item.id}"`);
});
