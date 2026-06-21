const fs = require('fs');

const content = fs.readFileSync('scratch/search_results.txt', 'utf8');
const lines = content.split('\n');

const queries = ['veera', 'uyire', 'mulumathi', 'moochum', 'imaye', 'manpura', 'ponvasantham'];

console.log('Searching in search_results.txt...');
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (const q of queries) {
    if (line.toLowerCase().includes(q.toLowerCase())) {
      console.log(`Line ${i + 1}: ${line.trim()}`);
      // print 2 lines before and 2 lines after
      for (let j = Math.max(0, i - 3); j <= Math.min(lines.length - 1, i + 3); j++) {
        console.log(`  [${j + 1}] ${lines[j].trim()}`);
      }
      console.log('--------------------');
      break;
    }
  }
}
