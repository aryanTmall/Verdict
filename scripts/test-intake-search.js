const http = require('http');

async function testParse(query) {
  const payload = JSON.stringify({ text: query });

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/mission/parse',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function run() {
  console.log("=== Test 1: User asks a conversational shopping question ===");
  const q1 = "Which laptop is best for coding and light gaming around 55k?";
  console.log("Query:", q1);
  const r1 = await testParse(q1);
  console.log("Status:", r1.status);
  console.log("AI Answer:", r1.body.aiAnswer);
  console.log("Extracted Budget:", r1.body.profile.budgetInr);
  console.log("Workloads:", r1.body.profile.workloads);
  console.log("Recommended Slugs:", r1.body.recommendedProductSlugs);

  console.log("\n=== Test 2: User asks about earbuds ===");
  const q2 = "What are the best earbuds with noise cancellation under 10000?";
  console.log("Query:", q2);
  const r2 = await testParse(q2);
  console.log("Status:", r2.status);
  console.log("AI Answer:", r2.body.aiAnswer);
  console.log("Category:", r2.body.category);
  console.log("Recommended Slugs:", r2.body.recommendedProductSlugs);
}

run().catch(console.error);
