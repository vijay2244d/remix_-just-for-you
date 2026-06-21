const fs = require('fs');

if (fs.existsSync('scratch/target_log_mentions.txt')) {
  const content = fs.readFileSync('scratch/target_log_mentions.txt', 'utf8');
  const regexLink = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{33})/gi;
  const regexGdrive = /gdrive\(\\\"([a-zA-Z0-9_-]{33})\\\"\)/gi;
  const regexGdriveNormal = /gdrive\(\"([a-zA-Z0-9_-]{33})\"\)/gi;
  
  const found = new Set();
  
  let match;
  while ((match = regexLink.exec(content)) !== null) {
    found.add(match[0]);
  }
  while ((match = regexGdrive.exec(content)) !== null) {
    found.add(match[0].replace(/\\"/g, '"'));
  }
  while ((match = regexGdriveNormal.exec(content)) !== null) {
    found.add(match[0]);
  }
  
  console.log('--- FOUND UNIQUE DRIVE IDS / LINKS ---');
  found.forEach(item => {
    console.log(item);
  });
} else {
  console.log('File not found.');
}
