async function test() {
  const url = 'https://drive.usercontent.google.com/download?id=153ck2hMYi1z1ba-7olz4G2c5lb-l0b6G&export=open';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      }
    });
    console.log("Status:", res.status);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const text = await res.text();
    console.log("Body length:", text.length);
    console.log("Body start:", text.substring(0, 500));
  } catch (e) {
    console.error("Error:", e);
  }
}
test();
