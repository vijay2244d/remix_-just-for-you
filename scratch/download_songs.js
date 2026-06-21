import fs from 'fs';
import path from 'path';
import https from 'https';

const DRIVE_IDS = {
  "aga naga": "1WPWz91V8uqtNfzEgFXZg4Ld_fI4rTO33",
  "anbil aval": "1LQy-c3Ag_gcRNrjoPp2JOFXSGfzkQTJV",
  "aval_1": "1VjtJnmoNpeWqEORgPQ9WO8u4HZ4Zw74a",
  "aval_2": "16tykraB3JCFDJ56KDy4QTLJRmIkf_zZK",
  "avalukena_1": "1t2dckh1v8ZNgMeifQ8S5QlNTkHvarFN4",
  "avalukena_2": "168XCrSjfMn-zZ4g6TGPwk7832WjpwYHV",
  "avalum naanum": "1WZG_5kshfcRaWe4MH2dlRkQLdwWHP_Ln",
  "azhagiye": "153ck2hMYi1z1ba-7olz4G2c5lb-l0b6G",
  "comrade": "1nn4F-mCo4DEKU0VCryHCpsPGmwpUo8Lw",
  "aaruyire": "1ssSKIARuMponBfJdyMWlGvy_f-UPguLZ",
  "Akkam pakkam": "118P6PnQTQaUlzWg0jmTXJNmiuxuAK3-j",
  "endha pakkam_1": "1s1-kNfH1Mmo15ANAAdpbQYZnLvPTRaTd",
  "endha pakkam_2": "1cP37eeX1PQogPtDLbQ2iClLpBMhIjgF5",
  "ennadi maayavi_1": "1wk4r_4jPHdonYonnWjDv7Rovjayi19C1",
  "ennadi maayavi_2": "11MRQ8IKND_od6OpoQH2B2_cmaap0BUJ1",
  "ennai saithale_1": "1-j-cRSQRR2lXvh-VZXlYq_oW2t9dW99_",
  "ennai saithale_2": "16yijHFgxO6VxeZk6QorFg6Rt9Ovr_QPi",
  "en manpura mangai": "1L9qEOwcTrVeeVcS9ihqNqGOHrrYOp_XG",
  "en moochum venam": "1nY3cCemu0dA-wPhYE1VbHnWn6CmVtc7w",
  "hayyoda": "12s32Y3TBGytSjiYDjA5GcQxOOFunh2rW",
  "hosana": "1oB57_ad0H_a4jA5-8cplw5qvEV4qmksT",
  "i think they call this love": "1gx2TwsnO-YcNOHner3Vu-t2zafIoFGWT",
  "imaye": "1up2sS0125rCQzpVvNl-JlyrQii95p6Vj",
  "jaalakkari": "1gucAA7foafFlo5vGp1upxoBBvCwp4Efe",
  "jersey": "1qyPznrDCvRCH_KwKKfAG5rxKjgWOYhCw",
  "kaadhal aada": "1JDfEz747c3FcGwEdjunoTY8PFTtFx1tL",
  "kadhal aasai": "1jMV6Q_5b9-hZkuTyH2EkSY7nlfdRYAl7",
  "kalank": "1Te2A7w7fRMh0sa5R3aOosKRt75LLbtAX",
  "kanimozhiye": "149Xg8voIUd2nlOjDMQs7QTKluU1aWjEu",
  "kannaana kannae_1": "1hwh6N0XY6Lw-5vHIzuPcIeAAzrxpIYSq",
  "kannaana kannae_2": "15jufJWCA5zz0kXaklaieLPIzC4SY4Vql",
  "kannaana kannae_3": "17I-1YZ6lbwKq_dlqJZ_4HvKHU9gjfZ1t",
  "maruvaarthai_1": "17NEWeqMfm9RlpRaBy8z35DUS_kl48ybS",
  "maruvaarthai_2": "1aLBtpuSaZVFreSpfdBtlrJ78h5rj8CxH",
  "mayanadhi_1": "1-qyithk2i6-B_14HX2OqvSH5DdxW4OsM",
  "mayanadhi_2": "1sIdcCTzLltA5Qrt7XF13uA26m2y3B2em",
  "mayanadhi_3": "1AYFF0OGSAfK0TrzMfwOa0tDpDRU5WnuH",
  "megamo aval": "18WwxN0jfUm0yEm2fJWmJuCCtd7Nscbfz",
  "mudhal nee mudivum nee_1": "1TIja18pTmrXARXWs53ETIXIBmfH34pwt",
  "mudhal nee mudivum nee_2": "1ZITMetY4nQdmi89UUkIgb5JeR2yyGpWb",
  "mulumathi": "181BtMYFHW2PqCUIKutC7q5qXrwDQzThu",
  "munbae va": "1GKFOtzLplLl3ZIczdBlyPJYsWhLl7KnV",
  "nallai allai": "1G1f149W1VX9uDHBVaj-GfoXZJbetN_3r",
  "nee kavithaigala": "1JmMLyzu3q1JyPgX9DLR8H48rXVj3nEZI",
  "nee paartha paarvai": "1wzCsVC_ZJr6_qD0nOCgoW8zA-ZIZWSk2",
  "neethane en ponvasantham": "1BsU0ALH8MQeuH7LB3k1lMOd_YzC-wFZ1",
  "new york nagaram": "14otgfns1s1-Ys3KJeBhrJKM4HkAHnI6S",
  "oh my kadvule": "1NGZeb2CGQnXieXivcWMkW9R133RwRsjS",
  "paiya": "1HpQSBCIYJkOVQyZOfFfcpKJOGlXnDb7p",
  "pattuma": "1Y89BO_QpenCVd8RdklIF5MEo_WrE2HnL",
  "pavazhamzhi_1": "14iVLWQJ0sfxc6YjXfEr-iHS9ClihxThr",
  "pavazhamzhi_2": "1sX9FyB1Ts9-HpbFLJrh_Os-LCynpGetH",
  "perfect": "165U7HdxDUaraoETfkee6N25QOVRTW653",
  "por": "1pKSDTGsSJB6xpbrcrCj7f0You-eos2ph",
  "pottala muttaya": "1uqyyORuG86O-XIUGDkNTgNekpnzfVVC7",
  "raati": "1agVnM597gPl1pRlCZCSh8uW0DXWbbmJB",
  "sidu sidu": "1AnwQstWidDxqoSzUwT79s2n333XQyoYb",
  "thaandavam": "1LnTnk1dp9Y9pLZ7wtOMLe-lItk91UXka",
  "uyire_1": "1PkiUHRfQX36YRy2vqBEkdL4eM59zcW3f",
  "uyire_2": "1AxnNpHPLODSzBAGfDWbQDTntxubQJycT",
  "veera": "1GLcnItQFzUXowW0ZdHxyfOvwonldwVti",
  "zero": "1_8nEO6d6izwVAHagjJ8OcwLwHN6P_lzV"
};

const outputDir = path.resolve('src/assets/audio');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadFile(name, id) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputDir, `${name}.mp3`);
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 100000) {
      console.log(`[Skip] ${name}.mp3 already exists`);
      return resolve();
    }

    const url = `https://drive.usercontent.google.com/download?id=${id}&export=open`;
    console.log(`[Downloading] ${name} (${id})...`);
    
    const file = fs.createWriteStream(filePath);
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
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
        console.log(`[Success] ${name}.mp3 downloaded`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(filePath);
      reject(err);
    });
  });
}

async function start() {
  const entries = Object.entries(DRIVE_IDS);
  console.log(`Starting download of ${entries.length} songs...`);
  
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
  console.log("All downloads complete!");
}

start();
