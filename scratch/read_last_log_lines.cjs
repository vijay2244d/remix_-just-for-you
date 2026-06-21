const fs = require('fs');

const logPath = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\7eb831a1-81be-4d0f-8d37-b34aab07c95b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.trim().split('\n');
  const lastLines = lines.slice(-40);
  console.log('--- LAST 40 LOG LINES ---');
  lastLines.forEach((l, idx) => {
    try {
      const obj = JSON.parse(l);
      console.log(`${lines.length - 40 + idx + 1} [${obj.source} - ${obj.type}]: ${obj.content ? obj.content.substring(0, 150) : ''}`);
      if (obj.tool_calls) {
        console.log(`   Tool Calls: ${JSON.stringify(obj.tool_calls)}`);
      }
    } catch(e) {
      console.log(`${lines.length - 40 + idx + 1}: ${l.substring(0, 150)}`);
    }
  });
} else {
  console.log('Log file not found.');
}
