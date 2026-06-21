const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';
const folders = fs.readdirSync(brainDir);

folders.forEach(folder => {
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(logPath)) {
    try {
      const content = fs.readFileSync(logPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, lineIdx) => {
        if (line.includes('Akkam pakkam') && line.includes('gdrive') && line.includes('vaaranam')) {
          console.log(`FOUND in folder ${folder} at line ${lineIdx + 1}`);
          try {
            const obj = JSON.parse(line);
            if (obj.tool_calls) {
              obj.tool_calls.forEach(tc => {
                if (tc.args && tc.args.ReplacementContent) {
                  console.log('--- REPLACEMENT CONTENT ---');
                  console.log(tc.args.ReplacementContent);
                }
                if (tc.args && tc.args.CodeContent) {
                  console.log('--- CODE CONTENT ---');
                  console.log(tc.args.CodeContent);
                }
              });
            } else if (obj.content && obj.content.includes('PLAYLIST_SONGS')) {
              console.log('--- CONTENT ---');
              console.log(obj.content);
            }
          } catch (e) {
            console.log('Line substring:');
            console.log(line.substring(0, 1000));
          }
        }
      });
    } catch (e) {
      // ignore
    }
  }
});
