const fs = require('fs');

const logPath = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\7eb831a1-81be-4d0f-8d37-b34aab07c95b\\.system_generated\\logs\\transcript.jsonl';

if (fs.existsSync(logPath)) {
  const content = fs.readFileSync(logPath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('list_browser_pages') || line.includes('PageId') || line.includes('tab')) {
      const match = line.match(/https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{33})/gi);
      if (match) {
        console.log(`Line ${idx + 1}: ${JSON.stringify(match)}`);
      }
    }
  });
} else {
  console.log('Log file not found.');
}
