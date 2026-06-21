import { Readable } from 'stream';

const id = '1ssSKIARuMponBfJdyMWlGvy_f-UPguLZ'; // Aaruyire.mp3
const url = `https://drive.usercontent.google.com/download?id=${id}&export=download&authuser=0`;

async function test() {
  try {
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://drive.google.com/'
      }
    });
    console.log('Fetch status:', res.status);
    if (res.body) {
      const nodeStream = Readable.fromWeb(res.body);
      console.log('Stream created successfully');
      
      let chunkCount = 0;
      let totalBytes = 0;
      nodeStream.on('data', (chunk) => {
        chunkCount++;
        totalBytes += chunk.length;
        if (chunkCount === 1) {
          console.log(`First chunk received! Size: ${chunk.length} bytes`);
        }
      });
      
      nodeStream.on('end', () => {
        console.log(`Stream ended. Total chunks: ${chunkCount}, Total bytes: ${totalBytes}`);
      });
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
