const fs = require('fs');
const path = require('path');
const https = require('https');

const MISSING_DRIVE_IDS = {
  "naan pizhai": "1NsHj17Hy_xq_7eDVZ9g-y4dTbRks5Cew",
  "sirai": "1c7uQHDbZOmKn1KiQIvBPM1sP50TWBDO_",
  "vaaranam aairam": "1eafwoT2nn1wVE4qsYr-TZbOBCrmOSGGy",
  "oorumblood": "1OTIKS5XeTvYGyTXWuHO-bpeqHMUnDO6S"
};

const outputDir = path.resolve('src/assets/audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

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
  const entries = Object.entries(MISSING_DRIVE_IDS);
  console.log(`Starting download of ${entries.length} missing songs...`);
  
  for (let i = 0; i < entries.length; i++) {
    const [name, id] = entries[i];
    let attempts = 0;
    const maxAttempts = 3;
    while (attempts < maxAttempts) {
      try {
        await downloadFile(name, id);
        break;
      } catch (err) {
        attempts++;
        console.error(`Error downloading ${name} (attempt ${attempts}/${maxAttempts}):`, err.message);
        if (attempts >= maxAttempts) {
          console.error(`Failed to download ${name} after ${maxAttempts} attempts`);
        } else {
          await new Promise(r => setTimeout(r, 2000));
        }
      }
    }
  }
  console.log("Downloads complete!");
}

start();
