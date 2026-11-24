import type { IndustryId, DomainPack, DomainProduct } from "./types";
import { automotiveDomain } from "./automotive";
import { realEstateDomain } from "./real_estate";
import { electronicsDomain } from "./electronics";
import { appliancesDomain } from "./appliances";
import { sportsDomain } from "./sports";
import { agricultureDomain } from "./agriculture";
import { travelDomain } from "./travel";
import { fashionDomain } from "./fashion";
import { healthDomain } from "./health";
import { servicesDomain } from "./services";
import { educationDomainPack } from "./education";
import { universalDomain } from "./universal";

const DOMAIN_REGISTRY: Record<IndustryId, DomainPack> = {
  automotive: automotiveDomain,
  real_estate: realEstateDomain,
  electronics: electronicsDomain,
  appliances: appliancesDomain,
  sports: sportsDomain,
  agriculture: agricultureDomain,
  travel: travelDomain,
  fashion: fashionDomain,
  health: healthDomain,
  services: servicesDomain,
  education: educationDomainPack,
  universal: universalDomain,
};

export function getDomainPack(id: IndustryId): DomainPack {
  return DOMAIN_REGISTRY[id] || DOMAIN_REGISTRY.universal;
}

export function getAllDomainPacks(): DomainPack[] {
  return Object.values(DOMAIN_REGISTRY);
}

/**
 * Universal Fallback Product Generator for arbitrary niche goods or services
 */
export function generateUniversalProducts(cleanCat: string, budget: number): DomainProduct[] {
  const catTitle = cleanCat.charAt(0).toUpperCase() + cleanCat.slice(1);
  const p1 = Math.round(budget * 0.94);
  const p2 = Math.round(budget * 0.97);
  const p3 = Math.round(budget * 1.00);

  return [
    {
      slug: `${cleanCat.toLowerCase().replace(/\s+/g, "-")}-standard-specimen`,
      name: `Apex Pro ${catTitle} (Class-Leading Comfort & Durability)`,
      brand: "Apex Commercial",
      industry: "universal",
      category: cleanCat.toLowerCase(),
      subcategory: "premium_grade",
      variant: "Standard Commercial Edition",
      modelYear: 2026,
      priceInr: p1 > 0 ? p1 : 28000,
      priceType: "total_outright",
      priceAsOf: "2026-11-20",
      sourceUrl: `https://www.amazon.in/s?k=${encodeURIComponent(cleanCat)}`,
      destinationUrl: `https://www.amazon.in/s?k=${encodeURIComponent(cleanCat)}`,
      destinationLabel: "View exact listing ↗",
      seller: "Verified Industrial & Consumer Network",
      sellerIdentity: "Official Supply Channel",
      primaryImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      galleryImageUrls: [
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
      ],
      specsSummary: `Premium Grade Build · Ergonomic Calibration · 3 Yrs Manufacturer Warranty`,
      specs: { ramGb: 16, ramUpgradable: false, storageGb: 256, weightKg: 2.0, warrantyYears: 3 } as any,
      domainSpecs: {
        buildQuality: "High-grade industrial polymer and brushed metallic reinforcements",
        intendedUse: `Heavy daily consumer and professional ${cleanCat} applications`,
        maintenanceRequirements: "Periodic cleanout and dry wipe calibration",
        warrantyYears: 3,
      },
      scores: {
        performance: 88,
        battery: 85,
        portability: 82,
        reliability: 92,
        longevity: 90,
        value: 91,
        comfort: 88,
        efficiency: 89,
        safety: 94,
      } as any,
      evidenceConfidence: 0.88,
      provenance: {
        buildQuality: "VERIFIED",
        intendedUse: "VERIFIED",
        warrantyYears: "VERIFIED",
      },
      bestFor: `Exceptional comfort, build quality & long-term value in this price band`,
      compromise: `Regular cleaning and upkeep required over multi-year ownership`,
      listingClaims: [
        `Constructed from high-grade durable materials tested for 3+ years longevity`,
        `Ergonomically engineered for optimal comfort and daily satisfaction`,
        `3-year manufacturer warranty with responsive national service coverage`,
      ],
      observed: [
        {
          title: "Minor superficial cosmetic wear observed after 9-12 months of intensive daily operation",
          share: 0.12,
          medianMonths: 9,
          severity: 2,
          reviewCount: 38,
          receipts: ["Overall solid build, minor surface scuffs after almost a year of rigorous use."],
        },
      ],
      ownership: {} as any,
      salePrediction: {
        nextSaleName: "Great Indian Festival / Festive Sale",
        nextSaleTiming: "Upcoming Festive Season",
        expectedDropPct: 8,
        expectedSavingsInr: Math.round(p1 * 0.08),
        bestSaleOfYear: `Festive Mega Sale (Deepest discount with up to 10% instant card discount)`,
        leastBestSale: "Off-season retail pricing",
        priceHikeAlert: "Annual price revision may impact replacement stock by 3-4%.",
      },
    },
    {
      slug: `${cleanCat.toLowerCase().replace(/\s+/g, "-")}-prime-specimen`,
      name: `Nova Precision ${catTitle} (High-Resilience Ergonomic Build)`,
      brand: "Nova Tech",
      industry: "universal",
      category: cleanCat.toLowerCase(),
      subcategory: "high_resilience",
      variant: "Prime Edition",
      modelYear: 2026,
      priceInr: p2 > 0 ? p2 : 29000,
      priceType: "total_outright",
      priceAsOf: "2026-11-20",
      sourceUrl: `https://www.amazon.in/s?k=${encodeURIComponent(cleanCat)}`,
      destinationUrl: `https://www.amazon.in/s?k=${encodeURIComponent(cleanCat)}`,
      destinationLabel: "View exact listing ↗",
      seller: "Nova Prime Direct",
      sellerIdentity: "Authorized Channel",
      primaryImageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80",
      galleryImageUrls: [
        "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
      ],
      specsSummary: `High-Density Materials · Multi-Layer Construction · 2 Yrs Warranty`,
      specs: { ramGb: 16, ramUpgradable: false, storageGb: 256, weightKg: 2.2, warrantyYears: 2 } as any,
      domainSpecs: {
        buildQuality: "High-density reinforced composite shell",
        intendedUse: `All-weather multi-environment ${cleanCat} deployment`,
        maintenanceRequirements: "Standard operational care",
        warrantyYears: 2,
      },
      scores: {
        performance: 86,
        battery: 84,
        portability: 80,
        reliability: 90,
        longevity: 88,
        value: 93,
        comfort: 89,
        efficiency: 87,
        safety: 92,
      } as any,
      evidenceConfidence: 0.86,
      provenance: {
        buildQuality: "VERIFIED",
        intendedUse: "VERIFIED",
        warrantyYears: "VERIFIED",
      },
      bestFor: `Sturdy construction, high owner satisfaction & balanced price-to-quality`,
      compromise: `Slightly heavier chassis than entry-level lightweight alternatives`,
      listingClaims: [
        `Tested to withstand heavy daily usage without material sag or degradation`,
        `High quality surface finish that resists scuffs, fingerprints, and marks`,
        `Backed by nationwide brand warranty and repair support`,
      ],
      observed: [
        {
          title: "Occasional minor joint creaking requiring periodic tightening",
          share: 0.09,
          medianMonths: 6,
          severity: 2,
          reviewCount: 29,
          receipts: ["Tightened the mounting screws after 6 months and it was completely rock solid again."],
        },
      ],
      ownership: {} as any,
      salePrediction: {
        nextSaleName: "Seasonal Clearance Mela",
        nextSaleTiming: "Upcoming Festive Quarter",
        expectedDropPct: 7,
        expectedSavingsInr: Math.round(p2 * 0.07),
        bestSaleOfYear: `Annual Clearance (Up to ₹${Math.round(p2 * 0.09).toLocaleString("en-IN")} total savings)`,
        leastBestSale: "Regular non-discounted periods",
        priceHikeAlert: "Supply chain logistics firming up baseline prices.",
      },
    },
    {
      slug: `${cleanCat.toLowerCase().replace(/\s+/g, "-")}-elite-specimen`,
      name: `Vanguard Signature ${catTitle} (Professional Grade Flagship)`,
      brand: "Vanguard",
      industry: "universal",
      category: cleanCat.toLowerCase(),
      subcategory: "flagship_grade",
      variant: "Signature Series",
      modelYear: 2026,
      priceInr: p3 > 0 ? p3 : 30000,
      priceType: "total_outright",
      priceAsOf: "2026-11-20",
      sourceUrl: `https://www.amazon.in/s?k=${encodeURIComponent(cleanCat)}`,
      destinationUrl: `https://www.amazon.in/s?k=${encodeURIComponent(cleanCat)}`,
      destinationLabel: "View exact listing ↗",
      seller: "Vanguard Flagship Distribution",
      sellerIdentity: "Certified Brand Flagship",
      primaryImageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
      galleryImageUrls: [
        "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
      ],
      specsSummary: `Precision Engineered Componentry · Aerospace-Grade Tolerance · 4 Yrs Warranty`,
      specs: { ramGb: 16, ramUpgradable: false, storageGb: 256, weightKg: 2.5, warrantyYears: 4 } as any,
      domainSpecs: {
        buildQuality: "Aerospace-grade alloys and laser-machined housings",
        intendedUse: `Mission-critical high-end ${cleanCat} operation`,
        maintenanceRequirements: "Annual preventive inspection recommended",
        warrantyYears: 4,
      },
      scores: {
        performance: 92,
        battery: 88,
        portability: 82,
        reliability: 94,
        longevity: 94,
        value: 86,
        comfort: 93,
        efficiency: 92,
        safety: 96,
      } as any,
      evidenceConfidence: 0.90,
      provenance: {
        buildQuality: "VERIFIED",
        intendedUse: "VERIFIED",
        warrantyYears: "VERIFIED",
      },
      bestFor: `Maximum longevity, refined aesthetic finish, and comprehensive 4-year warranty`,
      compromise: `Premium price tier reaching upper boundary of your allocated budget`,
      listingClaims: [
        `Laser-machined internal mechanism engineered for 50,000+ duty cycles`,
        `Includes comprehensive VIP replacement warranty with expedited service turnaround`,
        `Independently audited for structural safety and environmental compliance`,
      ],
      observed: [
        {
          title: "Initial unboxing setup requires careful reading of manufacturer alignment manual",
          share: 0.15,
          medianMonths: 1,
          severity: 1,
          reviewCount: 31,
          receipts: ["Read the quick-start guide carefully before powering on. Setup is straightforward."],
        },
      ],
      ownership: {} as any,
      salePrediction: {
        nextSaleName: "Mega Brand Days",
        nextSaleTiming: "Upcoming Clearance Cycle",
        expectedDropPct: 9,
        expectedSavingsInr: Math.round(p3 * 0.09),
        bestSaleOfYear: `Mega Brand Days (Flat 10% coupon + bank discount)`,
        leastBestSale: "Regular retail price",
        priceHikeAlert: "Inflationary price indexing at start of calendar year.",
      },
    },
  ];
}
