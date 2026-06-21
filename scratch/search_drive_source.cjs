const fs = require('fs');

const html = fs.readFileSync('drive_source.html', 'utf8');
const queries = ['pizhai', 'blood', 'oorum', 'naan'];

queries.forEach(q => {
  let idx = 0;
  console.log(`=== SEARCHING FOR: ${q} ===`);
  while (true) {
    idx = html.toLowerCase().indexOf(q.toLowerCase(), idx);
    if (idx === -1) break;
    
    // Print 100 characters before and 300 characters after
    const start = Math.max(0, idx - 100);
    const end = Math.min(html.length, idx + 400);
    const snippet = html.substring(start, end);
    console.log(`[Found at index ${idx}]`);
    console.log(snippet);
    console.log('-'.repeat(40));
    
    idx += q.length;
  }
});
