const fs = require('fs');
const path = require('path');

const logDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\7eb831a1-81be-4d0f-8d37-b34aab07c95b\\.system_generated\\logs';
const transcriptPath = path.join(logDir, 'transcript.jsonl');

if (!fs.existsSync(transcriptPath)) {
  console.log(`Transcript not found at ${transcriptPath}`);
  process.exit(1);
}

const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n');
console.log(`Searching for original imageOrder...`);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    const content = obj.content || '';
    if (content.includes('const imageOrder = [') && content.includes('Akkam pakkam')) {
      console.log(`Found imageOrder at line ${i + 1} (step_index: ${obj.step_index})`);
      console.log(content);
      console.log('--------------------------------------------------');
      break;
    }
  } catch (e) {
    // Ignore parse error
  }
}
