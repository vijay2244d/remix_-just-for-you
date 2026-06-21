const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';
const folders = fs.readdirSync(brainDir);
const targets = ['sirai', 'thaandavam', 'pizhai', 'blood', 'oorum'];

folders.forEach(folder => {
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(logPath)) {
    try {
      const content = fs.readFileSync(logPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, lineIdx) => {
        let matchesTarget = false;
        targets.forEach(t => {
          if (line.toLowerCase().includes(t.toLowerCase())) {
            matchesTarget = true;
          }
        });
        if (matchesTarget && (line.includes('1') && line.match(/[a-zA-Z0-9_-]{33}/))) {
          // Look for any 33-character google drive ID
          const match = line.match(/[a-zA-Z0-9_-]{33}/g);
          if (match) {
            console.log(`FOUND in folder ${folder} line ${lineIdx + 1}:`);
            console.log(`  Line contains: ${line.substring(0, 300)}`);
            console.log(`  Possible IDs: ${JSON.stringify(match)}`);
          }
        }
      });
    } catch(e) {}
  }
});
