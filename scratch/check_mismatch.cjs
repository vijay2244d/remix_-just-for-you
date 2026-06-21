const fs = require('fs');

// Read PlaylistLayout.tsx to extract PLAYLIST_SONGS keys
const layoutContent = fs.readFileSync('src/PlaylistLayout.tsx', 'utf8');
const songsStartIndex = layoutContent.indexOf('export const PLAYLIST_SONGS');
const songsEndIndex = layoutContent.indexOf('};', songsStartIndex);
const songsBlock = layoutContent.substring(songsStartIndex, songsEndIndex + 2);

// Simple regex to find keys
const keys = [];
const lines = songsBlock.split('\n');
lines.forEach(line => {
  const match = line.match(/^\s*["']?([^"']+)["']?\s*:/);
  if (match && match[1] !== 'export' && match[1] !== 'cover' && match[1] !== 'end') {
    keys.push(match[1]);
  }
});

// Read PlaylistPages.tsx to extract imageOrder
const pagesContent = fs.readFileSync('src/pages/PlaylistPages.tsx', 'utf8');
const orderMatch = pagesContent.match(/const imageOrder = \[[^\]]+\];/s);
if (!orderMatch) {
  console.log('Could not find imageOrder in PlaylistPages.tsx');
  process.exit(1);
}
const arrayText = orderMatch[0]
  .replace('const imageOrder =', '')
  .replace(/;/g, '')
  .trim();
const imageOrder = eval(arrayText).map(n => n.replace('.png', ''));

console.log('Image names from imageOrder:', imageOrder.length);
console.log('Keys in PLAYLIST_SONGS:', keys.length);

console.log('\nMissing in PLAYLIST_SONGS (present in imageOrder but not PLAYLIST_SONGS):');
imageOrder.forEach(name => {
  if (!keys.includes(name)) {
    console.log(`- "${name}"`);
  }
});

console.log('\nExtra in PLAYLIST_SONGS (present in PLAYLIST_SONGS but not in imageOrder):');
keys.forEach(key => {
  if (!imageOrder.includes(key)) {
    console.log(`- "${key}"`);
  }
});
