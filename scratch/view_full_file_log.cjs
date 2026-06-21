const fs = require('fs');
const readline = require('readline');

const logPath = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\7eb831a1-81be-4d0f-8d37-b34aab07c95b\\.system_generated\\logs\\transcript.jsonl';

const fileStream = fs.createReadStream(logPath);
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

let lineIndex = 0;
rl.on('line', (line) => {
  lineIndex++;
  if (line.includes('jaalakkari') && (line.includes('gdrive') || line.includes('PLAYLIST_SONGS'))) {
    console.log('--- FOUND MATCH AT LINE:', lineIndex);
    // Find the gdrive string and print the surrounding 200 characters
    const idx = line.indexOf('jaalakkari');
    console.log(line.substring(Math.max(0, idx - 300), Math.min(line.length, idx + 800)));
  }
});
