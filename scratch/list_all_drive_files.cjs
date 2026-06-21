const fs = require('fs');
const html = fs.readFileSync('drive_source.html', 'utf8');

// Regex to find all aria-labels or tooltips that mention filenames
// Look for data-id="[33 chars]" and aria-label="... Audio" or data-tooltip="..."
const regex = /data-id="([a-zA-Z0-9_-]{33})"/g;
const fileMap = new Map();
let match;

while ((match = regex.exec(html)) !== null) {
  const id = match[1];
  const idx = match.index;
  // Look around the match index (1000 characters before and after)
  const context = html.substring(Math.max(0, idx - 1000), Math.min(html.length, idx + 1000));
  
  // Try to find filename
  const filenameMatch = context.match(/aria-label="([^"]+)"|data-tooltip="([^"]+)"|<strong class="DNoYtb">([^<]+)<\/strong>/);
  if (filenameMatch) {
    const filename = filenameMatch[1] || filenameMatch[2] || filenameMatch[3];
    if (filename && !filename.includes('Google Drive') && !filename.includes('Folder') && !filename.includes('folder')) {
      fileMap.set(id, filename);
    }
  }
}

console.log(`Found ${fileMap.size} files in drive_source.html:`);
const sorted = Array.from(fileMap.entries()).sort((a, b) => a[1].localeCompare(b[1]));
sorted.forEach(([id, name]) => {
  console.log(`  "${name}": "${id}"`);
});
