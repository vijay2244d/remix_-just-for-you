const fs = require('fs');
const path = require('path');

// Read PlaylistPages.tsx to extract imageOrder
const content = fs.readFileSync('src/pages/PlaylistPages.tsx', 'utf8');
const match = content.match(/const imageOrder = \[[^\]]+\];/s);

if (!match) {
  console.log('Could not find imageOrder in PlaylistPages.tsx');
  process.exit(1);
}

// Evaluate the array safely by parsing it
const arrayText = match[0]
  .replace('const imageOrder =', '')
  .replace(/;/g, '')
  .trim();

const imageOrder = eval(arrayText);

// Simulate the rotation and list construction
const sortedImages = [...imageOrder]; // for simplicity, assuming sorted keys match imageOrder
const SCRAPBOOK_IMAGE_NAMES = sortedImages.length > 0
  ? [sortedImages[sortedImages.length - 1], ...sortedImages.slice(0, sortedImages.length - 1)]
  : [];

console.log('Moments CDs mapping:');
SCRAPBOOK_IMAGE_NAMES.forEach((name, i) => {
  const cdId = i + 1;
  const cleanName = name.replace('.png', '');
  console.log(`CD ID ${cdId}: "${cleanName}"`);
});
