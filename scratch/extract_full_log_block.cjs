const fs = require('fs');
const path = require('path');

const logPath = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\7eb831a1-81be-4d0f-8d37-b34aab07c95b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  let output = '';
  lines.forEach((line, lineIdx) => {
    if (line.includes('1L9qEOwcTrVeeVcS9ihqNqGOHrrYOp_XG') && line.includes('gdrive')) {
      try {
        const obj = JSON.parse(line);
        if (obj.content) {
          output += `=== LINE ${lineIdx + 1} CONTENT ===\n${obj.content}\n\n`;
        }
        if (obj.tool_calls) {
          output += `=== LINE ${lineIdx + 1} TOOL_CALLS ===\n${JSON.stringify(obj.tool_calls, null, 2)}\n\n`;
        }
      } catch (e) {
        output += `=== LINE ${lineIdx + 1} RAW ===\n${line}\n\n`;
      }
    }
  });
  fs.writeFileSync('scratch/recovered_songs_list.txt', output);
  console.log('Successfully wrote recovered list to scratch/recovered_songs_list.txt');
} else {
  console.log('Log file not found.');
}
