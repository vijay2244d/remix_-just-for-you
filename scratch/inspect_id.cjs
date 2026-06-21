const fs = require('fs');
const html = fs.readFileSync('drive_source.html', 'utf8');
const id = '12HDEnqeHMqbFodxGh8TdogCgzSRwi1ET';
const index = html.indexOf(id);
if (index === -1) {
  console.log(`ID ${id} not found in drive_source.html`);
} else {
  console.log(`Found ID at index ${index}`);
  console.log('--- Context ---');
  console.log(html.substring(Math.max(0, index - 200), index + 1000));
}
