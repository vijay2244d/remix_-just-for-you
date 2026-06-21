const fs = require('fs');

const logPath = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\7eb831a1-81be-4d0f-8d37-b34aab07c95b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, lineIdx) => {
    if (line.includes('extract_drive_ids_1781701169739')) {
      console.log(`FOUND in line ${lineIdx + 1}`);
      try {
        const obj = JSON.parse(line);
        console.log('--- TYPE ---', obj.type);
        if (obj.content) {
          console.log('--- CONTENT ---');
          console.log(obj.content);
        }
      } catch (e) {
        console.log('Snippet:');
        console.log(line.substring(0, 1000));
      }
    }
  });
} else {
  console.log('Log file not found.');
}
