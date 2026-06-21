const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';
const targetSongs = ['por', 'sirai', 'thaandavam', 'pizhai', 'blood', 'oorum'];
const folders = fs.readdirSync(brainDir);

folders.forEach(folder => {
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(logPath)) {
    try {
      const content = fs.readFileSync(logPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((line, lineIdx) => {
        let matched = false;
        targetSongs.forEach(ts => {
          if (line.toLowerCase().includes(ts.toLowerCase())) {
            matched = true;
          }
        });
        if (matched && (line.includes('gdrive') || line.includes('/file/d/') || line.includes('google.com/file'))) {
          // Print snippet from the line
          const idx = line.indexOf('https://drive.google.com/file');
          if (idx !== -1) {
            console.log(`FOUND in ${folder} line ${lineIdx + 1}:`);
            console.log(line.substring(Math.max(0, idx - 100), Math.min(line.length, idx + 200)));
          }
          const idx2 = line.indexOf('gdrive(');
          if (idx2 !== -1) {
            console.log(`FOUND gdrive( in ${folder} line ${lineIdx + 1}:`);
            console.log(line.substring(Math.max(0, idx2 - 50), Math.min(line.length, idx2 + 100)));
          }
        }
      });
    } catch(e) {}
  }
});
