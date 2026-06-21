const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\5056ef58-a8c3-4979-b00c-79dbb749d74c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let lineCount = 0;
rl.on('line', (line) => {
  if (lineCount < 40) {
    try {
      const obj = JSON.parse(line);
      if (obj.type === 'USER_INPUT') {
        console.log(`[USER] ${obj.content}`);
      } else if (obj.type === 'PLANNER_RESPONSE' || obj.type === 'MODEL_RESPONSE') {
        const firstLine = obj.content ? obj.content.split('\n')[0] : '';
        console.log(`[MODEL] ${firstLine}`);
      }
    } catch (e) {
      // Ignore
    }
    lineCount++;
  } else {
    rl.close();
  }
});
