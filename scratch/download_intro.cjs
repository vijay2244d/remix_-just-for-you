const fs = require('fs');
const path = require('path');
const https = require('https');

const id = "1rjB30oCTmH0kTSiE4Kwb15KgcLSBcAo2";
const outputDir = path.resolve('src/assets/audio');

function downloadFile(name, id) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputDir, `${name}.mp3`);
    const url = `https://drive.usercontent.google.com/download?id=${id}&export=open`;
    console.log(`[Downloading] ${name} (${id})...`);
    
    const file = fs.createWriteStream(filePath);
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    };

    https.get(url, options, (response) => {
      if (response.statusCode !== 200) {
        fs.unlinkSync(filePath);
        return reject(new Error(`Failed to download ${name}: HTTP status ${response.statusCode}`));
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`[Success] ${name}.mp3 downloaded, size = ${fs.statSync(filePath).size} bytes`);
        resolve();
      });
    }).on('error', (err) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      reject(err);
    });
  });
}

async function start() {
  try {
    // Download as cover.mp3
    await downloadFile("cover", id);
    // Also download as for intro.mp3 just in case
    await downloadFile("for intro", id);
  } catch (err) {
    console.error("Error downloading intro song:", err.message);
  }
}

start();
