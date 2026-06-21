const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';
const folders = fs.readdirSync(brainDir);

folders.forEach(folder => {
  const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
  if (fs.existsSync(logPath)) {
    const lines = fs.readFileSync(logPath, 'utf8').split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('PLAYLIST_SONGS') && line.includes('gdrive') && line.includes('const')) {
        try {
          const parsed = JSON.parse(line);
          if (parsed.content && parsed.content.includes('PLAYLIST_SONGS')) {
            console.log('--- Found PLAYLIST_SONGS in folder:', folder, 'Line:', idx + 1);
            console.log(parsed.content.substring(0, 1000));
            console.log('============================================');
          }
        } catch(e) {}
      }
    });
  }
});
