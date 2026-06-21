const fs = require('fs');
const html = fs.readFileSync('drive_source.html', 'utf8');
const id = '1nn4F-mCo4DEKU0VCryHCpsPGmwpUo8Lw';
const index = html.indexOf(id);
if (index !== -1) {
  const area = html.substring(index, index + 3000);
  console.log('--- Context Lookahead ---');
  console.log(area);
}
