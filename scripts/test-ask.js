const http = require('http');

async function testAsk(question) {
  const payload = JSON.stringify({
    question: question,
    context: {
      profile: {
        budgetInr: 50000,
        years: 4,
        workloads: ["ide", "browser"],
        concurrency: "moderate",
        weights: { performance: 0.2, battery: 0.2, portability: 0.2, reliability: 0.2, longevity: 0.1, value: 0.1 },
        minRamGb: 16
      },
      evaluation: {
        product: {
          slug: "acer-aspire-lite-15",
          name: "Acer Aspire Lite 15 (AMD Ryzen 5 5500U, 16GB/512GB)",
          brand: "Acer",
          category: "laptop",
          priceInr: 39990,
          priceAsOf: "2026-11-15",
          evidenceConfidence: 0.75,
          scores: { performance: 72, battery: 65, portability: 70, reliability: 68, longevity: 65, value: 82 },
          specs: { ramGb: 16, ramUpgradable: true, weightKg: 1.59, cpuCores: 6, batteryWh: 45, warrantyYears: 1 },
          observed: [
            { title: "Plastic chassis flex", share: 0.18, medianMonths: 8, severity: 2, reviewCount: 28 }
          ]
        },
        fit: 69,
        tco: { totalInr: 47988 },
        forecast: [
          { label: "Day 1", headroom: 1.8, status: "comfortable" },
          { label: "Year 4", headroom: 0.91, status: "tight" }
        ],
        risks: [
          { title: "Memory headroom tight by Year 4", trigger: "Heavy workloads", evidence: "Observed multi-tasking demand", mitigation: "RAM is upgradable" }
        ]
      },
      claims: []
    }
  });

  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/api/ask',
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
  console.log("--- Testing 'Hi' ---");
  const hiRes = await testAsk("Hi");
  console.log("Status:", hiRes.status);
  console.log("Answer:", hiRes.body.answer);
  console.log("Citations:", hiRes.body.citations);

  console.log("\n--- Testing 'Should I buy this?' ---");
  const buyRes = await testAsk("Should I buy this?");
  console.log("Status:", buyRes.status);
  console.log("Answer:", buyRes.body.answer);
}

run().catch(console.error);
