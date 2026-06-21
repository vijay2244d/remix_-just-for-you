const fs = require('fs');
const html = fs.readFileSync('drive_source.html', 'utf8');

const regex = /"([^"]+\.[a-zA-Z0-9]{3,4})"/g;
let match;
const extensions = new Set();
const files = [];

while ((match = regex.exec(html)) !== null) {
  const file = match[1];
  const ext = file.split('.').pop().toLowerCase();
  extensions.add(ext);
  if (ext !== 'mp3' && ext !== 'html' && ext !== 'js' && ext !== 'css') {
    files.push(file);
  }
}

console.log('Extensions found:', Array.from(extensions));
console.log('Non-MP3/HTML/JS/CSS files found in HTML source:', files);
