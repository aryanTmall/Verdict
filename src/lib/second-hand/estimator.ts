/**
 * VERDICT — Second-Hand Fair Price Estimator & Decision Intelligence Engine
 */

import type {
  FairPriceValuation,
  UsedDealScore,
  UsedDealAction,
  InspectionCheckItem,
  NegotiationStrategy,
  NewVsUsedMatrix,
  UsedRegretHorizonItem,
} from "./types";

/**
 * Standard annual depreciation rates in India by category (empirical retail market norms)
 */
const ANNUAL_DEPRECIATION_RATES: Record<string, { year1: number; subsequentYears: number; floorPct: number }> = {
  electronics: { year1: 0.28, subsequentYears: 0.15, floorPct: 0.20 },
  laptops: { year1: 0.26, subsequentYears: 0.14, floorPct: 0.22 },
  smartphones: { year1: 0.32, subsequentYears: 0.18, floorPct: 0.18 },
  cars: { year1: 0.15, subsequentYears: 0.08, floorPct: 0.30 },
  automotive: { year1: 0.15, subsequentYears: 0.08, floorPct: 0.30 },
  appliances: { year1: 0.22, subsequentYears: 0.12, floorPct: 0.25 },
  cameras: { year1: 0.20, subsequentYears: 0.10, floorPct: 0.28 },
  universal: { year1: 0.25, subsequentYears: 0.12, floorPct: 0.20 },
};

/**
 * Calculates realistic fair price range based on age, condition, category depreciation, and invoice status.
 */
export function estimateFairUsedPrice(params: {
  productName: string;
  category: string;
  currentNewPriceInr: number;
  askingPriceInr: number;
  ageMonths: number;
  condition: "LIKE_NEW" | "EXCELLENT" | "GOOD" | "FAIR";
  hasOriginalInvoice?: boolean;
  hasBoxAndAccessories?: boolean;
  comparableListingsCount?: number;
}): FairPriceValuation {
  const cat = params.category.toLowerCase();
  const rates =
    ANNUAL_DEPRECIATION_RATES[cat] ||
    (cat.includes("car") ? ANNUAL_DEPRECIATION_RATES.cars : ANNUAL_DEPRECIATION_RATES.universal);

  const ageYears = Math.max(0.1, params.ageMonths / 12);
  let depreciatedFactor = 1.0;

  if (ageYears <= 1) {
    depreciatedFactor = 1.0 - rates.year1 * ageYears;
  } else {
    depreciatedFactor = 1.0 - rates.year1 - rates.subsequentYears * (ageYears - 1);
  }
  depreciatedFactor = Math.max(rates.floorPct, depreciatedFactor);

  // Condition multipliers
  const conditionMultipliers = {
    LIKE_NEW: 1.08,
    EXCELLENT: 1.0,
    GOOD: 0.90,
    FAIR: 0.78,
  };
  const condMult = conditionMultipliers[params.condition] || 1.0;

  // Invoice & Box bonuses
  const invoiceFactor = params.hasOriginalInvoice ? 1.04 : 0.96;
  const accessoriesFactor = params.hasBoxAndAccessories ? 1.03 : 0.97;

  const baselineFair = Math.round(
    params.currentNewPriceInr * depreciatedFactor * condMult * invoiceFactor * accessoriesFactor
  );

  const fairPriceMinInr = Math.round(baselineFair * 0.92);
  const fairPriceMaxInr = Math.round(baselineFair * 1.08);
  const fairPriceMedianInr = baselineFair;

  const priceDeltaInr = params.askingPriceInr - fairPriceMedianInr;
  const priceDeltaPct = Math.round((priceDeltaInr / fairPriceMedianInr) * 100);

  let dealQuality: FairPriceValuation["dealQuality"] = "FAIR_MARKET_PRICE";
  if (priceDeltaPct < -22) dealQuality = "SUSPICIOUSLY_CHEAP";
  else if (priceDeltaPct < -8) dealQuality = "OUTSTANDING_DEAL";
  else if (priceDeltaPct <= 8) dealQuality = "FAIR_MARKET_PRICE";
  else if (priceDeltaPct <= 20) dealQuality = "SLIGHTLY_OVERPRICED";
  else dealQuality = "OVERPRICED";

  const comparables = params.comparableListingsCount ?? 8;
  const confidence: FairPriceValuation["confidence"] =
    comparables >= 6 ? "STRONGLY_SUPPORTED" : comparables >= 3 ? "MODERATELY_SUPPORTED" : "WEAK_ESTIMATE";

  let marketContextExplanation = `Fair market valuation is ₹${fairPriceMinInr.toLocaleString("en-IN")} — ₹${fairPriceMaxInr.toLocaleString("en-IN")} based on ${params.ageMonths} months observed age and ${params.condition.replace(/_/g, " ")} condition.`;
  if (dealQuality === "SUSPICIOUSLY_CHEAP") {
    marketContextExplanation += ` Warning: Asking price is ${Math.abs(priceDeltaPct)}% below typical floor. Verify against stolen goods or hardware faults.`;
  } else if (dealQuality === "OVERPRICED") {
    marketContextExplanation += ` Asking price has ${priceDeltaPct}% seller markup above market median. Strong room for aggressive negotiation.`;
  }

  return {
    askingPriceInr: params.askingPriceInr,
    fairPriceMinInr,
    fairPriceMaxInr,
    fairPriceMedianInr,
    priceDeltaInr,
    priceDeltaPct,
    dealQuality,
    confidence,
    comparableListingsCount: comparables,
    marketContextExplanation,
  };
}

/**
 * Calculates a dedicated Used Deal Score (0-100) and outputs clear action advice.
 */
export function calculateUsedDealScore(params: {
  valuation: FairPriceValuation;
  condition: "LIKE_NEW" | "EXCELLENT" | "GOOD" | "FAIR";
  sellerRating?: number;
  isVerifiedSeller?: boolean;
  warrantyRemainingMonths?: number;
  hasOriginalInvoice?: boolean;
}): UsedDealScore {
  const sellerRating = params.sellerRating ?? 4.4;
  const isVerified = params.isVerifiedSeller ?? false;
  const warrantyMonths = params.warrantyRemainingMonths ?? 0;

  // 1. Fair price score (0-40 pts)
  let fairPriceScore = 25;
  if (params.valuation.dealQuality === "OUTSTANDING_DEAL") fairPriceScore = 38;
  else if (params.valuation.dealQuality === "FAIR_MARKET_PRICE") fairPriceScore = 30;
  else if (params.valuation.dealQuality === "SLIGHTLY_OVERPRICED") fairPriceScore = 18;
  else if (params.valuation.dealQuality === "OVERPRICED") fairPriceScore = 8;
  else if (params.valuation.dealQuality === "SUSPICIOUSLY_CHEAP") fairPriceScore = 15; // penalize suspiciousness

  // 2. Condition score (0-30 pts)
  const conditionScores = { LIKE_NEW: 30, EXCELLENT: 26, GOOD: 20, FAIR: 12 };
  const conditionScore = conditionScores[params.condition];

  // 3. Risk score (0-30 pts, lower risk = more points)
  let riskScore = 15;
  if (params.valuation.dealQuality === "SUSPICIOUSLY_CHEAP") riskScore += 25;
  if (!params.hasOriginalInvoice) riskScore += 15;
  if (!isVerified) riskScore += 10;
  if (sellerRating < 4.0) riskScore += 20;
  if (warrantyMonths === 0) riskScore += 10;
  riskScore = Math.min(100, Math.max(5, riskScore));

  const trustScore = Math.max(0, 30 - Math.round(riskScore * 0.3));

  const overallScore = Math.min(100, Math.max(10, fairPriceScore + conditionScore + trustScore));

  let recommendedAction: UsedDealAction = "BUY_IF_NEGOTIATED";
  const actionReasoning: string[] = [];

  if (riskScore >= 60 || params.valuation.dealQuality === "SUSPICIOUSLY_CHEAP") {
    recommendedAction = "AVOID";
    actionReasoning.push("High fraud, hardware defect, or counterfeit risk detected.");
    actionReasoning.push("Price or seller provenance fails minimum authenticity threshold.");
  } else if (params.valuation.dealQuality === "OVERPRICED") {
    recommendedAction = "BUY_IF_NEGOTIATED";
    actionReasoning.push(`Asking price is ${params.valuation.priceDeltaPct}% above reasonable market median.`);
    actionReasoning.push("Do not buy at asking price. Use our negotiation script to counter-offer.");
  } else if (overallScore >= 80 && (warrantyMonths > 0 || isVerified)) {
    recommendedAction = "BUY";
    actionReasoning.push("Strong price-to-condition ratio backed by verified seller or remaining warranty.");
    actionReasoning.push("Significant savings achieved without unacceptable hardware risk.");
  } else if (params.condition === "GOOD" || params.condition === "FAIR" || warrantyMonths === 0) {
    recommendedAction = "INSPECT_FIRST";
    actionReasoning.push("No manufacturer warranty remains. In-person physical testing is mandatory.");
    actionReasoning.push("Check battery health and component authenticity before transferring payment.");
  } else {
    recommendedAction = "BUY_IF_NEGOTIATED";
    actionReasoning.push("Solid foundation, but price has 8-12% negotiation headroom.");
  }

  const mandatoryPrePurchaseSteps = [
    "Verify matching serial/IMEI number against original retail box and invoice.",
    "Do not transfer advance token payments over UPI/WhatsApp prior to hands-on testing.",
    "Inspect physical ports, display glass, and thermal stability under 5-minute heavy benchmark.",
    "Meet at a well-lit, public location or verified platform inspection hub.",
  ];

  let summaryHeadline = `Used Deal Score: ${overallScore}/100 — ${recommendedAction.replace(/_/g, " ")}`;

  return {
    overallScore,
    fairPriceScore,
    conditionScore,
    riskScore,
    recommendedAction,
    confidence: "HIGH",
    summaryHeadline,
    actionReasoning,
    mandatoryPrePurchaseSteps,
  };
}

/**
 * Returns comprehensive category-specific physical inspection checklist items.
 */
export function getCategoryInspectionChecklist(category: string): InspectionCheckItem[] {
  const cat = (category || "").toLowerCase();

  if (cat.includes("car") || cat.includes("auto") || cat.includes("bike")) {
    return [
      {
        id: "rc_hypothecation",
        label: "RC Transfer & Bank Hypothecation NOC",
        category: "Legal & Documentation",
        severity: "CRITICAL",
        howToInspect: "Verify original Registration Certificate (RC) status on Parivahan portal. Ensure loan clearance NOC from financier is active.",
        redFlagDescription: "Active pending bank loan or mismatch between seller name and registered owner on RC.",
      },
      {
        id: "accidental_apron",
        label: "Chassis Apron, Pillar & Panel Welds",
        category: "Structural Safety",
        severity: "CRITICAL",
        howToInspect: "Open bonnet and inspect engine bay aprons for non-factory seam sealant, repainted bolts, or crumpled steel.",
        redFlagDescription: "Uneven wavy sealant beads indicate structural rebuild after front collision.",
      },
      {
        id: "odometer_tampering",
        label: "Odometer Consistency vs Service Log",
        category: "Wear & Integrity",
        severity: "HIGH",
        howToInspect: "Match instrument cluster mileage with authorized service station digital records (Maruti/Hyundai/Tata central DB).",
        redFlagDescription: "Worn steering grip and bald brake pedals on a car claiming under 30,000 km.",
      },
      {
        id: "tyres_and_brakes",
        label: "Tyre DOT Manufacturing Date & Tread",
        category: "Running Gear",
        severity: "HIGH",
        howToInspect: "Check 4-digit DOT week/year code on sidewall (e.g. 2422 = 24th week of 2022). Verify minimum 3mm tread depth.",
        redFlagDescription: "Uneven inside shoulder tyre wear indicates bent suspension control arms or severe misalignment.",
      },
      {
        id: "flood_rust",
        label: "Flood Line & Under-Dashboard Rust",
        category: "Environmental Damage",
        severity: "CRITICAL",
        howToInspect: "Unclip door rubber weatherstripping and inspect seat frame mounting brackets beneath carpet with a torch.",
        redFlagDescription: "Silt residue behind dashboard wiring or rusted seat rails indicates submerged flood history.",
      },
    ];
  }

  if (cat.includes("phone") || cat.includes("mobile") || cat.includes("iphone")) {
    return [
      {
        id: "imei_blacklist",
        label: "IMEI Status & Carrier Blacklist",
        category: "Authenticity & Legal",
        severity: "CRITICAL",
        howToInspect: "Dial *#06# to obtain hardware IMEI. Verify on CEIR (Department of Telecommunications portal) to ensure not reported stolen.",
        redFlagDescription: "IMEI mismatch between SIM tray, Settings software screen, and retail invoice.",
      },
      {
        id: "activation_frp_lock",
        label: "iCloud / Google FRP Activation Lock",
        category: "Security",
        severity: "CRITICAL",
        howToInspect: "Perform full factory wipe in presence of seller. Ensure device boots to 'Hello' setup screen with no previous Apple ID or Google lock.",
        redFlagDescription: "Seller claims they 'forgot password' or refuses to factory-reset in front of you.",
      },
      {
        id: "battery_health_percentage",
        label: "Battery Maximum Capacity & Cycle Count",
        category: "Hardware Longevity",
        severity: "HIGH",
        howToInspect: "Check Battery Health in Settings (or 3uTools on PC). Verify percentage is above 82%.",
        redFlagDescription: "Battery health below 80% requires immediate ₹4,500 - ₹8,500 replacement.",
      },
      {
        id: "display_replacement",
        label: "Display Authenticity (TrueTone / 120Hz)",
        category: "Component Integrity",
        severity: "HIGH",
        howToInspect: "Test TrueTone toggle, inspect bezel symmetry at bottom chin, and verify smooth 120Hz scrolling.",
        redFlagDescription: "Missing TrueTone or thick uneven bottom chin reveals cheap local TFT replacement screen.",
      },
      {
        id: "water_damage_indicator",
        label: "Liquid Contact Indicator (LCI)",
        category: "Moisture & Longevity",
        severity: "CRITICAL",
        howToInspect: "Shine a torch into SIM tray slot. The indicator strip must be pure white.",
        redFlagDescription: "Red or pink indicator strip signals internal water exposure and impending board failure.",
      },
    ];
  }

  if (
    cat.includes("laptop") ||
    cat.includes("macbook") ||
    cat.includes("pc") ||
    cat.includes("electronics") ||
    cat.includes("tech") ||
    cat.includes("computer")
  ) {
    return [
      {
        id: "bios_computrace_lock",
        label: "BIOS Password & Corporate MDM Lock",
        category: "Ownership",
        severity: "CRITICAL",
        howToInspect: "Reboot into BIOS (F2/F12). Verify no supervisor password is set and Computrace/Absolute is disabled.",
        redFlagDescription: "Corporate MDM management profile or locked BIOS prevents clean OS reinstallation.",
      },
      {
        id: "ssd_smart_health",
        label: "SSD SMART Write Health & Power-On Hours",
        category: "Storage",
        severity: "HIGH",
        howToInspect: "Run CrystalDiskInfo or smartctl from portable USB. Check total TBW and drive health percentage.",
        redFlagDescription: "Reallocated bad sectors or SSD health below 75% indicates impending drive crash.",
      },
      {
        id: "thermal_throttling_fans",
        label: "5-Minute CPU/GPU Thermal Stress",
        category: "Cooling",
        severity: "HIGH",
        howToInspect: "Run a 5-minute benchmark (Cinebench or Prime95). Observe fan spin-up and check core temperatures stay below 92°C.",
        redFlagDescription: "Instant spike to 100°C with severe clock throttling indicates dried thermal paste or broken heatpipe.",
      },
      {
        id: "battery_cycle_count",
        label: "Battery Design Capacity & Cycles",
        category: "Power",
        severity: "HIGH",
        howToInspect: "Run `powercfg /batteryreport` on Windows or System Information on Mac. Verify full charge capacity vs design capacity.",
        redFlagDescription: "Cycle count > 600 or battery health < 70% requires immediate ₹4,000 - ₹9,000 battery replacement.",
      },
      {
        id: "keyboard_ports_display",
        label: "Every Keyboard Key & USB-C Display Output",
        category: "I/O",
        severity: "HIGH",
        howToInspect: "Test all keys on keyboardtester.com. Plug a USB-C charger and external display to verify all ports negotiate power.",
        redFlagDescription: "Dead keys or loose USB-C charging port require expensive soldered motherboard repair.",
      },
    ];
  }

  // Universal Fallback Inspection Checklist
  return [
    {
      id: "physical_housing",
      label: "Chassis & Structural Integrity",
      category: "Physical",
      severity: "HIGH",
      howToInspect: "Inspect all corners, hinges, and seams for hairline drop cracks, dents, and loose screw threads.",
      redFlagDescription: "Cracked casing or rattling internal components when gently tipped.",
    },
    {
      id: "original_invoice",
      label: "Matching Retail Invoice & Serial",
      category: "Provenance",
      severity: "CRITICAL",
      howToInspect: "Examine original GST invoice date, seller name, and printed serial number.",
      redFlagDescription: "Seller cannot produce any purchase provenance, claiming it was 'a gift from a friend'.",
    },
    {
      id: "power_and_switches",
      label: "Electrical Power Delivery & Switches",
      category: "Operation",
      severity: "CRITICAL",
      howToInspect: "Operate unit continuously for 10 minutes under normal load to test heat, smell, and stable current draw.",
      redFlagDescription: "Burning electronics smell or power tripping under standard load.",
    },
  ];
}

/**
 * Generates an aggressive, polite, and factual negotiation helper script.
 */
export function generateNegotiationStrategy(params: {
  productName: string;
  askingPriceInr: number;
  valuation: FairPriceValuation;
  defectsOrDeficits?: string[];
  category: string;
}): NegotiationStrategy {
  const asking = params.askingPriceInr;
  const median = params.valuation.fairPriceMedianInr;

  // Opening offer is positioned at the lower bound of fair value
  const suggestedOpeningOfferInr = Math.round(params.valuation.fairPriceMinInr * 0.96);
  // Target is the median fair market price
  const reasonableTargetPriceInr = median;
  // Walk away if price is more than 6% above fair upper bound
  const walkAwayPriceInr = Math.round(params.valuation.fairPriceMaxInr * 1.05);

  const negotiationPoints = [
    `Comparable contemporary verified sales for ${params.productName} in similar condition trade around ₹${median.toLocaleString("en-IN")}.`,
    "As a second-hand unit, it carries no manufacturer warranty, placing all future repair liabilities on the buyer.",
    "Factoring in immediate routine servicing, battery replacement reserve, and transit overhead.",
  ];

  if (params.defectsOrDeficits && params.defectsOrDeficits.length > 0) {
    negotiationPoints.push(...params.defectsOrDeficits.map((d) => `Adjustment needed for: ${d}`));
  }

  const copyableSellerMessage = `Hi, I saw your listing for the ${params.productName}. Based on market comps and the absence of remaining brand warranty, I am interested in purchasing it for ₹${suggestedOpeningOfferInr.toLocaleString("en-IN")} with immediate doorstep inspection and cash/UPI payment upon verification. If that works for you, I can close this today. Let me know!`;

  return {
    askingPriceInr: asking,
    suggestedOpeningOfferInr,
    reasonableTargetPriceInr,
    walkAwayPriceInr,
    negotiationPoints,
    copyableSellerMessage,
  };
}

/**
 * Synthesizes the core NEW VS USED VS REFURBISHED matrix and outputs the primary buying decision.
 */
export function generateNewVsUsedMatrix(params: {
  productName: string;
  category: string;
  newPriceInr: number;
  usedPriceInr?: number;
  refurbishedPriceInr?: number;
  typicalLifespanYears?: number;
}): NewVsUsedMatrix {
  const newPrice = params.newPriceInr;
  const usedPrice = params.usedPriceInr || Math.round(newPrice * 0.58);
  const refPrice = params.refurbishedPriceInr || Math.round(newPrice * 0.76);
  const cpoPrice = Math.round(newPrice * 0.82);

  const refSavingsInr = newPrice - refPrice;
  const refSavingsPct = Math.round((refSavingsInr / newPrice) * 100);

  const usedSavingsInr = newPrice - usedPrice;
  const usedSavingsPct = Math.round((usedSavingsInr / newPrice) * 100);

  const totalYears = params.typicalLifespanYears || 5;

  // Decide: BUY_NEW vs BUY_REFURBISHED vs BUY_USED
  let verdict: "BUY_NEW" | "BUY_REFURBISHED" | "BUY_USED" = "BUY_REFURBISHED";
  let headline = "";
  let reasoning = "";
  const criticalConditions: string[] = [];

  if (usedSavingsPct >= 40 && refSavingsPct >= 20) {
    verdict = "BUY_REFURBISHED";
    headline = `Recommended: BUY CERTIFIED REFURBISHED (Save ₹${refSavingsInr.toLocaleString("en-IN")} / ${refSavingsPct}%)`;
    reasoning = `Certified refurbished strikes the optimal risk-to-value balance: you pocket ₹${refSavingsInr.toLocaleString("en-IN")} in guaranteed savings while retaining a 6 to 12-month platform replacement warranty, avoiding the unvetted defect risks of direct second-hand sellers.`;
    criticalConditions.push("Ensure seller provides minimum 6-month warranty with 7-day hassle-free return window.");
    criticalConditions.push("Verify battery health is certified above 85% by the refurbishing laboratory.");
  } else if (usedSavingsPct >= 45) {
    verdict = "BUY_USED";
    headline = `Recommended: BUY PRE-OWNED (Save ₹${usedSavingsInr.toLocaleString("en-IN")} / ${usedSavingsPct}%)`;
    reasoning = `The massive ₹${usedSavingsInr.toLocaleString("en-IN")} discount offsets the absence of factory warranty. The initial depreciation hit has already been fully absorbed by the previous owner.`;
    criticalConditions.push("Perform hands-on physical checklist inspection before completing payment.");
    criticalConditions.push("Verify original invoice matches device serial number.");
  } else {
    verdict = "BUY_NEW";
    headline = "Recommended: BUY BRAND NEW";
    reasoning = `The used discount (${usedSavingsPct}%) is insufficient to justify the lost manufacturer warranty, potential battery degradation, and unknown usage history. Buying brand new delivers full peace of mind for marginal extra cost.`;
    criticalConditions.push("Take advantage of festive bank credit card discounts to narrow the price gap further.");
  }

  const factors: NewVsUsedMatrix["factors"] = [
    {
      factor: "Initial Price",
      newProduct: `₹${newPrice.toLocaleString("en-IN")}`,
      refurbished: `₹${refPrice.toLocaleString("en-IN")}`,
      used: `₹${usedPrice.toLocaleString("en-IN")}`,
      notes: `Used saves ₹${usedSavingsInr.toLocaleString("en-IN")} (${usedSavingsPct}%)`,
    },
    {
      factor: "Warranty Coverage",
      newProduct: "12 - 24 Months Official Brand",
      refurbished: "6 - 12 Months Platform Assured",
      used: "0 - 3 Months Remaining / As-Is",
      notes: "New & Refurbished include guaranteed return windows",
    },
    {
      factor: "Hardware Reliability Risk",
      newProduct: "Minimal (Zero Cycles, Factory QA)",
      refurbished: "Low (Laboratory Tested & Certified)",
      used: "Moderate to High (Unknown History)",
      notes: "Used carries battery & thermal wear risk",
    },
    {
      factor: "Expected Lifespan",
      newProduct: `${totalYears} Years Full Horizon`,
      refurbished: `${Math.max(1, totalYears - 1)} - ${totalYears} Years`,
      used: `${Math.max(1, totalYears - 2)} Years`,
      notes: "Used has already expended early lifecycle mileage",
    },
    {
      factor: "Expected Repair Reserves",
      newProduct: "₹0 (Covered by Warranty)",
      refurbished: "₹1,500 - ₹3,000 Reserve",
      used: "₹4,500 - ₹9,000 Reserve (Battery/Service)",
      notes: "Must budget for routine maintenance on used",
    },
    {
      factor: "Net Value & Verdict",
      newProduct: verdict === "BUY_NEW" ? "★ BEST OPTION" : "Standard Retail",
      refurbished: verdict === "BUY_REFURBISHED" ? "★ BEST SWEET SPOT" : "Good Alternative",
      used: verdict === "BUY_USED" ? "★ BEST BUDGET SAVER" : "Inspect Carefully",
    },
  ];

  return {
    productName: params.productName,
    category: params.category,
    newPriceInr: newPrice,
    refurbishedPriceInr: refPrice,
    usedMarketPriceInr: usedPrice,
    certifiedPreOwnedPriceInr: cpoPrice,
    refurbishedSavingsInr: refSavingsInr,
    refurbishedSavingsPct: refSavingsPct,
    usedSavingsInr: usedSavingsInr,
    usedSavingsPct: usedSavingsPct,
    warrantyComparison: {
      newMonths: 12,
      refurbishedMonths: 6,
      usedMonths: 1,
    },
    lifespanComparison: {
      newYears: totalYears,
      refurbishedYears: Math.max(1, totalYears - 1),
      usedYears: Math.max(1, totalYears - 2),
    },
    factors,
    recommendation: {
      verdict,
      headline,
      reasoning,
      criticalConditions,
      maxRecommendedUsedPriceInr: Math.round(usedPrice * 1.05),
    },
  };
}

/**
 * Used purchase regret simulator: forecasts realistic repair scenarios across multi-year horizon.
 */
export function generateUsedPurchaseRegretTimeline(category: string): UsedRegretHorizonItem[] {
  const cat = (category || "").toLowerCase();

  if (cat.includes("car") || cat.includes("auto")) {
    return [
      {
        horizon: "IMMEDIATE_DELIVERY",
        riskTitle: "Complete Fluid & Filter Flush",
        riskDescription: "Previous owner often skips major 40k/50k service prior to selling.",
        estimatedExpenseInr: 6500,
        preventiveInspectionCheck: "Check engine oil viscosity and brake fluid clarity on dipstick.",
      },
      {
        horizon: "3_MONTHS",
        riskTitle: "Brake Pad & Rotor Skimming",
        riskDescription: "Thinning brake pads cause vibration and scoring on front brake discs.",
        estimatedExpenseInr: 5800,
        preventiveInspectionCheck: "Inspect pad thickness through alloy wheel spokes with a torch.",
      },
      {
        horizon: "1_YEAR",
        riskTitle: "Suspension Bushing & Link Rod Play",
        riskDescription: "Rubber control arm bushings tear over Indian potholes, causing thuds over speed bumps.",
        estimatedExpenseInr: 12000,
        preventiveInspectionCheck: "Listen for clunking over broken pavement during 15-minute test drive.",
      },
      {
        horizon: "2_YEARS",
        riskTitle: "Clutch Plate Assembly / Battery Replacement",
        riskDescription: "Heavy city traffic wear causes clutch slip and battery cranking amperage drop.",
        estimatedExpenseInr: 18000,
        preventiveInspectionCheck: "Test clutch bite point on steep incline; test battery cold-crank voltage.",
      },
    ];
  }

  // Default Tech / Electronics Regret Timeline
  return [
    {
      horizon: "IMMEDIATE_DELIVERY",
      riskTitle: "Missing OEM Fast Charger or Original Cable",
      riskDescription: "Seller provides cheap third-party non-PD charger that charges slowly or damages battery.",
      estimatedExpenseInr: 1899,
      preventiveInspectionCheck: "Verify original wattage rating on charger brick before leaving.",
    },
    {
      horizon: "3_MONTHS",
      riskTitle: "Battery Capacity Drop under Cold/Heavy Load",
      riskDescription: "Old chemical battery suddenly drops from 20% to 0% under heavy processing.",
      estimatedExpenseInr: 4500,
      preventiveInspectionCheck: "Check battery maximum capacity percentage in diagnostics.",
    },
    {
      horizon: "1_YEAR",
      riskTitle: "Thermal Paste Drying & Fan Bearing Wear",
      riskDescription: "Internal cooling fan starts buzzing; CPU throttles down to base clocks.",
      estimatedExpenseInr: 2200,
      preventiveInspectionCheck: "Run heavy 5-minute stress test to ensure fans spin without rattling.",
    },
    {
      horizon: "2_YEARS",
      riskTitle: "Operating System Update Discontinuation",
      riskDescription: "Manufacturer ends major OS version support for 4+ year old hardware.",
      estimatedExpenseInr: 0,
      preventiveInspectionCheck: "Verify official brand software support lifecycle for this model generation.",
    },
  ];
}
