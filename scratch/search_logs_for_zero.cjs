const fs = require('fs');
const path = require('path');

const logDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\7eb831a1-81be-4d0f-8d37-b34aab07c95b\\.system_generated\\logs';
const transcriptPath = path.join(logDir, 'transcript.jsonl');

if (!fs.existsSync(transcriptPath)) {
  console.log(`Transcript not found at ${transcriptPath}`);
  process.exit(1);
}

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
console.log(`Searching ${lines.length} lines in transcript...`);

let foundCount = 0;
lines.forEach((line, idx) => {
  if (line.toLowerCase().includes('zero')) {
    foundCount++;
    console.log(`Line ${idx + 1}:`);
    // Print a truncated portion of the line containing "zero"
    const start = Math.max(0, line.toLowerCase().indexOf('zero') - 200);
    const end = Math.min(line.length, line.toLowerCase().indexOf('zero') + 500);
    console.log(line.substring(start, end));
    console.log('--------------------------------------------------');
  }
});

console.log(`Found ${foundCount} lines referencing "zero".`);
