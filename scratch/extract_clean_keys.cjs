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
  if (lineIndex === 233) {
    try {
      const obj = JSON.parse(line);
      if (obj.tool_calls) {
        obj.tool_calls.forEach(tc => {
          if (tc.name === 'replace_file_content' && tc.args.TargetFile.includes('PlaylistLayout.tsx')) {
            fs.writeFileSync('scratch/playlist_songs_recovered.txt', tc.args.ReplacementContent);
            console.log('Saved to scratch/playlist_songs_recovered.txt');
          }
        });
      }
    } catch(e) {
      console.error(e);
    }
  }
});
