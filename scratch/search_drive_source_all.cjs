const fs = require('fs');

const html = fs.readFileSync('drive_source.html', 'utf8');
const queries = ['sirai', 'vaaranam', 'aairam', 'vettama', 'neelothi'];

queries.forEach(q => {
  let idx = 0;
  console.log(`=== SEARCHING FOR: ${q} ===`);
  let count = 0;
  while (true) {
    idx = html.toLowerCase().indexOf(q.toLowerCase(), idx);
    if (idx === -1) break;
    count++;
    const start = Math.max(0, idx - 100);
    const end = Math.min(html.length, idx + 400);
    const snippet = html.substring(start, end);
    console.log(`[Found ${count} at index ${idx}]`);
    console.log(snippet);
    console.log('-'.repeat(40));
    idx += q.length;
  }
  if (count === 0) {
    console.log('No matches found.');
  }
});
