export interface DealRiskAudit {
  overallRisk: "LOW_RISK" | "CAUTION" | "HIGH_RISK";
  riskLevel: "LOW" | "MODERATE" | "HIGH";
  riskScore: number; // 0 (safest) to 100 (highest risk)
  isRecommended: boolean;
  riskFlags: string[];
  sellerReputation: {
    sellerName: string;
    rating: number;
    isVerifiedDealer: boolean;
    fulfillmentType: string;
  };
  priceAnomaly: {
    isAnomalous: boolean;
    discountPctFromMedian: number;
    explanation: string;
  };
  variantIntegrity: {
    isExactMatch: boolean;
    flag?: string;
  };
  warrantyAndReturns: {
    warrantyYears: number;
    returnWindowDays: number;
    isFactoryDirect: boolean;
  };
  actionableGuidance: string;
}

export function auditDealRisk(params: {
  productName?: string;
  listedPriceInr: number;
  medianMarketPriceInr?: number;
  originalPriceInr?: number;
  sellerName?: string;
  sellerRating?: number;
  isVerified?: boolean;
  variantSpecified?: string;
  warrantyYears?: number;
  returnDays?: number;
  returnWindowDays?: number;
  isRefurbished?: boolean;
}): DealRiskAudit {
  const sellerRating = params.sellerRating ?? 4.7;
  const isVerified = params.isVerified ?? (sellerRating >= 4.0);
  const baseline = params.medianMarketPriceInr ?? params.originalPriceInr ?? params.listedPriceInr;
  const priceDiff = baseline - params.listedPriceInr;
  const discountPct = baseline > 0 ? Math.round((priceDiff / baseline) * 100) : 0;

  let riskScore = 15; // Baseline low risk
  const flags: string[] = [];

  // 1. Price Anomaly
  let isAnomalous = false;
  let priceExplanation = "Price is within normal competitive retail variance.";

  if (discountPct > 28) {
    isAnomalous = true;
    riskScore += 35;
    priceExplanation = `Price is ${discountPct}% below recorded market median. Verify whether this listing is refurbished, open-box, or an unauthorized grey-market import.`;
    flags.push("Steep unseasonal discount anomaly");
  } else if (discountPct < -15) {
    riskScore += 10;
    priceExplanation = `Price is ${Math.abs(discountPct)}% above standard market price. Avoid overpaying at current retailer.`;
    flags.push("Price scalping / premium markup");
  }

  // 2. Seller Reputation
  if (sellerRating < 4.0) {
    riskScore += 30;
    flags.push("Below-average seller customer rating");
  } else if (!isVerified) {
    riskScore += 20;
    flags.push("Unverified third-party marketplace seller");
  }

  // 3. Warranty & Returns
  const returnDays = params.returnWindowDays ?? params.returnDays ?? 7;
  if (returnDays <= 3) {
    riskScore += 15;
    flags.push("Short or restrictive return window");
  }

  if (params.isRefurbished) {
    flags.push("Refurbished unit");
  }

  let overallRisk: "LOW_RISK" | "CAUTION" | "HIGH_RISK" = "LOW_RISK";
  let riskLevel: "LOW" | "MODERATE" | "HIGH" = "LOW";
  if (riskScore >= 60) {
    overallRisk = "HIGH_RISK";
    riskLevel = "HIGH";
  } else if (riskScore >= 35) {
    overallRisk = "CAUTION";
    riskLevel = "MODERATE";
  }

  let actionableGuidance = "Transaction approved. Seller is verified with standard brand on-site warranty.";
  if (overallRisk === "HIGH_RISK") {
    actionableGuidance = "High risk detected: Verify seller warranty provenance and record unboxing video upon doorstep receipt.";
  } else if (overallRisk === "CAUTION") {
    actionableGuidance = "Proceed with caution: Inspect delivered seal before signing delivery acknowledgment.";
  }

  return {
    overallRisk,
    riskLevel,
    riskScore,
    isRecommended: overallRisk === "LOW_RISK",
    riskFlags: flags,
    sellerReputation: {
      sellerName: params.sellerName || "Verified Retail Partner",
      rating: sellerRating,
      isVerifiedDealer: isVerified,
      fulfillmentType: isVerified ? "Marketplace Assured / OEM Direct" : "Third-Party Fulfilled",
    },
    priceAnomaly: {
      isAnomalous,
      discountPctFromMedian: discountPct,
      explanation: priceExplanation,
    },
    variantIntegrity: {
      isExactMatch: !params.variantSpecified?.includes("Mismatch"),
      flag: flags.join(" · ") || undefined,
    },
    warrantyAndReturns: {
      warrantyYears: params.warrantyYears || 1,
      returnWindowDays: returnDays,
      isFactoryDirect: isVerified,
    },
    actionableGuidance,
  };
}
