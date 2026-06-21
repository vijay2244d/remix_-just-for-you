const fs = require('fs');
const html = fs.readFileSync('drive_source.html', 'utf8');

const keywords = [
  "akkam pakkam", "comrade", "zero", "thaandavam", "kaadhal aada", "sirai",
  "hayyoda", "paiya", "pattuma", "endha pakkam", "perfect", "nee paartha paarvai",
  "vaaranam", "pavazham", "mayanadhi", "avalum naanum", "raati", "sidu sidu",
  "aaruyire", "ennadi", "new york", "jaalakkari", "kadhal aasai", "munbae va",
  "mudhal nee", "maruvaarthai", "pottala", "aval", "avalukena", "hosana",
  "anbil aval", "megamo aval", "nee kavithaigala", "ennai saithale", "oh my kad",
  "kanimozhiye", "jersey", "mulumathi", "i think", "uyire", "kalank",
  "kannaana kannae", "veera", "nallai allai", "aga naga", "neethane",
  "en moochum venam", "imaye", "en manpura", "azhagiye", "por"
];

keywords.forEach(kw => {
  const regex = new RegExp(kw.replace(/\s+/g, '[\\s-_]*'), 'gi');
  let match;
  let count = 0;
  const indices = [];
  while ((match = regex.exec(html)) !== null) {
    count++;
    if (indices.length < 3) {
      indices.push(match.index);
    }
  }
  if (count > 0) {
    console.log(`Keyword "${kw}" found ${count} times. First indices: ${indices.join(', ')}`);
    indices.forEach(idx => {
      const snippet = html.substring(Math.max(0, idx - 50), idx + 200);
      console.log(`  Snippet: ${snippet.trim().replace(/\s+/g, ' ')}`);
    });
  } else {
    console.log(`Keyword "${kw}" NOT found`);
  }
});
