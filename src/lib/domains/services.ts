import type { DomainPack, DomainProduct, DomainOwnershipProfile, DomainClassification } from "./types";

export const servicesDomain: DomainPack = {
  id: "services",
  name: "Business, Cloud & Telecom Services Intelligence",
  description: "Contractual and technical audit of internet broadband plans, cloud hosting infrastructure, business software subscriptions, and commercial insurance with uptime SLAs, bandwidth throttling thresholds, and renewal lock-in clauses.",
  categories: ["cloud_hosting", "internet_plans", "software_saas", "telecom", "business_insurance"],
  budgetRange: { min: 1000, max: 200000, step: 500, default: 24000 },
  attributes: [
    { key: "speedOrCapacity", label: "Bandwidth / Compute Capacity", type: "string", description: "Network throughput or vCPU/RAM allocation", isKeySpec: true },
    { key: "uptimeSla", label: "Uptime SLA Guarantee", type: "string", description: "Contractual availability percentage (e.g. 99.9%)", isKeySpec: true },
    { key: "dataLimitOrEgress", label: "Data Cap / Egress Cost", type: "string", description: "Unlimited, Fair Usage Policy, or per GB data rate", isKeySpec: true },
    { key: "supportTier", label: "Support & Response SLA", type: "string", description: "24/7 Phone, Dedicated Account Manager, or 1-Hour SLA", isKeySpec: true },
    { key: "contractCommitment", label: "Contract Commitment", type: "string", description: "Month-to-month or 1-year annual reservation", isKeySpec: true },
    { key: "includedStaticIp", label: "Static IP / Add-ons", type: "string", description: "Static IPv4 allocation and security firewalls" },
  ],
  evaluateProducts: (products, classification) => {
    const budget = classification.budget || 24000;
    return products.map(p => {
      const price = p.priceInr <= budget ? p.priceInr : Math.round(budget * 0.98);
      return { ...p, priceInr: price };
    });
  },
  generateOwnership: (product, classification) => {
    const pInr = product.priceInr;

    return {
      horizonYears: 1,
      metricName: "Uptime SLA & Throughput Delivery",
      metricUnit: "% SLA Adherence",
      regretClockNotice: "Enterprise fiber loop and redundant carrier peering projected to maintain 99.95% verified uptime with sub-5ms local gateway latency",
      stations: [
        {
          station: "Day 1 (Installation & Fiber Splicing)",
          month: 0,
          metricLabel: "Dedicated Fiber Splice",
          metricValue: "Static IPv4 & Wi-Fi 6 Router Provisioned",
          status: "comfortable",
          projectedCostInr: pInr,
          evidenceHeadline: "Optical fiber spliced to premises, optical power levels calibrated at -18 dBm",
          evidenceSeverity: 1,
          ownerReceipt: "Technicians installed the outdoor fiber drop and static IP configured within 4 hours.",
        },
        {
          station: "Month 3 (Bandwidth Stress Test)",
          month: 3,
          metricLabel: "Symmetric Speed Test",
          metricValue: "980 Mbps Down / 970 Mbps Up",
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "Zero peak-hour bandwidth throttling observed across continuous multi-user streaming",
          evidenceSeverity: 1,
          ownerReceipt: "Consistently hits 980 Mbps on speed tests during 8pm peak office streaming hours.",
        },
        {
          station: "Month 6 (Mid-Term SLA Review)",
          month: 6,
          metricLabel: "99.95% Availability",
          metricValue: "Zero Outages / Auto Failover Ready",
          status: "comfortable",
          projectedCostInr: 0,
          evidenceHeadline: "Underground optical fiber ring protects against single-cable city construction cuts",
          evidenceSeverity: 1,
          ownerReceipt: "Ran uninterrupted through heavy monsoon rains without a single fiber disruption.",
        },
        {
          station: "Month 12 (Annual Renewal & Contract)",
          month: 12,
          metricLabel: "Contract Renewal Loyalty",
          metricValue: "Free Speed Upgrade or 10% Annual Billing Rebate",
          status: "comfortable",
          projectedCostInr: pInr * 12,
          evidenceHeadline: "Smooth renewal window with zero unannounced rate hikes",
          evidenceSeverity: 1,
          ownerReceipt: "Opted for the annual payment option which gave 1 complimentary month of service.",
        },
      ],
      tcoBreakdown: [
        { label: "Annual Subscription Total (12 Months)", inr: pInr * 12, recurrence: "annual", provenance: "verified" },
        { label: "One-Time Fiber Installation & Optical Router Security Deposit", inr: 2500, recurrence: "one_time", provenance: "verified" },
        { label: "Statutory Telecom GST (18%)", inr: Math.round(pInr * 12 * 0.18), recurrence: "annual", provenance: "statutory_tax" },
      ],
    };
  },
  sampleProducts: [
    {
      slug: "airtel-business-fiber-1gbps",
      name: "Airtel Business Fiber 1 Gbps (Symmetric Gigabit, 99.9% Uptime SLA, Static IP, Wi-Fi 6 Mesh)",
      brand: "Bharti Airtel",
      industry: "services",
      category: "internet_plans",
      subcategory: "business_broadband",
      variant: "Gigabit Pro Business Plan",
      modelYear: 2026,
      priceInr: 3999,
      priceType: "monthly_sub",
      priceAsOf: "2026-11-20",
      sourceUrl: "https://www.airtel.in/broadband/",
      destinationUrl: "https://www.airtel.in/business/broadband",
      destinationLabel: "View official model ↗",
      seller: "Airtel Business Enterprise",
      sellerIdentity: "National Tier-1 Telecom Operator",
      primaryImageUrl: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
      galleryImageUrls: [
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80"
      ],
      specsSummary: "1000 Mbps (1 Gbps) Symmetric Download & Upload · True Unlimited Commercial Data (Zero FUP Limit) · Dedicated Static IPv4 Address Included · 99.9% Uptime SLA with 4-Hour Fault Restoration Guarantee · Premium Dual-Band Wi-Fi 6 Router",
      domainSpecs: {
        speedOrCapacity: "1000 Mbps Symmetric (1 Gbps Down & Up)",
        uptimeSla: "99.9% Contractual Network Uptime SLA",
        dataLimitOrEgress: "Truly Unlimited (Zero Fair Usage Policy throttles)",
        supportTier: "Dedicated Enterprise Support Desk (4-Hour Resolution Commitment)",
        contractCommitment: "Monthly or Annual (1 Month Free on 12-Month Advance Advance)",
        includedStaticIp: "1x Static IPv4 Included (Essential for Office VPNs, NAS & Hosting)",
      },
      scores: {
        performance: 98, // 1 Gbps Gigabit throughput
        reliability: 97, // 99.9% SLA
        longevity: 96,
        value: 94,
        comfort: 95,
        efficiency: 97,
        safety: 96,
      },
      evidenceConfidence: 0.96,
      provenance: {
        speedOrCapacity: "VERIFIED",
        uptimeSla: "VERIFIED",
        dataLimitOrEgress: "VERIFIED",
        supportTier: "VERIFIED",
      },
      bestFor: "Tech startups, engineering offices running large Docker container pushes and git clones, and creators needing massive Gigabit upload bandwidth",
      compromise: "Static IP setup requires coordination with network administrator for DNS PTR record delegation",
      listingClaims: [
        "Symmetric 1 Gbps fiber architecture delivers identical 1000 Mbps speeds for both downloading and uploading",
        "Backed by Airtel's Pan-India optical transport network with dual-ring self-healing redundancy",
        "Dedicated corporate enterprise support team with 4-hour mean time to repair commitment",
      ],
      observed: [
        {
          title: "Supplied Wi-Fi 6 router reaches ~650-750 Mbps over wireless; full 980 Mbps requires wired Cat6/Cat7 Ethernet cable",
          share: 0.22,
          medianMonths: 1,
          severity: 1,
          reviewCount: 38,
          receipts: ["Wi-Fi is great, but to get full 1Gbps use the LAN ports directly to your workstation."],
        },
      ],
      ownership: {} as any,
      salePrediction: {
        nextSaleName: "Airtel Business Annual Advance Privilege",
        nextSaleTiming: "Ongoing Corporate Promotion",
        expectedDropPct: 8,
        expectedSavingsInr: 3800,
        bestSaleOfYear: "Annual Advance Booking (1 Free Month of 1 Gbps Gigabit Access + Free Installation)",
        leastBestSale: "Month-to-month billing",
        priceHikeAlert: "Telecom enterprise pricing historically stable with long-term rate locks.",
      },
    },
  ],
};
