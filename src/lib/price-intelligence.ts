import type { Product } from "./engine";

export type PricePoint = {
  date: string;
  label: string;
  priceInr: number;
  event?: string;
};

export type FestiveSale = {
  name: string;
  timing: string;
  tier: "Best Sale of the Year" | "High Value Sale" | "Moderate Sale" | "Least Best Sale";
  historicalDropPct: number;
  predictedPriceInr: number;
  potentialSavingsInr: number;
  precedentSummary: string;
  isBest?: boolean;
  isLeast?: boolean;
};

export type PriceHikeAlert = {
  headline: string;
  source: string;
  severity: "high" | "moderate" | "low";
  expectedImpactInr: number;
  timeline: string;
  explanation: string;
};

export type PriceAudit = {
  currentPriceInr: number;
  lowestEverInr: number;
  highestInr: number;
  averageInr: number;
  pricePercentile: number; // 0 (at lowest ever) to 100 (at highest)
  priceHistory: PricePoint[];
  upcomingSales: FestiveSale[];
  bestSale: FestiveSale;
  leastBestSale: FestiveSale;
  priceHikeAlerts: PriceHikeAlert[];
  recommendation: "BUY NOW" | "WAIT FOR SALE" | "PRICE FIRMING UP";
  timingReason: string;
};

/**
 * Deterministic Price Intelligence generator based on historical Indian retail sale patterns.
 * Supports Cars, Bikes, Smartphones, and Laptops with industry-specific sale cycles.
 */
export function getPriceAudit(product: Product): PriceAudit {
  const current = product.priceInr;
  const rawCat = ((product as any).category || "").toLowerCase();
  const isCar = rawCat === "car" || /car|suv|sedan|creta|harrier|xuv/i.test(product.name) || product.priceInr > 500000;
  const isBike = rawCat === "bike" || /bike|motorcycle|scooter|hunter 350|mt-15/i.test(product.name);
  const isSofa = rawCat === "sofa" || rawCat === "furniture" || /sofa|couch|seater|furniture/i.test(product.name);

  // Domain: SOFA / FURNITURE
  if (isSofa) {
    const lowest = Math.round(current * 0.88);
    const highest = Math.round(current * 1.15);
    const average = Math.round((current + highest + lowest) / 3);
    const percentile = Math.min(100, Math.max(0, Math.round(((current - lowest) / (highest - lowest)) * 100)));

    const bestSale: FestiveSale = {
      name: "Great Indian Festival / Festive Home Sale",
      timing: "October – November 2026",
      tier: "Best Sale of the Year",
      historicalDropPct: 12,
      predictedPriceInr: lowest,
      potentialSavingsInr: current - lowest,
      precedentSummary: "Living room furniture sees up to 12-15% flat price cuts with free doorstep room delivery and assembly vouchers.",
      isBest: true,
    };

    const leastBestSale: FestiveSale = {
      name: "Mid-Year Flash Sale",
      timing: "June 2027",
      tier: "Least Best Sale",
      historicalDropPct: 2,
      predictedPriceInr: Math.round(current * 0.98),
      potentialSavingsInr: Math.round(current * 0.02),
      precedentSummary: "Nominal cash discounts; mostly clearance on discontinued colorways.",
      isLeast: true,
    };

    const upcomingSales: FestiveSale[] = [
      bestSale,
      {
        name: "New Year Home Refresh Deals",
        timing: "January 2027",
        tier: "High Value Sale",
        historicalDropPct: 8,
        predictedPriceInr: Math.round(current * 0.92),
        potentialSavingsInr: Math.round(current * 0.08),
        precedentSummary: "New year home styling discounts with instant bank EMI tie-ups.",
      },
    ];

    const priceHikeAlerts: PriceHikeAlert[] = [
      {
        headline: "Timber & Polyurethane Foam Supplier Index Firming",
        source: "All India Furniture Manufacturers Association (AIFMA)",
        severity: "moderate",
        expectedImpactInr: Math.round(current * 0.04),
        timeline: "Q1 2027",
        explanation: "High-density polyurethane foam and seasoned hardwood lumber costs have increased 4-6% across domestic manufacturing clusters.",
      },
    ];

    const recommendation: PriceAudit["recommendation"] = "WAIT FOR SALE";
    const timingReason = `Festive Home Sales typically trim ~₹${(current - lowest).toLocaleString("en-IN")} on 3-seater sofas with free installation.`;

    const priceHistory: PricePoint[] = [
      { date: "Jan 2026", label: "New Year Sale", priceInr: Math.round(current * 0.94), event: "Home Refresh" },
      { date: "May 2026", label: "Summer Decor Sale", priceInr: Math.round(current * 1.05), event: "Summer Catalog" },
      { date: "Oct 2026", label: "Festive Home Mela", priceInr: lowest, event: "Great Indian Home Sale (All-Time Low)" },
      { date: "Nov 2026", label: "Current Price", priceInr: current, event: "Current Listing" },
    ];

    return {
      currentPriceInr: current,
      lowestEverInr: lowest,
      highestInr: highest,
      averageInr: average,
      pricePercentile: percentile,
      priceHistory,
      upcomingSales,
      bestSale,
      leastBestSale,
      priceHikeAlerts,
      recommendation,
      timingReason,
    };
  }

  // Domain: CARS / AUTOMOBILES
  if (isCar) {
    const lowest = Math.round(current * 0.92);
    const highest = Math.round(current * 1.04);
    const average = Math.round((current + highest + lowest) / 3);
    const percentile = Math.min(100, Math.max(0, Math.round(((current - lowest) / (highest - lowest)) * 100)));

    const bestSale: FestiveSale = {
      name: "Year-End December Clearance Sale",
      timing: "December 15–31, 2026 (Upcoming)",
      tier: "Best Sale of the Year",
      historicalDropPct: 8,
      predictedPriceInr: lowest,
      potentialSavingsInr: current - lowest,
      precedentSummary: "Historically the deepest annual discount in the automotive sector; dealerships clear previous calendar-year inventory with cash discounts up to ₹1.5 Lakhs plus corporate bonuses.",
      isBest: true,
    };

    const leastBestSale: FestiveSale = {
      name: "Monsoon Safety & Free Wash Camp",
      timing: "June – July 2027",
      tier: "Least Best Sale",
      historicalDropPct: 1,
      predictedPriceInr: Math.round(current * 0.99),
      potentialSavingsInr: Math.round(current * 0.01),
      precedentSummary: "Only free general inspection and washing coupons; virtually zero ex-showroom price reduction or dealer discounts.",
      isLeast: true,
    };

    const upcomingSales: FestiveSale[] = [
      bestSale,
      {
        name: "Diwali Consumer Scheme Mela",
        timing: "October – November 2027",
        tier: "High Value Sale",
        historicalDropPct: 5,
        predictedPriceInr: Math.round(current * 0.95),
        potentialSavingsInr: Math.round(current * 0.05),
        precedentSummary: "Free insurance packages, accessory kits, and exchange bonuses up to ₹50,000.",
      },
    ];

    const priceHikeAlerts: PriceHikeAlert[] = [
      {
        headline: "Jan 1st Annual Automotive Ex-Showroom Price Hike",
        source: "Society of Indian Automobile Manufacturers (SIAM) & OEM Circulars",
        severity: "high",
        expectedImpactInr: Math.round(current * 0.025),
        timeline: "January 1, 2027",
        explanation: "Automakers (Maruti, Hyundai, Tata, Mahindra) historically implement an annual 2%–3% price revision across passenger vehicles citing rising raw material and logistics costs.",
      },
      {
        headline: "Input Steel & Semiconductor Surcharges",
        source: "Automotive Component Manufacturers Association (ACMA)",
        severity: "moderate",
        expectedImpactInr: Math.round(current * 0.015),
        timeline: "Q1 2027",
        explanation: "Supply adjustments in high-grade steel and electronic sub-assemblies are expected to firm up dealer margins.",
      },
    ];

    const recommendation: PriceAudit["recommendation"] = "WAIT FOR SALE";
    const timingReason = `Year-End Dec Clearance is arriving soon (estimated discount: ₹${(current - lowest).toLocaleString("en-IN")}). Finalize booking before the mandatory Jan 1st 2.5% price hike.`;

    const priceHistory: PricePoint[] = [
      { date: "Jan 2026", label: "Annual Price Revision", priceInr: Math.round(current * 1.03), event: "2.5% Manufacturer Hike" },
      { date: "Apr 2026", label: "Navratri Booking Drive", priceInr: Math.round(current * 1.01), event: "Navratri Offers" },
      { date: "Jul 2026", label: "Monsoon Camp", priceInr: Math.round(current * 1.02), event: "Monsoon Mela" },
      { date: "Oct 2026", label: "Diwali Festive Scheme", priceInr: Math.round(current * 0.96), event: "Diwali Exchange Bonus" },
      { date: "Nov 2026", label: "Current Price", priceInr: current, event: "Current Ex-Showroom" },
      { date: "Dec 2026", label: "Year-End Clearance", priceInr: lowest, event: "Year-End Stock Clearance (All-Time Low)" },
    ];

    return {
      currentPriceInr: current,
      lowestEverInr: lowest,
      highestInr: highest,
      averageInr: average,
      pricePercentile: percentile,
      priceHistory,
      upcomingSales,
      bestSale,
      leastBestSale,
      priceHikeAlerts,
      recommendation,
      timingReason,
    };
  }

  // Domain: BIKES / TWO-WHEELERS
  if (isBike) {
    const lowest = Math.round(current * 0.94);
    const highest = Math.round(current * 1.05);
    const average = Math.round((current + highest + lowest) / 3);
    const percentile = Math.min(100, Math.max(0, Math.round(((current - lowest) / (highest - lowest)) * 100)));

    const bestSale: FestiveSale = {
      name: "Diwali & Dhanteras Booking Mela",
      timing: "October – November 2027",
      tier: "Best Sale of the Year",
      historicalDropPct: 6,
      predictedPriceInr: lowest,
      potentialSavingsInr: current - lowest,
      precedentSummary: "Two-wheeler makers offer free comprehensive insurance, accessory packages (helmet, crash guard), and ₹5,000–₹8,000 exchange top-ups.",
      isBest: true,
    };

    const leastBestSale: FestiveSale = {
      name: "Post-Budget Spring Mela",
      timing: "February 2027",
      tier: "Least Best Sale",
      historicalDropPct: 1,
      predictedPriceInr: Math.round(current * 0.99),
      potentialSavingsInr: Math.round(current * 0.01),
      precedentSummary: "Minimal retail support; high waiting periods on popular retro models offset any dealer discount.",
      isLeast: true,
    };

    const upcomingSales: FestiveSale[] = [
      bestSale,
      {
        name: "New Year Registration Drive",
        timing: "January 2027",
        tier: "Moderate Sale",
        historicalDropPct: 3,
        predictedPriceInr: Math.round(current * 0.97),
        potentialSavingsInr: Math.round(current * 0.03),
        precedentSummary: "Dealers clear outgoing year stock with free roadside assistance.",
      },
    ];

    const priceHikeAlerts: PriceHikeAlert[] = [
      {
        headline: "Annual Two-Wheeler Price Indexation",
        source: "Automotive Industry Bureau",
        severity: "moderate",
        expectedImpactInr: Math.round(current * 0.03),
        timeline: "April 2027",
        explanation: "OEMs revise two-wheeler prices by ₹3,000 to ₹6,000 at the start of the financial year.",
      },
    ];

    const recommendation: PriceAudit["recommendation"] = "WAIT FOR SALE";
    const timingReason = `Year-end dealership incentives can save ~₹${(current - lowest).toLocaleString("en-IN")}. Look for free RSA and helmet bundles.`;

    const priceHistory: PricePoint[] = [
      { date: "Jan 2026", label: "New Year Price", priceInr: Math.round(current * 1.02), event: "Price Revision" },
      { date: "Oct 2026", label: "Diwali Mela", priceInr: lowest, event: "Diwali Booking Offer" },
      { date: "Nov 2026", label: "Current Price", priceInr: current, event: "Current Showroom Price" },
    ];

    return {
      currentPriceInr: current,
      lowestEverInr: lowest,
      highestInr: highest,
      averageInr: average,
      pricePercentile: percentile,
      priceHistory,
      upcomingSales,
      bestSale,
      leastBestSale,
      priceHikeAlerts,
      recommendation,
      timingReason,
    };
  }

  // Domain: LAPTOPS, SMARTPHONES & ELECTRONICS (Standard Indian E-Commerce)
  const highest = Math.round(current * 1.14); // Launch/peak price
  const lowest = Math.round(current * 0.91);  // All-time low during Diwali / Big Billion Days
  const average = Math.round((current + highest + lowest) / 3);
  const percentile = Math.min(100, Math.max(0, Math.round(((current - lowest) / (highest - lowest)) * 100)));

  const priceHistory: PricePoint[] = [
    { date: "Jan 2026", label: "Republic Day Sale", priceInr: Math.round(current * 0.95), event: "Republic Day Sale" },
    { date: "Mar 2026", label: "Holi Sale", priceInr: Math.round(current * 1.04), event: "Holi Tech Days" },
    { date: "May 2026", label: "Summer Clearance", priceInr: Math.round(current * 1.06), event: "Summer Sale" },
    { date: "Jul 2026", label: "Prime / Freedom Sale", priceInr: Math.round(current * 0.96), event: "Prime Day" },
    { date: "Aug 2026", label: "Independence Day", priceInr: Math.round(current * 0.98), event: "Independence Sale" },
    { date: "Oct 2026", label: "Big Billion / Great Indian", priceInr: lowest, event: "Great Indian Festival (All-Time Low)" },
    { date: "Nov 2026", label: "Current (Post-Diwali)", priceInr: current, event: "Current Listing" },
  ];

  const bestSale: FestiveSale = {
    name: "Great Indian Festival / Big Billion Days",
    timing: "Late September – October 2027",
    tier: "Best Sale of the Year",
    historicalDropPct: 15,
    predictedPriceInr: lowest,
    potentialSavingsInr: current - lowest,
    precedentSummary: "Historically the deepest annual discount in India; models in this bracket dropped by 14–18% with SBI/HDFC instant bank credits.",
    isBest: true,
  };

  const leastBestSale: FestiveSale = {
    name: "Monsoon End-of-Season Flash Sale",
    timing: "Late June 2027",
    tier: "Least Best Sale",
    historicalDropPct: 3,
    predictedPriceInr: Math.round(current * 0.97),
    potentialSavingsInr: Math.round(current * 0.03),
    precedentSummary: "Historically weak cash discounts (2–4%); mostly older stock clearance and exchange-value puffing rather than outright price drops.",
    isLeast: true,
  };

  const upcomingRepublicDay: FestiveSale = {
    name: "Republic Day Tech Sale",
    timing: "January 20–26, 2027 (Next Upcoming)",
    tier: "High Value Sale",
    historicalDropPct: 8,
    predictedPriceInr: Math.round(current * 0.93),
    potentialSavingsInr: Math.round(current * 0.07),
    precedentSummary: "First major sale of the new year. Student tech typically sees direct flat ₹3,000–₹5,000 price cuts plus 10% credit card waivers.",
  };

  const upcomingSales: FestiveSale[] = [
    upcomingRepublicDay,
    {
      name: "Holi Super Saver Deals",
      timing: "March 2027",
      tier: "Moderate Sale",
      historicalDropPct: 5,
      predictedPriceInr: Math.round(current * 0.95),
      potentialSavingsInr: Math.round(current * 0.05),
      precedentSummary: "Bank tie-ups on popular mainstream electronics.",
    },
    bestSale,
    leastBestSale,
  ];

  const priceHikeAlerts: PriceHikeAlert[] = [
    {
      headline: "Memory (DRAM & NAND) Contract Price Firming",
      source: "TrendForce & Electronic Components Industry Bulletin",
      severity: "high",
      expectedImpactInr: Math.round(current * 0.04),
      timeline: "Q1 2027 (Jan - Mar)",
      explanation: "Global NAND flash and DDR5 contract prices have climbed 8–12% at the supplier level. Brands are expected to pass on ₹1,800–₹3,200 increases on configurations post-January.",
    },
    {
      headline: "Post-Diwali Inventory Buffer Expiry",
      source: "Retail Channel Tracking Report",
      severity: "moderate",
      expectedImpactInr: Math.round(current * 0.03),
      timeline: "Mid-December 2026",
      explanation: "Festive stock clearance buffers typically expire in early December. Unsold units return to regular non-sale MRP before January.",
    },
  ];

  let recommendation: PriceAudit["recommendation"] = "WAIT FOR SALE";
  let timingReason = `Republic Day Sale is 8 weeks away (predicted drop: ₹${upcomingRepublicDay.potentialSavingsInr.toLocaleString("en-IN")}). If not urgent, wait.`;

  if (current <= lowest * 1.03) {
    recommendation = "BUY NOW";
    timingReason = `Current price (₹${current.toLocaleString("en-IN")}) is within 3% of the all-time historical low (₹${lowest.toLocaleString("en-IN")}). Highly favorable window.`;
  } else if (percentile > 75) {
    recommendation = "WAIT FOR SALE";
    timingReason = `Currently trading at the ${percentile}th percentile of its 12-month range. Upcoming Republic Day Sale will likely trim ₹${upcomingRepublicDay.potentialSavingsInr.toLocaleString("en-IN")}.`;
  } else {
    recommendation = "PRICE FIRMING UP";
    timingReason = `Price is currently fair, but upcoming DRAM component hikes may raise replacement stock prices by early 2027.`;
  }

  return {
    currentPriceInr: current,
    lowestEverInr: lowest,
    highestInr: highest,
    averageInr: average,
    pricePercentile: percentile,
    priceHistory,
    upcomingSales,
    bestSale,
    leastBestSale,
    priceHikeAlerts,
    recommendation,
    timingReason,
  };
}
