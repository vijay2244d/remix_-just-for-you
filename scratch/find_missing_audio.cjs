const fs = require('fs');
const path = require('path');

// Read PlaylistPages.tsx to extract the imageOrder array
const pagesContent = fs.readFileSync('src/pages/PlaylistPages.tsx', 'utf8');
const orderMatch = pagesContent.match(/const imageOrder = \[[^\]]+\];/s);
if (!orderMatch) {
  console.log('Could not find imageOrder in PlaylistPages.tsx');
  process.exit(1);
}

const imageOrder = eval(orderMatch[0].replace('const imageOrder =', '').replace(/;/g, '').trim())
  .map(name => name.replace('.png', ''));

const audioDir = 'src/assets/audio';
const localAudioFiles = fs.readdirSync(audioDir);

console.log('=== CROSS-CHECKING CD NAMES WITH AUDIO FILES ===\n');

const missing = [];
imageOrder.forEach((name, i) => {
  const fileId = i + 1; // CD ID in the app
  
  // Look for name.mp3, name_1.mp3 etc.
  const baseName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const matches = localAudioFiles.filter(f => {
    const fBase = f.toLowerCase().replace('.mp3', '').replace(/_[0-9]+$/, '').replace(/[^a-z0-9]/g, '');
    return fBase === baseName;
  });

  if (matches.length === 0) {
    missing.push({ fileId, name });
    console.log(`❌ CD ${fileId}: "${name}" is MISSING its audio file!`);
  } else {
    console.log(`✅ CD ${fileId}: "${name}" maps to: ${matches.join(', ')}`);
  }
});

console.log(`\nSummary: Out of ${imageOrder.length} CDs, ${missing.length} are missing audio.`);
fs.writeFileSync('scratch/missing_audio_summary.json', JSON.stringify(missing, null, 2));
