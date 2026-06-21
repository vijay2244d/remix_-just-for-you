const fs = require('fs');

const originalList = [
  {"name":"1.png","sizeBytes":472388},
  {"name":"10.png","sizeBytes":384042},
  {"name":"11.png","sizeBytes":367466},
  {"name":"12.png","sizeBytes":630291},
  {"name":"13.png","sizeBytes":586469},
  {"name":"14.png","sizeBytes":605508},
  {"name":"15.png","sizeBytes":581854},
  {"name":"16.png","sizeBytes":518339},
  {"name":"17.png","sizeBytes":476789},
  {"name":"18.png","sizeBytes":685020},
  {"name":"19.png","sizeBytes":413113},
  {"name":"2.png","sizeBytes":599170},
  {"name":"20.png","sizeBytes":479823},
  {"name":"21.png","sizeBytes":474000},
  {"name":"22.png","sizeBytes":612273},
  {"name":"23.png","sizeBytes":529103},
  {"name":"24.png","sizeBytes":511068},
  {"name":"25.png","sizeBytes":464665},
  {"name":"26.png","sizeBytes":572522},
  {"name":"27.png","sizeBytes":467169},
  {"name":"28.png","sizeBytes":620248},
  {"name":"29.png","sizeBytes":555542},
  {"name":"3.png","sizeBytes":544325},
  {"name":"30.png","sizeBytes":481442},
  {"name":"31.png","sizeBytes":559175},
  {"name":"32.png","sizeBytes":579749},
  {"name":"33.png","sizeBytes":576597},
  {"name":"34.png","sizeBytes":484033},
  {"name":"35.png","sizeBytes":431943},
  {"name":"36.png","sizeBytes":504156},
  {"name":"37.png","sizeBytes":440579},
  {"name":"38.png","sizeBytes":625965},
  {"name":"39.png","sizeBytes":243242},
  {"name":"4.png","sizeBytes":434723},
  {"name":"40.png","sizeBytes":597789},
  {"name":"41.png","sizeBytes":485000},
  {"name":"42.png","sizeBytes":1015761},
  {"name":"43.png","sizeBytes":548580},
  {"name":"45.png","sizeBytes":762226},
  {"name":"46.png","sizeBytes":958137},
  {"name":"47.png","sizeBytes":495121},
  {"name":"5.png","sizeBytes":627711},
  {"name":"6.png","sizeBytes":503968},
  {"name":"7.png","sizeBytes":637912},
  {"name":"8.png","sizeBytes":560556},
  {"name":"9.png","sizeBytes":638798}
];

const newList = [
  { name: 'Modern Elegant Couple Wedding Photo Poster (1).png', size: 573798 },
  { name: 'aaruyire.png', size: 413113 },
  { name: 'aga naga.png', size: 958137 },
  { name: 'Akkam pakkam.png', size: 472388 },
  { name: 'anbil aval.png', size: 559175 },
  { name: 'aval.png', size: 620248 },
  { name: 'avalukena.png', size: 555542 },
  { name: 'avalum naanum.png', size: 518339 },
  { name: 'azhagiye.png', size: 495121 },
  { name: 'comrade.png', size: 599170 },
  { name: 'endha pakkam.png', size: 384042 },
  { name: 'ennadi maayavi.png', size: 479823 },
  { name: 'ennai saithale.png', size: 484033 },
  { name: 'hayyoda.png', size: 637912 },
  { name: 'hosana.png', size: 481442 },
  { name: 'i think they call this love.png', size: 243242 },
  { name: 'jaalakkari.png', size: 612273 },
  { name: 'jersey.png', size: 440579 },
  { name: 'kaadhal aada.png', size: 627711 },
  { name: 'kadhal aasai.png', size: 529103 },
  { name: 'kalank.png', size: 485000 },
  { name: 'kanimozhiye.png', size: 504156 },
  { name: 'kannaana kannae.png', size: 548580 },
  { name: 'maruvaarthai.png', size: 572522 },
  { name: 'mayanadhi.png', size: 581854 },
  { name: 'megamo aval.png', size: 579749 },
  { name: 'mudhal nee mudivum nee.png', size: 464665 },
  { name: 'mulumathi.png', size: 625965 },
  { name: 'munbae va.png', size: 511068 },
  { name: 'nallai allai.png', size: 762226 },
  { name: 'nee kavithaigala.png', size: 576597 },
  { name: 'nee paartha paarvai.png', size: 630291 },
  { name: 'new york nagaram.png', size: 474000 },
  { name: 'oh my kadvule.png', size: 431943 },
  { name: 'paiya.png', size: 560556 },
  { name: 'pattuma.png', size: 638798 },
  { name: 'pavazhamzhi.png', size: 605508 },
  { name: 'perfect.png', size: 367466 },
  { name: 'pottala muttaya.png', size: 467169 },
  { name: 'raati.png', size: 476789 },
  { name: 'sidu sidu.png', size: 685020 },
  { name: 'sirai.png', size: 503968 },
  { name: 'thaandavam.png', size: 434723 },
  { name: 'uyire.png', size: 597789 },
  { name: 'vaaranam aairam.png', size: 586469 },
  { name: 'veera.png', size: 1015761 },
  { name: 'zero.png', size: 544325 }
];

console.log('Mapping from new name to original page number:');
const mapping = {};

for (const newItem of newList) {
  const matchingOrig = originalList.find(o => o.sizeBytes === newItem.size);
  if (matchingOrig) {
    const origNum = parseInt(matchingOrig.name.replace('.png', ''), 10);
    mapping[newItem.name] = origNum;
    console.log(`  "${newItem.name}" -> ${origNum} (size: ${newItem.size})`);
  } else {
    console.log(`  WARNING: No match for "${newItem.name}" (size: ${newItem.size})`);
  }
}

fs.writeFileSync('size_mapping.json', JSON.stringify(mapping, null, 2));
