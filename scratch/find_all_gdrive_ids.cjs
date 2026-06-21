const fs = require('fs');
const path = require('path');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';
const mappings = {};

function scanFile(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return;
    
    // Only parse text-like files, logs, md files
    const ext = path.extname(filePath).toLowerCase();
    if (!['.txt', '.json', '.md', '.jsonl', '.ts', '.tsx', '.js', '.cjs'].includes(ext)) return;
    
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Look for gdrive("ID")
    const gdriveRegex = /gdrive\(\"([a-zA-Z0-9_-]{33})\"\)/g;
    let match;
    while ((match = gdriveRegex.exec(content)) !== null) {
      const id = match[1];
      // Try to find if there is a filename or key nearby
      const start = Math.max(0, match.index - 100);
      const end = Math.min(content.length, match.index + 150);
      const context = content.substring(start, end).replace(/\n/g, ' ').replace(/\s+/g, ' ');
      
      if (!mappings[id]) {
        mappings[id] = new Set();
      }
      mappings[id].add(context);
    }
    
    // Look for drive.google.com/file/d/ID
    const urlRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]{33})/g;
    while ((match = urlRegex.exec(content)) !== null) {
      const id = match[1];
      const start = Math.max(0, match.index - 100);
      const end = Math.min(content.length, match.index + 150);
      const context = content.substring(start, end).replace(/\n/g, ' ').replace(/\s+/g, ' ');
      
      if (!mappings[id]) {
        mappings[id] = new Set();
      }
      mappings[id].add(context);
    }
  } catch (e) {
    // ignore
  }
}

function walkDir(dir) {
  try {
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walkDir(fullPath);
      } else {
        scanFile(fullPath);
      }
    });
  } catch (e) {
    // ignore
  }
}

console.log('Scanning all files in brain directory:', brainDir);
walkDir(brainDir);

console.log('\n=== ALL UNIQUE FILE IDS AND CONTEXTS FOUND ===');
for (const [id, contexts] of Object.entries(mappings)) {
  console.log(`\nID: ${id}`);
  Array.from(contexts).forEach(ctx => {
    console.log(`  Context: ${ctx.substring(0, 150)}`);
  });
}
console.log('\nScan complete.');
