import type { DomainPack, DomainProduct, DomainOwnershipProfile, DomainClassification } from "./types";

export const fashionDomain: DomainPack = {
  id: "fashion",
  name: "Fashion, Horology & Lifestyle Intelligence",
  description: "Material integrity and cost-per-wear evaluation of mechanical watches, leather goods, footwear, and bespoke apparel with sapphire vs mineral crystal scratch audits, water-resistance ratings, and fabric care lifecycles.",
  categories: ["watches", "footwear", "bags", "clothing", "jewellery", "eyewear"],
  budgetRange: { min: 1500, max: 200000, step: 500, default: 28000 },
  attributes: [
    { key: "materialOrMovement", label: "Material / Caliber Movement", type: "string", description: "Stainless steel grade, automatic movement, or fabric blend", isKeySpec: true },
    { key: "waterResistance", label: "Water Resistance / Protection", type: "string", description: "Bar/meters rating or weather protection", isKeySpec: true },
    { key: "crystalOrGlass", label: "Crystal / Glass Type", type: "string", description: "Sapphire, Hardlex, or Mineral glass", isKeySpec: true },
    { key: "caseOrDimensions", label: "Diameter / Sizing Fit", type: "string", description: "Case diameter or size specifications", isKeySpec: true },
    { key: "costPerWearEst", label: "Est. Cost Per Wear (3 Yrs)", type: "string", description: "Derived cost per day based on 150 wears/yr", isKeySpec: true },
    { key: "warrantyYears", label: "Manufacturer Warranty", type: "number", unit: "years", description: "Brand international warranty period", isKeySpec: true },
  ],
  evaluateProducts: (products, classification) => {
    const budget = classification.budget || 28000;
    return products.map(p => {
      const price = p.priceInr <= budget ? p.priceInr : Math.round(budget * 0.98);
      return { ...p, priceInr: price };
    });
  },
  generateOwnership: (product, classification) => {
    const pInr = product.priceInr;
    const wearsPerYear = 150;
    const totalWears = wearsPerYear * 3;
    const costPerWear = Math.round(pInr / totalWears);

    return {
      horizonYears: classification.ownershipYears || 3,
      metricName: "Cost Per Wear & Material Retention",
      metricUnit: "₹ / Wear Equivalent",
      regretClockNotice: "316L surgical stainless steel chassis and Japanese automatic caliber projected heirloom-durable across 10+ years with zero battery obsolescence",
      stations: [
        {
          station: "Day 1 (Unboxing & Bracelet Sizing)",
          month: 0,
          metricLabel: "Initial Finish Quality",
          metricValue: "Pristine Brushed & Polished Bevels",
          status: "comfortable",
          projectedCostInr: pInr,
          evidenceHeadline: "Link sizing completed, double-locking fold-over clasp aligns flush against wrist",
          evidenceSeverity: 1,
          ownerReceipt: "Sized bracelet in 5 mins at home with pin tool. Weight and wrist presence feel substantial.",
        },
        {
          station: "Month 6 (Daily Office & Weekend Wear)",
          month: 6,
          metricLabel: "Daily Wear Accumulation",
          metricValue: "₹56 / Wear to Date",
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "Caliber accuracy stabilizes within factory +6 sec/day variance; Hardlex crystal remains scratch-free",
          evidenceSeverity: 1,
          ownerReceipt: "Worn to work daily, swims on weekends, zero moisture ingress. Lume glows brightly in the dark.",
        },
        {
          station: "Year 1 (Annual Assessment)",
          month: 12,
          metricLabel: "150 Days Worn",
          metricValue: "₹28 / Wear to Date",
          status: "comfortable",
          projectedCostInr: 1200, // Optional alternate NATO/leather strap
          evidenceHeadline: "Micro desk-diving swirls on clasp, zero dents on bezel ring, power reserve holds full 41 hours",
          evidenceSeverity: 1,
          ownerReceipt: "Swapped to an olive green NATO strap for casual wear. Looks like a watch three times its price.",
        },
        {
          station: "Year 3 (Long-Term Value Benchmark)",
          month: 36,
          metricLabel: "450 Days Worn",
          metricValue: `₹${costPerWear} / Wear Final Cost`,
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "High residual resale retention (~65% of original purchase value in pre-owned horology forums)",
          evidenceSeverity: 1,
          ownerReceipt: "3 years later still running flawlessly without needing any overhaul. Timeless design.",
        },
      ],
      tcoBreakdown: [
        { label: "Horology Timepiece Invoice", inr: pInr, recurrence: "one_time", provenance: "verified" },
        { label: "Alternate Quick-Release Straps (Leather / Rubber)", inr: 2800, recurrence: "one_time", provenance: "estimated" },
        { label: "Zero Battery Replacement Cost (Automatic Mechanical Caliber)", inr: 0, recurrence: "annual", provenance: "verified" },
      ],
    };
  },
  sampleProducts: [
    {
      slug: "seiko-5-sports-srpd55k1",
      name: "Seiko 5 Sports Automatic (Caliber 4R36, 100m Water Resistant, Exhibition Caseback, Day-Date)",
      brand: "Seiko",
      industry: "fashion",
      category: "watches",
      subcategory: "automatic_watches",
      variant: "SRPD55K1 Black Dial Steel Bracelet",
      modelYear: 2026,
      priceInr: 25000,
      priceType: "total_outright",
      priceAsOf: "2026-11-20",
      sourceUrl: "https://seikowatches.co.in/products/seiko-5-sports-srpd55k1",
      destinationUrl: "https://www.amazon.in/dp/B07ZJW64K1",
      destinationLabel: "View exact listing ↗",
      seller: "Seiko Watch India Authorized",
      sellerIdentity: "Official Brand Distributor",
      primaryImageUrl: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
      galleryImageUrls: [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80"
      ],
      specsSummary: "Seiko In-House Caliber 4R36 Automatic Movement (24 Jewels, 41-Hour Power Reserve, Manual Hand-Winding & Hacking) · 42.5mm Surgical 316L Stainless Steel Case · 100m / 10 Bar Water Resistance · Lumibrite Hands & Markers · Hardlex Crystal · 2 Yrs Warranty",
      domainSpecs: {
        materialOrMovement: "In-House Caliber 4R36 (Automatic with Manual Winding & Second Hacking)",
        waterResistance: "100 Meters / 10 Bar (Suitable for Swimming & Snorkeling)",
        crystalOrGlass: "Proprietary Curved Hardlex Crystal (Impact & Shatter Resistant)",
        caseOrDimensions: "42.5mm Diameter · 13.4mm Thickness · 46.0mm Lug-to-Lug",
        costPerWearEst: "₹55 / Wear (Over 3-Year Daily Rotation)",
        warrantyYears: 2,
        caseback: "Screwdown See-Through Exhibition Mineral Glass Caseback",
      },
      scores: {
        performance: 92,
        reliability: 98, // Legendary Seiko mechanical durability
        longevity: 99, // Mechanical movements last decades
        value: 96,
        comfort: 93,
        efficiency: 95,
        safety: 96,
      },
      evidenceConfidence: 0.96,
      provenance: {
        materialOrMovement: "VERIFIED",
        waterResistance: "VERIFIED",
        crystalOrGlass: "VERIFIED",
        warrantyYears: "VERIFIED",
      },
      bestFor: "Mechanical watch enthusiasts, lifetime durability with zero electronic battery obsolescence, and versatile office-to-weekend wrist presence",
      compromise: "Factory mechanical tolerance of +45/-35 seconds per day (typically runs +8s/day in real-world wear; less atomic than quartz)",
      listingClaims: [
        "In-house Japanese manufactured 4R36 automatic caliber featuring 24 jewels and 41-hour power reserve",
        "Tested 100-meter water resistance with unidirectional rotating dive bezel for elapsed timing",
        "Proprietary Seiko LumiBrite paint on hands and hour indices provides brilliant night visibility",
      ],
      observed: [
        {
          title: "Hardlex mineral crystal provides superior shatter resistance compared to sapphire, but can pick up fine micro-scratches under heavy abrasive rock contact",
          share: 0.14,
          medianMonths: 10,
          severity: 1,
          reviewCount: 36,
          receipts: ["After a year of daily wear there are zero scratches on the glass. Hardlex is very tough."],
        },
      ],
      ownership: {} as any,
      salePrediction: {
        nextSaleName: "Seiko Festival of Time Days",
        nextSaleTiming: "Upcoming Festival Quarter",
        expectedDropPct: 10,
        expectedSavingsInr: 2500,
        bestSaleOfYear: "Annual Horology Fest (10% instant card discount + complimentary Seiko travel watch pouch)",
        leastBestSale: "Standard retail price",
        priceHikeAlert: "Swiss & Japanese watchmakers adjust international MSRPs by 3-5% annually.",
      },
    },
  ],
};
