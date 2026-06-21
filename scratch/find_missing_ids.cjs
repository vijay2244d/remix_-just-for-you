const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';
const folders = fs.readdirSync(brainDir);
const targets = [
  'akkam', 'thaandavam', 'thandavam', 'sirai', 'perfect', 
  'vaaranam', 'aaruyire', 'mulumathi', 'muzumathi', 'uyire', 
  'veera', 'por', 'ponvasantham', 'moochum', 'imaye', 'manpura', 'intro'
];

const results = {};

folders.forEach(folder => {
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(logPath)) {
    const lines = fs.readFileSync(logPath, 'utf8').split('\n');
    lines.forEach((line) => {
      targets.forEach(t => {
        if (line.toLowerCase().includes(t)) {
          // Look for 33 character IDs like 1BsU0ALH8...
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

console.log('--- Found Mappings in Logs ---');
for (const [k, v] of Object.entries(results)) {
  console.log(`"${k}":`, Array.from(v));
}
