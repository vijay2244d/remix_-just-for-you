const fs = require('fs');
const path = require('path');
const readline = require('readline');

const brainDir = 'C:\\Users\\ELCOT\\.gemini\\antigravity-ide\\brain';

async function searchFile(filePath, queries) {
  if (!fs.existsSync(filePath)) return [];
  
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });
  
  const matches = [];
  let lineNum = 0;
  
  for await (const line of rl) {
    lineNum++;
    for (const query of queries) {
      if (line.toLowerCase().includes(query.toLowerCase())) {
        matches.push({ query, lineNum, line });
      }
    }
  }
  return matches;
}

async function main() {
  const folders = fs.readdirSync(brainDir);
  const queries = ['mulumathi', 'muzumathi', 'uyire', 'veera', 'moochum', 'imaye', 'manpura', 'ponvasantham'];
  
  console.log(`Searching in ${folders.length} conversation folders...`);
  
  for (const folder of folders) {
    const logPath = path.join(brainDir, folder, '.system_generated', 'logs', 'transcript.jsonl');
    try {
      const matches = await searchFile(logPath, queries);
      if (matches.length > 0) {
        console.log(`\nFound matches in folder: ${folder}`);
        for (const m of matches) {
          try {
            const parsed = JSON.parse(m.line);
            console.log(`  Line ${m.lineNum} [${parsed.type || 'unknown'}]: Query "${m.query}"`);
            if (parsed.content) {
              console.log(`    Content snippet: ${parsed.content.substring(0, 300)}`);
            }
            if (parsed.tool_calls) {
              console.log(`    Tool calls: ${JSON.stringify(parsed.tool_calls)}`);
            }
          } catch (e) {
            console.log(`  Line ${m.lineNum}: ${m.line.substring(0, 300)}`);
          }
        }
      }
    } catch (err) {
      // Ignore errors
    }
  }
  console.log('\nSearch completed.');
}

main();
