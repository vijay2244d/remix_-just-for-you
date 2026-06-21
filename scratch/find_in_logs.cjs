const fs = require('fs');
const readline = require('readline');

const fileStream = fs.createReadStream('C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain\\5056ef58-a8c3-4979-b00c-79dbb749d74c\\.system_generated\\logs\\transcript.jsonl');

const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity
});

rl.on('line', (line) => {
  if (line.includes('extracted_songs.json') || line.includes('Successfully mapped') || line.includes('PLAYLIST_SONGS')) {
    try {
      const obj = JSON.parse(line);
      console.log(`[TYPE: ${obj.type}]`);
      if (obj.tool_calls) {
        console.log(JSON.stringify(obj.tool_calls, null, 2));
      }
      if (obj.content) {
        // Log first 1000 characters of the content
        console.log(obj.content.substring(0, 1000));
      }
    } catch (e) {
      console.log('Error parsing line: ', e.message);
    }
  }
});
