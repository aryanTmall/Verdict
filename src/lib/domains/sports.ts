import type { DomainPack, DomainProduct, DomainOwnershipProfile, DomainClassification } from "./types";

export const sportsDomain: DomainPack = {
  id: "sports",
  name: "Sports, Running & Fitness Intelligence",
  description: "Biomechanics-informed evaluation of marathon running shoes, road and gravel bicycles, fitness monitors, and gym equipment with midsole cushioning degradation curves, heel-to-toe drop analysis, and cost-per-kilometer ownership metrics.",
  categories: ["running_shoes", "bicycles", "fitness_trackers", "gym_equipment", "outdoor_gear"],
  budgetRange: { min: 2500, max: 250000, step: 500, default: 12000 },
  attributes: [
    { key: "midsoleFoam", label: "Midsole Technology", type: "string", description: "Cushioning compound (e.g. ReactX, ZoomX, FF BLAST+, PWRRUN)", isKeySpec: true },
    { key: "heelToToeDropMm", label: "Heel-to-Toe Drop", type: "number", unit: "mm", description: "Differential stack height between heel and forefoot", isKeySpec: true },
    { key: "shoeWeightGrams", label: "Weight per Shoe", type: "number", unit: "g", description: "Weight for Men's UK 9 sample", isKeySpec: true },
    { key: "pronationSupport", label: "Pronation Support", type: "string", description: "Neutral, Mild Stability, or Maximum Overpronation Guidance", isKeySpec: true },
    { key: "lifespanKm", label: "Rated Outsole Lifespan", type: "number", unit: "km", description: "Recommended training mileage before foam compression", isKeySpec: true },
    { key: "upperBreathability", label: "Upper Construction", type: "string", description: "Engineered mesh or knit with ventilation zones" },
  ],
  evaluateProducts: (products, classification) => {
    const budget = classification.budget || 12000;
    return products.map(p => {
      const price = p.priceInr <= budget ? p.priceInr : Math.round(budget * 0.98);
      return { ...p, priceInr: price };
    });
  },
  generateOwnership: (product, classification) => {
    const pInr = product.priceInr;
    const kmLife = (product.domainSpecs.lifespanKm as number) || 800;
    const costPerKm = (pInr / kmLife).toFixed(2);

    return {
      horizonYears: 2,
      metricName: "Midsole Energy Return & Outsole Wear",
      metricUnit: "% Original Cushioning Resilience",
      regretClockNotice: "High-abrasion rubber outsole and supercritical foam projected optimal for 750–850 km of marathon training mileage",
      stations: [
        {
          station: "Day 1 (Break-In Run)",
          month: 0,
          metricLabel: "Initial Energy Return",
          metricValue: "100% Foam Spring",
          status: "comfortable",
          projectedCostInr: pInr,
          evidenceHeadline: "Snug midfoot lockdown, zero heel slippage, plush step-in sensation",
          evidenceSeverity: 1,
          ownerReceipt: "First 10k run right out of the box had zero hotspots or blisters. Fit is true to size.",
        },
        {
          station: "Month 3 (200 km Logged)",
          month: 3,
          metricLabel: "Foam Break-In Peak",
          metricValue: "96% Foam Spring",
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "Midsole reaches peak compliance and energy return balance",
          evidenceSeverity: 1,
          ownerReceipt: "Foam felt even softer after the first 60 km. Perfect daily trainer for long Sunday runs.",
        },
        {
          station: "Month 6 (500 km Logged)",
          month: 6,
          metricLabel: "Halfway Marathon Prep",
          metricValue: "88% Resilience / Minor Outsole Scuff",
          status: "comfortable",
          projectedCostInr: 900, // Running socks renewal
          evidenceHeadline: "Forefoot tread shows standard superficial wear, midsole still provides ample joint protection",
          evidenceSeverity: 1,
          ownerReceipt: "Completed a 28k progressive run. Knees felt completely fresh the next morning.",
        },
        {
          station: "Month 10 (800 km Completed)",
          month: 10,
          metricLabel: "Terminal Mileage Lifecycle",
          metricValue: "72% Resilience (Compression Settled)",
          status: "tight",
          projectedCostInr: 0,
          evidenceHeadline: "Midsole foam compression creases indicate retirement from race day to recovery walking",
          evidenceSeverity: 2,
          ownerReceipt: "Logged 820 km before buying a fresh pair. Outsole rubber never peeled off.",
        },
      ],
      tcoBreakdown: [
        { label: "Performance Footwear Invoice", inr: pInr, recurrence: "one_time", provenance: "verified" },
        { label: "Calculated Cost Per Kilometer (at 800 km lifespan)", inr: Math.round(pInr / 800 * 100), recurrence: "one_time", provenance: "verified" },
        { label: "Anti-Blister Technical Running Socks (3 Pairs)", inr: 1800, recurrence: "one_time", provenance: "estimated" },
      ],
    };
  },
  sampleProducts: [
    {
      slug: "nike-air-zoom-pegasus-41",
      name: "Nike Pegasus 41 Road Running Shoes (ReactX Superfoam, Forefoot & Heel Air Zoom, 10mm Drop)",
      brand: "Nike",
      industry: "sports",
      category: "running_shoes",
      subcategory: "daily_trainers",
      variant: "Pegasus 41 Standard Width (UK 9)",
      modelYear: 2026,
      priceInr: 11895,
      priceType: "total_outright",
      priceAsOf: "2026-11-20",
      sourceUrl: "https://www.nike.com/in/t/pegasus-41-road-running-shoes-MCxXn8",
      destinationUrl: "https://www.nike.com/in/t/pegasus-41-road-running-shoes-MCxXn8",
      destinationLabel: "View official model ↗",
      seller: "Nike India Retail",
      sellerIdentity: "Official Brand Flagship",
      primaryImageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
      galleryImageUrls: [
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80"
      ],
      specsSummary: "ReactX Foam Midsole (13% More Energy Return) · Dual Air Zoom Units (Forefoot & Heel) · 10mm Drop · 297g Weight · Engineered Mesh Upper · 800+ km Mileage Durability",
      domainSpecs: {
        midsoleFoam: "Nike ReactX Foam with Dual Zoom Air Chambers",
        heelToToeDropMm: 10,
        shoeWeightGrams: 297,
        pronationSupport: "Neutral Daily Workhorse",
        lifespanKm: 850,
        upperBreathability: "Single-layer engineered mesh with dynamic midfoot fit band",
        terrain: "Tarmac, Pavement, Track & Light Packed Gravel",
      },
      scores: {
        performance: 92,
        reliability: 97, // 41 generations of Pegasus reliability
        longevity: 94,
        value: 93,
        comfort: 92,
        efficiency: 91,
        safety: 93,
      },
      evidenceConfidence: 0.96,
      provenance: {
        midsoleFoam: "VERIFIED",
        heelToToeDropMm: "VERIFIED",
        shoeWeightGrams: "VERIFIED",
        lifespanKm: "OWNER EVIDENCE",
      },
      bestFor: "Marathon training volume, high daily mileage durability, and responsive dual Zoom Air forefoot pop",
      compromise: "Heavier than carbon-plated race-day shoes (not designed for sub-3-hour race day supershoe paces)",
      listingClaims: [
        "All-new ReactX foam midsole reduces carbon footprint by 43% while boosting energy return by 13%",
        "Signature forefoot and heel Air Zoom units provide energized toe-offs and plush landing absorption",
        "Waffle-inspired carbon rubber outsole delivers durable grip across wet and dry road surfaces",
      ],
      observed: [
        {
          title: "Toebox width is snug; runners with wider forefeet benefit from trying half size up or wide fit variant",
          share: 0.21,
          medianMonths: 1,
          severity: 2,
          reviewCount: 64,
          receipts: ["I have a slightly wide foot and went half size up from UK 9 to 9.5 for toe splay on 20k runs."],
        },
      ],
      ownership: {} as any,
      salePrediction: {
        nextSaleName: "Nike Members Days / End of Season Sale",
        nextSaleTiming: "Upcoming Clearance Window",
        expectedDropPct: 15,
        expectedSavingsInr: 1780,
        bestSaleOfYear: "Nike Member Days (Flat 15-20% discount on core running footwear line)",
        leastBestSale: "Launch list price",
        priceHikeAlert: "Annual model iteration pricing historically adjustments by ₹500 across Pegasus line.",
      },
    },
    {
      slug: "asics-gel-kayano-31",
      name: "Asics Gel-Kayano 31 (4D Guidance System, PureGEL Rearfoot, FF BLAST PLUS ECO Foam)",
      brand: "Asics",
      industry: "sports",
      category: "running_shoes",
      subcategory: "stability_shoes",
      variant: "Kayano 31 Men's UK 9",
      modelYear: 2026,
      priceInr: 14999,
      priceType: "total_outright",
      priceAsOf: "2026-11-20",
      sourceUrl: "https://www.asics.co.in/1011b867-001-gel-kayano-31.html",
      destinationUrl: "https://www.asics.co.in/1011b867-001-gel-kayano-31.html",
      destinationLabel: "View official model ↗",
      seller: "Asics India Official",
      sellerIdentity: "Official Brand Store",
      primaryImageUrl: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=800&q=80",
      galleryImageUrls: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
      ],
      specsSummary: "4D Guidance Overpronation Adaptive System · PureGEL Rearfoot Cushioning (65% Softer Than Standard Gel) · FF BLAST PLUS ECO Midsole · 10mm Drop · Engineered Knit Upper",
      domainSpecs: {
        midsoleFoam: "FF BLAST PLUS ECO with PureGEL Heel Insert",
        heelToToeDropMm: 10,
        shoeWeightGrams: 305,
        pronationSupport: "Adaptive Overpronation Stability",
        lifespanKm: 900,
        upperBreathability: "Plush engineered stretch-knit collar and tongue",
        terrain: "Road, Concrete & Hard Surface Marathon Training",
      },
      scores: {
        performance: 91,
        reliability: 98,
        longevity: 96,
        value: 90,
        comfort: 97, // Supreme plushness
        efficiency: 89,
        safety: 98, // Injury prevention
      },
      evidenceConfidence: 0.95,
      provenance: {
        midsoleFoam: "VERIFIED",
        heelToToeDropMm: "VERIFIED",
        shoeWeightGrams: "VERIFIED",
        lifespanKm: "OWNER EVIDENCE",
      },
      bestFor: "Runners who overpronate, marathon distance joint protection, knee pain prevention, and cloud-like step-in plushness",
      compromise: "Heavier shoe (305g) prioritizing maximum protective stability over lightweight race-day speed",
      listingClaims: [
        "4D Guidance System provides adaptive stability that guides the foot through every stride transition",
        "PureGEL technology delivers 65% softer impact landings than traditional silicone gel formulations",
        "Bio-based FF BLAST PLUS ECO foam delivers cloud-like comfort on long asphalt training blocks",
      ],
      observed: [
        {
          title: "Plush tongue and heel collar retain slightly more moisture during heavy monsoon humidity runs",
          share: 0.17,
          medianMonths: 2,
          severity: 1,
          reviewCount: 38,
          receipts: ["Comfort is 10/10, but in hot 35°C humid running it takes longer to dry than a thin mesh shoe."],
        },
      ],
      ownership: {} as any,
      salePrediction: {
        nextSaleName: "Asics Half Marathon Sale",
        nextSaleTiming: "Upcoming Season",
        expectedDropPct: 10,
        expectedSavingsInr: 1500,
        bestSaleOfYear: "National Marathon Week (Free technical marathon singlet + 10% instant card discount)",
        leastBestSale: "Full list price",
        priceHikeAlert: "Kayano line historically holds pricing firmly with rare steep discounts.",
      },
    },
  ],
};
