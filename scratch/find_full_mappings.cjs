const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\5056ef58-a8c3-4979-b00c-79dbb749d74c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('Successfully mapped') || line.includes('Parsed') || line.includes('extracted_songs')) {
    try {
      const obj = JSON.parse(line);
      if (obj.content && obj.content.includes('Successfully mapped')) {
        console.log('--- FOUND RUN OUTPUT ---');
        console.log(obj.content);
      }
    } catch (e) {
      // ignore
    }
  }
});
