const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\7eb831a1-81be-4d0f-8d37-b34aab07c95b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  let output = '';
  lines.forEach((line, lineIdx) => {
    let matchesTarget = false;
    const targets = ['sirai', 'thaandavam', 'pizhai', 'blood', 'oorum', 'por'];
    targets.forEach(t => {
      if (line.toLowerCase().includes(t.toLowerCase())) {
        matchesTarget = true;
      }
    });
    if (matchesTarget) {
      output += `Line ${lineIdx + 1}: ${line}\n\n`;
    }
  });
  fs.writeFileSync('scratch/target_log_mentions.txt', output);
  console.log('Successfully wrote to scratch/target_log_mentions.txt');
} else {
  console.log('Log file not found.');
}
