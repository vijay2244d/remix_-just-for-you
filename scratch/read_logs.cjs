const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\5056ef58-a8c3-4979-b00c-79dbb749d74c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  try {
    const obj = JSON.parse(line);
    if (obj.type === 'USER_INPUT') {
      console.log(`[USER] ${obj.content}`);
    } else if (obj.type === 'PLANNER_RESPONSE' || obj.type === 'MODEL_RESPONSE') {
      // Clean up markdown responses or print first line
      const firstLine = obj.content ? obj.content.split('\n')[0] : '';
      console.log(`[MODEL] ${firstLine}`);
    }
  } catch (e) {
    // Ignore invalid JSON lines
  }
});
