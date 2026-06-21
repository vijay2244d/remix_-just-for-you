const fs = require('fs');
const path = require('path');
const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';

const targets = ['sirai', 'varanam', 'vaaranam', 'naan pizhai', 'oorum blood', 'oorumblood'];
const results = new Set();

const folders = fs.readdirSync(brainDir);
folders.forEach(folder => {
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (!fs.existsSync(logPath)) return;
  
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  
  lines.forEach((line, idx) => {
    const lower = line.toLowerCase();
    const hasTarget = targets.some(t => lower.includes(t.toLowerCase()));
    if (hasTarget && lower.includes('drive.google.com')) {
      // Extract file IDs
      const matches = line.match(/\/d\/([A-Za-z0-9_-]{25,50})/g);
      if (matches) {
        matches.forEach(m => {
          const id = m.replace('/d/', '');
          // Get context
          const context = line.substring(Math.max(0, line.indexOf(id) - 100), Math.min(line.length, line.indexOf(id) + 50));
          results.add(`ID: ${id} | CONTEXT: ${context.substring(0, 150)}`);
        });
      }
    }
    // Also look for specific named pages
    if (lower.includes('sirai trimmed') || lower.includes('varanam aairam') || lower.includes('vaaranam aairam')) {
      const snippet = line.substring(0, 300);
      console.log('FOUND LINE:', snippet);
    }
  });
});

console.log('\nAll unique IDs found with context:');
[...results].forEach(r => console.log(r));
