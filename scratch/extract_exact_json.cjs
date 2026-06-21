const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\7eb831a1-81be-4d0f-8d37-b34aab07c95b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, lineIdx) => {
    if (line.includes('1L9qEOwcTrVeeVcS9ihqNqGOHrrYOp_XG')) {
      console.log(`Found ID at line ${lineIdx + 1}`);
      try {
        const obj = JSON.parse(line);
        console.log('--- OBJ TYPE ---', obj.type);
        if (obj.content) {
          console.log('--- CONTENT ---');
          console.log(obj.content);
        }
        if (obj.tool_calls) {
          console.log('--- TOOL CALLS ---');
          console.log(JSON.stringify(obj.tool_calls, null, 2));
        }
      } catch (e) {
        console.log('Line snippet:');
        console.log(line.substring(0, 1000));
      }
    }
  });
} else {
  console.log('Log file not found.');
}
