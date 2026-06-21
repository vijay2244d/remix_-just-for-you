const fs = require('fs');

const songs = JSON.parse(fs.readFileSync('extracted_songs.json', 'utf8'));
const images = [
  "aaruyire",
  "aga naga",
  "Akkam pakkam",
  "anbil aval",
  "aval",
  "avalukena",
  "avalum naanum",
  "azhagiye",
  "comrade",
  "endha pakkam",
  "ennadi maayavi",
  "ennai saithale",
  "hayyoda",
  "hosana",
  "i think they call this love",
  "jaalakkari",
  "jersey",
  "kaadhal aada",
  "kadhal aasai",
  "kalank",
  "kanimozhiye",
  "kannaana kannae",
  "maruvaarthai",
  "mayanadhi",
  "megamo aval",
  "mudhal nee mudivum nee",
  "mulumathi",
  "munbae va",
  "nallai allai",
  "nee kavithaigala",
  "nee paartha paarvai",
  "new york nagaram",
  "oh my kadvule",
  "paiya",
  "pattuma",
  "pavazhamzhi",
  "perfect",
  "pottala muttaya",
  "raati",
  "sidu sidu",
  "sirai",
  "thaandavam",
  "uyire",
  "vaaranam aairam",
  "veera",
  "zero"
];

// Normalize strings for matching (remove spaces, punctuation, lowercase, remove "trimmed", "trim", "trimed")
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[-_.\s]/g, '')
    .replace(/trimmed/g, '')
    .replace(/trimed/g, '')
    .replace(/trim/g, '')
    .replace(/trimer/g, '')
    .replace(/\d+/g, '') // remove numbers
    .trim();
}

console.log('--- Matching results ---');

const songKeys = Object.keys(songs);
const mappedImages = {};
const unmappedSongs = [];

// For each image, find matching songs
for (const img of images) {
  const normImg = normalize(img);
  const matchingSongs = [];
  
  for (const song of songKeys) {
    const normSong = normalize(song.replace('.mp3', ''));
    
    // Fuzzy matching: check if normalized song contains normalized image name or vice versa
    if (normSong.includes(normImg) || normImg.includes(normSong) || 
       (normImg === 'kannaanakannae' && normSong === 'kannakanne') ||
       (normImg === 'pottalamuttaya' && normSong === 'pottalamuttaye') ||
       (normImg === 'ennadimaayavi' && normSong === 'ennadimayavi') ||
       (normImg === 'sidusidu' && normSong === 'romeosidusidu') ||
       (normImg === 'anbilaval' && normSong === 'anbilavan') ||
       (normImg === 'ohmykadvule' && normSong === 'ohmykaduvul') ||
       (normImg === 'ennaisaithale' && normSong === 'ennaisaaiithale') ||
       (normImg === 'munbaeva' && normSong === 'munbaevah') ||
       (normImg === 'maruvaarthai' && normSong === 'maruvarathu')
    ) {
      matchingSongs.push(song);
    }
  }
  
  if (matchingSongs.length > 0) {
    mappedImages[img] = matchingSongs;
  }
}

// Find unmapped songs
for (const song of songKeys) {
  let isMapped = false;
  for (const img of Object.keys(mappedImages)) {
    if (mappedImages[img].includes(song)) {
      isMapped = true;
      break;
    }
  }
  if (!isMapped) {
    unmappedSongs.push(song);
  }
}

console.log('Mapped Images to Songs:');
for (const [img, matched] of Object.entries(mappedImages)) {
  console.log(`  "${img}" -> ${JSON.stringify(matched)}`);
}

console.log('\nUnmapped Images:');
const unmappedImages = images.filter(img => !mappedImages[img]);
console.log(unmappedImages);

console.log('\nUnmapped Songs:');
console.log(unmappedSongs);
