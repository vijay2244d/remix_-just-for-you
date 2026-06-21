const fs = require('fs');
const escaped = fs.readFileSync('scratch/playlist_songs_recovered.txt', 'utf8');

// The file contains a JSON-escaped string like "  \"azhagiye\": ... \n". Let's wrap it in quotes and JSON.parse it.
try {
  let jsonStr = escaped.trim();
  if (!jsonStr.startsWith('"')) jsonStr = '"' + jsonStr;
  if (!jsonStr.endsWith('"')) jsonStr = jsonStr + '"';
  
  const decoded = JSON.parse(jsonStr);
  fs.writeFileSync('scratch/playlist_songs_formatted.txt', decoded);
  console.log('Successfully formatted and saved to scratch/playlist_songs_formatted.txt');
} catch (e) {
  // If JSON.parse fails, let's try direct string replace of \n and \"
  console.log('JSON parse failed, trying manual replace:', e.message);
  const replaced = escaped
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/^"/, '')
    .replace(/"$/, '');
  fs.writeFileSync('scratch/playlist_songs_formatted.txt', replaced);
  console.log('Saved via manual replace to scratch/playlist_songs_formatted.txt');
}
