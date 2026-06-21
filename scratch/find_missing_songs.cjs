const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';
const missingKeys = [
  'naan',
  'pizhai',
  'oorum',
  'blood'
];

const folders = fs.readdirSync(brainDir);
const results = {};

folders.forEach(folder => {
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(logPath)) {
    try {
      const content = fs.readFileSync(logPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach(line => {
        missingKeys.forEach(key => {
          if (line.toLowerCase().includes(key.toLowerCase()) && (line.includes('gdrive(') || line.includes('/file/d/'))) {
            const match = line.match(/gdrive\(\"([a-zA-Z0-9_-]{33})\"\)/g) || 
                          line.match(/gdrive\(\\\"([a-zA-Z0-9_-]{33})\\"\)/g);
            if (match) {
              if (!results[key]) results[key] = new Set();
              match.forEach(m => {
                const clean = m.replace(/\\"/g, '"');
                results[key].add(clean);
              });
            }
          }
        });
      });
    } catch (e) {
      // ignore
    }
  }
});

console.log('--- EXTRACTED NEW SONGS GDRIVE MAPPINGS ---');
for (const key of Object.keys(results)) {
  console.log(`${key}:`);
  Array.from(results[key]).forEach(val => {
    console.log(`  ${val}`);
  });
}
