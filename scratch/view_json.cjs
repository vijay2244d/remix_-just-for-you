const fs = require('fs');
const json = JSON.parse(fs.readFileSync('extracted_songs.json', 'utf8'));

console.log('Total extracted:', Object.keys(json).length);
console.log(JSON.stringify(json, null, 2));
