const fs = require('fs');
const path = require('path');

const logDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\7eb831a1-81be-4d0f-8d37-b34aab07c95b\\.system_generated\\logs';
const transcriptPath = path.join(logDir, 'transcript.jsonl');

if (!fs.existsSync(transcriptPath)) {
  console.log(`Transcript not found at ${transcriptPath}`);
  process.exit(1);
}

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
console.log(`Searching user inputs...`);

lines.forEach((line) => {
  if (line.trim()) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT') {
        console.log(`Step ${obj.step_index} (${obj.created_at || ''}):`);
        console.log(obj.content);
        console.log('--------------------------------------------------');
      }
    } catch (e) {
      // Ignore parse error
    }
  }
});
