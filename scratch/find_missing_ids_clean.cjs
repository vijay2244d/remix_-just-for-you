const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';
const folders = fs.readdirSync(brainDir);
const targets = ['thandavam', 'thaandavam', 'sirai', 'neelothi', 'por'];
const results = {};

folders.forEach(folder => {
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(logPath)) {
    const lines = fs.readFileSync(logPath, 'utf8').split('\n');
    lines.forEach((line) => {
      targets.forEach(t => {
        if (line.toLowerCase().includes(t)) {
          const match = line.match(/1[a-zA-Z0-9_-]{32}/g);
          if (match) {
            if (!results[t]) results[t] = new Set();
            match.forEach(id => results[t].add(id));
          }
        }
      });
    });
  }
});

let out = '';
for (const [k, v] of Object.entries(results)) {
  out += `"${k}": ${JSON.stringify(Array.from(v))}\n`;
}
fs.writeFileSync('scratch/missing_ids_clean.txt', out);
console.log('Saved to scratch/missing_ids_clean.txt');
