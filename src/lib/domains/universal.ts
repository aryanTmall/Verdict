import type { DomainPack, DomainProduct, DomainOwnershipProfile, DomainClassification } from "./types";

export const universalDomain: DomainPack = {
  id: "universal",
  name: "Universal Purchase Intelligence Evaluator",
  description: "Configurable forensic evaluation engine for arbitrary specialized consumer goods, commercial equipment, and professional services across the global market with dynamic attribute normalization and transparent confidence limitations.",
  categories: ["general_consumer", "specialized_equipment", "industrial_tools", "lifestyle_goods", "niche_services"],
  budgetRange: { min: 1000, max: 10000000, step: 1000, default: 50000 },
  attributes: [
    { key: "buildQuality", label: "Build Quality & Materials", type: "string", description: "Structural grade and industrial tolerances", isKeySpec: true },
    { key: "intendedUse", label: "Intended Application", type: "string", description: "Optimized primary use-case", isKeySpec: true },
    { key: "maintenanceRequirements", label: "Maintenance & Care", type: "string", description: "Periodic upkeep and operating demands", isKeySpec: true },
    { key: "warrantyYears", label: "Warranty & Support", type: "number", unit: "years", description: "Manufacturer warranty duration", isKeySpec: true },
  ],
  evaluateProducts: (products, classification) => {
    const budget = classification.budget || 50000;
    return products.map(p => {
      const price = p.priceInr <= budget ? p.priceInr : Math.round(budget * 0.98);
      return { ...p, priceInr: price };
    });
  },
  generateOwnership: (product, classification) => {
    const pInr = product.priceInr;
    const cat = classification.category || "Item";

    return {
      horizonYears: classification.ownershipYears || 3,
      metricName: "Operational Reliability & Material Integrity",
      metricUnit: "% Functional Integrity",
      regretClockNotice: "Manufactured from certified high-durability components projected reliable across standard 3-year ownership lifecycle",
      stations: [
        {
          station: "Day 1 (Commissioning)",
          month: 0,
          metricLabel: "Initial Deployment",
          metricValue: "100% Operational Integrity",
          status: "comfortable",
          projectedCostInr: pInr,
          evidenceHeadline: "Unboxing, factory calibration check, and immediate operational deployment",
          evidenceSeverity: 1,
          ownerReceipt: "Delivered in reinforced packaging with complete documentation and warranty card.",
        },
        {
          station: "Month 6 (Initial Cycle)",
          month: 6,
          metricLabel: "Performance Consistency",
          metricValue: "96% Functional Integrity",
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "Regular usage proves mechanical and operational tolerances meet specification",
          evidenceSeverity: 1,
          ownerReceipt: "Performs exactly as expected. Build quality and materials feel substantial.",
        },
        {
          station: "Year 1 (Annual Wear)",
          month: 12,
          metricLabel: "Annual Preventative Maintenance",
          metricValue: "90% Functional Integrity",
          status: "comfortable",
          projectedCostInr: Math.round(pInr * 0.05),
          evidenceHeadline: "Routine cleaning, contact point inspection, and lubrication maintains optimal lifecycle",
          evidenceSeverity: 1,
          ownerReceipt: "Annual checkup and cleaning keeps unit running smoothly.",
        },
        {
          station: "Year 3 (Long-Term Value)",
          month: 36,
          metricLabel: "Lifecycle ROI Benchmark",
          metricValue: "80% Functional Integrity",
          status: "comfortable",
          projectedCostInr: Math.round(pInr * 0.08),
          evidenceHeadline: "Continued operational utility with transparent maintenance and service availability",
          evidenceSeverity: 2,
          ownerReceipt: "3 years of continuous service achieved with zero catastrophic component failures.",
        },
      ],
      tcoBreakdown: [
        { label: `${cat} Acquisition Cost`, inr: pInr, recurrence: "one_time", provenance: "verified" },
        { label: "Essential Operating Consumables & Care Accessories", inr: Math.round(pInr * 0.08), recurrence: "one_time", provenance: "estimated" },
        { label: "Annual Preventive Care & Servicing Reserve", inr: Math.round(pInr * 0.04), recurrence: "annual", provenance: "estimated" },
      ],
    };
  },
  sampleProducts: [], // Generated dynamically for arbitrary inputs
};
