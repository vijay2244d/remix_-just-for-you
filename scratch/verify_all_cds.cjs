const fs = require('fs');

// 1. Read imageOrder from src/pages/PlaylistPages.tsx
const pagesContent = fs.readFileSync('src/pages/PlaylistPages.tsx', 'utf8');
const orderMatch = pagesContent.match(/const imageOrder = \[[^\]]+\];/s);
if (!orderMatch) {
  console.log('Could not find imageOrder in PlaylistPages.tsx');
  process.exit(1);
}
const imageOrder = eval(orderMatch[0].replace('const imageOrder =', '').replace(/;/g, '').trim())
  .map(name => name.replace('.png', ''));

// 2. Read PLAYLIST_SONGS from src/PlaylistLayout.tsx
const layoutContent = fs.readFileSync('src/PlaylistLayout.tsx', 'utf8');
const songsStartIndex = layoutContent.indexOf('export const PLAYLIST_SONGS');
const songsEndIndex = layoutContent.indexOf('};', songsStartIndex);
const songsBlock = layoutContent.substring(songsStartIndex, songsEndIndex + 2);

// Extract keys and values from PLAYLIST_SONGS
const playlistSongs = {};
const lines = songsBlock.split('\n');
lines.forEach(line => {
  const match = line.match(/^\s*["']?([^"']+)["']?\s*:\s*(.+),?\s*$/);
  if (match) {
    const key = match[1];
    let val = match[2].trim();
    if (key !== 'export' && key !== 'cover' && key !== 'end') {
      playlistSongs[key] = val;
    }
  }
});

// 3. Load extracted songs JSON
let extractedSongs = {};
if (fs.existsSync('extracted_songs.json')) {
  extractedSongs = JSON.parse(fs.readFileSync('extracted_songs.json', 'utf8'));
}

console.log('=== CROSS-CHECKING CD NAMES AND SONGS ===\n');

console.log(`Total CD cases in imageOrder: ${imageOrder.length}`);
console.log(`Total songs mapped in PLAYLIST_SONGS: ${Object.keys(playlistSongs).length}\n`);

// Check for mismatches
const missingInSongs = [];
imageOrder.forEach((img, idx) => {
  if (!playlistSongs[img]) {
    missingInSongs.push({ index: idx + 1, name: img });
  }
});

console.log('CDs missing from PLAYLIST_SONGS (will play silent progress bar):');
if (missingInSongs.length > 0) {
  missingInSongs.forEach(item => {
    console.log(`- Case ${item.index + 1} (CD ID ${item.index}): "${item.name}"`);
  });
} else {
  console.log('(None)');
}
console.log('');

// Check if mapped IDs match the names in Google Drive
console.log('Checking mapped audio file IDs against Google Drive filenames:');
let mismatchCount = 0;
for (const [key, val] of Object.entries(playlistSongs)) {
  // Extract ID from gdrive("...")
  const idMatch = val.match(/gdrive\("([^"]+)"\)/);
  if (idMatch) {
    const id = idMatch[1];
    
    // Find if this ID is in extractedSongs
    const driveFile = Object.keys(extractedSongs).find(fn => extractedSongs[fn] === id);
    if (driveFile) {
      // Normalize both to see if they match
      const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normFile = driveFile.toLowerCase().replace('.mp3', '').replace(/[^a-z0-9]/g, '');
      
      // Let's check if they match (fuzzy)
      const isMatch = normFile.includes(normKey) || normKey.includes(normFile) ||
                      (normKey === 'kadhalaasai' && normFile.includes('anajaan')) ||
                      (normKey === 'mulumathi' && normFile.includes('muzumathi')) ||
                      (normKey === 'ohmykadvule' && normFile.includes('ohmykaduvul')) ||
                      (normKey === 'anbilaval' && normFile.includes('anbilavan')) ||
                      (normKey === 'maruvaarthai' && normFile.includes('maruvarathai')) ||
                      (normKey === 'maruvaarthai' && normFile.includes('maruvarathu'));
                      
      if (!isMatch) {
        mismatchCount++;
        console.log(`⚠️ MISMATCH DETECTED:`);
        console.log(`  CD name: "${key}"`);
        console.log(`  Plays ID: "${id}"`);
        console.log(`  Which is file in drive: "${driveFile}"`);
      }
    }
  } else if (val.includes('[')) {
    // Multi-track array
    const idMatches = [...val.matchAll(/gdrive\("([^"]+)"\)/g)];
    idMatches.forEach((m, idx) => {
      const id = m[1];
      const driveFile = Object.keys(extractedSongs).find(fn => extractedSongs[fn] === id);
      if (driveFile) {
        const normKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normFile = driveFile.toLowerCase().replace('.mp3', '').replace(/[^a-z0-9]/g, '');
        const isMatch = normFile.includes(normKey) || normKey.includes(normFile) ||
                        (normKey === 'kannaanakannae' && normFile.includes('kannakanne')) ||
                        (normKey === 'ennadimaayavi' && normFile.includes('ennadimayavi')) ||
                        (normKey === 'ennaisaithale' && normFile.includes('ennaisaaiithale')) ||
                        (normKey === 'maruvaarthai' && normFile.includes('maruvarathai')) ||
                        (normKey === 'maruvaarthai' && normFile.includes('maruvarathu'));
        if (!isMatch) {
          mismatchCount++;
          console.log(`⚠️ MULTI-TRACK MISMATCH DETECTED:`);
          console.log(`  CD name: "${key}" (Track ${idx + 1})`);
          console.log(`  Plays ID: "${id}"`);
          console.log(`  Which is file in drive: "${driveFile}"`);
        }
      }
    });
  }
}

if (mismatchCount === 0) {
  console.log('✅ All mapped files match their CD names!');
} else {
  console.log(`❌ Found ${mismatchCount} mismatches.`);
}
