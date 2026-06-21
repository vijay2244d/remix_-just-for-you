const fs = require('fs');
const https = require('https');

const url = 'https://drive.google.com/drive/folders/1eikhO0Uim9klIfGkLcnX-WB_6Hjp2GBA?usp=sharing';

console.log('Downloading HTML from Google Drive folder:', url);

function fetchHtml(targetUrl) {
  return new Promise((resolve, reject) => {
    https.get(targetUrl, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        // Follow redirect
        console.log('Following redirect to:', res.headers.location);
        fetchHtml(res.headers.location).then(resolve).catch(reject);
        return;
      }
      
      let html = '';
      res.on('data', (chunk) => { html += chunk; });
      res.on('end', () => { resolve(html); });
    }).on('error', reject);
  });
}

async function main() {
  try {
    const html = await fetchHtml(url);
    fs.writeFileSync('drive_source.html', html);
    console.log('HTML downloaded successfully. Size:', html.length, 'bytes');
    
    // Strategy: Find all filenames first, then look backward for the nearest file ID
    const results = {};
    const nameRegex = /\[\[\["([^"]+\.(mp3|m4a|wav|mp4|ogg))",null,1\]\]\]/g;
    let match;
    
    while ((match = nameRegex.exec(html)) !== null) {
      const filename = match[1];
      const endIndex = match.index;
      
      // Look backward up to 2500 chars to find the nearest file ID
      const lookBackStart = Math.max(0, endIndex - 2500);
      const lookBackArea = html.substring(lookBackStart, endIndex);
      
      // Find ALL IDs in the lookback area and take the LAST one (closest to the filename)
      const idMatches = [...lookBackArea.matchAll(/\[null,"([a-zA-Z0-9_-]{33})"\]/g)];
      
      if (idMatches.length > 0) {
        const lastId = idMatches[idMatches.length - 1][1];
        if (!results[filename]) {
          results[filename] = lastId;
        }
      }
    }
    
    // Fallback: check other patterns if needed
    const sorted = Object.entries(results).sort((a, b) => a[0].localeCompare(b[0]));
    console.log(`\nFound ${sorted.length} audio files:`);
    for (const [name, id] of sorted) {
      console.log(`  "${name}": "${id}",`);
    }
    
    // Write results to extracted_songs.json
    fs.writeFileSync('extracted_songs.json', JSON.stringify(results, null, 2));
    console.log('\nResults written to extracted_songs.json');
  } catch (err) {
    console.error('Error fetching/parsing Google Drive:', err);
  }
}

main();
