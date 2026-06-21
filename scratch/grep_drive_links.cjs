const fs = require('fs');

const content = fs.readFileSync('scratch/drive_links_results.txt', 'utf8');
const sections = content.split('--------------------------------------------------');

const queries = ['veera', 'uyire', 'mulumathi', 'moochum', 'imaye', 'manpura', 'ponvasantham'];

console.log('Searching for target songs in extracted Google Drive links:');
let matchCount = 0;
for (const section of sections) {
  let matched = false;
  for (const q of queries) {
    if (section.toLowerCase().includes(q.toLowerCase())) {
      matched = true;
    }
  }
  if (matched) {
    matchCount++;
    console.log(`\n=== MATCH ${matchCount} ===`);
    console.log(section.trim());
    console.log('========================');
  }
}

console.log(`\nFound ${matchCount} matches.`);
