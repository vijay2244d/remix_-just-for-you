const fs = require('fs');
const html = fs.readFileSync('drive_source.html', 'utf8');

// Broad search for image extensions case insensitively
const imageRegex = /"([^"]+\.(png|jpg|jpeg|webp|gif))"/gi;
let match;
const foundImages = [];

while ((match = imageRegex.exec(html)) !== null) {
  foundImages.push(match[1]);
}

console.log('Image files found in Google Drive HTML source:', foundImages);
