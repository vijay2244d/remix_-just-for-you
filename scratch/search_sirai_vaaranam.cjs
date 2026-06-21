const fs = require('fs');
const content = fs.readFileSync('scratch/recovered_songs_list.txt', 'utf8');
const lines = content.split('\n');
const matches = lines.filter(l => {
  const lower = l.toLowerCase();
  return lower.includes('sirai') || lower.includes('varanam') || lower.includes('vaaranam') || lower.includes('naan pizhai') || lower.includes('oorum');
});
console.log('Found', matches.length, 'matching lines:');
matches.slice(0, 30).forEach(l => console.log(l));
