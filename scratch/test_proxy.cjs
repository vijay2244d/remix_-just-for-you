// Test the Google Drive proxy by fetching a song
const http = require('http');

function testProxy(fileId, songName) {
  return new Promise((resolve) => {
    const url = `http://localhost:3000/gdrive/download?id=${fileId}&export=download&authuser=0`;
    console.log(`\nTesting: ${songName}`);
    console.log(`URL: ${url}`);
    
    const req = http.get(url, (res) => {
      console.log(`Status: ${res.statusCode}`);
      console.log(`Content-Type: ${res.headers['content-type']}`);
      console.log(`Content-Length: ${res.headers['content-length']}`);
      console.log(`Location (if redirect): ${res.headers['location'] || 'none'}`);
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk.toString();
        if (data.length > 500) {
          req.destroy();
        }
      });
      res.on('end', () => {
        if (res.headers['content-type'] && res.headers['content-type'].includes('audio')) {
          console.log('✅ AUDIO content - Playing should work!');
        } else if (res.headers['content-type'] && res.headers['content-type'].includes('html')) {
          console.log('❌ HTML content - Got a webpage instead of audio!');
          console.log('First 300 chars:', data.substring(0, 300));
        } else {
          console.log('? Unknown content type');
          console.log('First 300 chars:', data.substring(0, 300));
        }
        resolve();
      });
      res.on('error', resolve);
    });
    
    req.on('error', (err) => {
      console.log(`ERROR: ${err.message}`);
      resolve();
    });
    
    req.setTimeout(10000, () => {
      console.log('TIMEOUT');
      req.destroy();
      resolve();
    });
  });
}

async function main() {
  console.log('=== Testing Google Drive Proxy ===');
  
  // Test a few songs
  await testProxy('1ssSKIARuMponBfJdyMWlGvy_f-UPguLZ', 'aaruyire (Aaruyire.mp3)');
  await testProxy('1WPWz91V8uqtNfzEgFXZg4Ld_fI4rTO33', 'aga naga');
  await testProxy('12s32Y3TBGytSjiYDjA5GcQxOOFunh2rW', 'hayyoda');
}

main().catch(console.error);
