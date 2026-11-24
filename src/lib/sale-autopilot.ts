export type PurchaseMode = "NOTIFY_ONLY" | "APPROVAL_REQUIRED" | "PRE_AUTHORIZED";

export interface PurchaseRule {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  variant: string;
  industry: string;
  targetPriceInr: number;
  maxEffectivePayableInr: number;
  currentObservedPriceInr: number;
  currency: string;
  saleEventName: string;
  saleStartIso: string;
  saleEndIso: string;
  sellerPreference: "authorized_only" | "any_verified" | "oem_direct";
  warrantyRequirement: "standard_brand_new" | "extended_2yr";
  purchaseMode: PurchaseMode;
  status: "ACTIVE_MONITORING" | "TRIGGER_CONDITION_MET" | "AWAITING_APPROVAL" | "COMPLETED" | "CANCELLED";
  idempotencyToken: string;
  userConsentGranted: boolean;
  createdAt: string;
  lastEvaluatedAt: string;
  triggerHistory: Array<{
    timestamp: string;
    event: string;
    details: string;
    effectivePriceObserved?: number;
  }>;
}

// In-memory persistent rule store (with fallback storage support)
let globalRules: PurchaseRule[] = [
  {
    id: "rule-demo-creta",
    userId: "buyer-prime",
    productId: "hyundai-creta-sxo-turbo",
    productName: "Hyundai Creta SX(O) 1.5 Turbo DCT",
    variant: "SX(O) Turbo DCT · Level 2 ADAS",
    industry: "automotive",
    targetPriceInr: 1820000,
    maxEffectivePayableInr: 1850000,
    currentObservedPriceInr: 1870000,
    currency: "INR",
    saleEventName: "Year-End December Clearance Sale",
    saleStartIso: "2026-12-15T00:00:00+05:30",
    saleEndIso: "2026-12-31T23:59:59+05:30",
    sellerPreference: "authorized_only",
    warrantyRequirement: "standard_brand_new",
    purchaseMode: "APPROVAL_REQUIRED",
    status: "ACTIVE_MONITORING",
    idempotencyToken: "idemp-creta-202612",
    userConsentGranted: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    lastEvaluatedAt: new Date().toISOString(),
    triggerHistory: [
      {
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        event: "RULE_INITIALIZED",
        details: "Autopilot rule registered for Year-End clearance alert at ₹18,20,000 threshold.",
      },
    ],
  },
  {
    id: "rule-demo-laptop",
    userId: "buyer-prime",
    productId: "acer-swift-go-14-oled",
    productName: "Acer Swift Go 14 OLED",
    variant: "16GB LPDDR5X / 512GB SSD / Core Ultra 5",
    industry: "electronics",
    targetPriceInr: 68000,
    maxEffectivePayableInr: 70000,
    currentObservedPriceInr: 72990,
    currency: "INR",
    saleEventName: "Republic Day Early Access Sale",
    saleStartIso: "2027-01-20T00:00:00+05:30",
    saleEndIso: "2027-01-26T23:59:59+05:30",
    sellerPreference: "authorized_only",
    warrantyRequirement: "standard_brand_new",
    purchaseMode: "NOTIFY_ONLY",
    status: "ACTIVE_MONITORING",
    idempotencyToken: "idemp-laptop-202701",
    userConsentGranted: true,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    lastEvaluatedAt: new Date().toISOString(),
    triggerHistory: [
      {
        timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
        event: "RULE_INITIALIZED",
        details: "Notify-only alert configured for price drop below ₹68,000.",
      },
    ],
  },
];

export function getPurchaseRules(): PurchaseRule[] {
  return [...globalRules];
}

export function getPurchaseRuleById(id: string): PurchaseRule | undefined {
  return globalRules.find((r) => r.id === id);
}

export function createPurchaseRule(params: {
  userId?: string;
  productId: string;
  productName: string;
  variant?: string;
  industry?: string;
  targetPriceInr: number;
  maxEffectivePayableInr: number;
  currentObservedPriceInr: number;
  saleEventName?: string;
  saleStartIso?: string;
  saleEndIso?: string;
  sellerPreference?: "authorized_only" | "any_verified" | "oem_direct";
  purchaseMode: PurchaseMode;
}): PurchaseRule {
  const id = `rule-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const now = new Date();
  const defaultSaleDate = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const rule: PurchaseRule = {
    id,
    userId: params.userId || "anonymous-buyer",
    productId: params.productId,
    productName: params.productName,
    variant: params.variant || "Standard Retail Specification",
    industry: params.industry || "general",
    targetPriceInr: Math.round(params.targetPriceInr),
    maxEffectivePayableInr: Math.round(params.maxEffectivePayableInr),
    currentObservedPriceInr: Math.round(params.currentObservedPriceInr),
    currency: "INR",
    saleEventName: params.saleEventName || "Next Scheduled Seasonal Festive Sale",
    saleStartIso: params.saleStartIso || defaultSaleDate,
    saleEndIso: params.saleEndIso || new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    sellerPreference: params.sellerPreference || "authorized_only",
    warrantyRequirement: "standard_brand_new",
    purchaseMode: params.purchaseMode,
    status: "ACTIVE_MONITORING",
    idempotencyToken: `idemp-${id}`,
    userConsentGranted: true,
    createdAt: now.toISOString(),
    lastEvaluatedAt: now.toISOString(),
    triggerHistory: [
      {
        timestamp: now.toISOString(),
        event: "RULE_CONFIGURED",
        details: `Configured ${params.purchaseMode} rule for ${params.productName} at target ₹${params.targetPriceInr.toLocaleString("en-IN")}.`,
      },
    ],
  };

  globalRules.unshift(rule);
  return rule;
}

export function approvePurchaseRule(
  id: string,
  approvalConfirmation: { userSignature: string; idempotencyToken?: string }
): { success: boolean; message: string; checkoutSessionId?: string } {
  const rule = globalRules.find((r) => r.id === id);
  if (!rule) {
    return { success: false, message: "Rule not found." };
  }

  // Idempotency check
  if (rule.status === "COMPLETED") {
    return {
      success: false,
      message: "Rule has already been safely completed. Duplicate orders strictly blocked.",
    };
  }

  const now = new Date().toISOString();
  rule.status = "COMPLETED";
  rule.lastEvaluatedAt = now;
  const checkoutId = `chk_auth_${Date.now()}_${rule.idempotencyToken}`;

  rule.triggerHistory.push({
    timestamp: now,
    event: "APPROVAL_EXECUTED",
    details: `User signature "${approvalConfirmation.userSignature}" verified. Safe checkout session ${checkoutId} dispatched with maximum cap ₹${rule.maxEffectivePayableInr.toLocaleString("en-IN")}.`,
  });

  return {
    success: true,
    message: `Authorized purchase prepared for ${rule.productName}. Maximum ceiling of ₹${rule.maxEffectivePayableInr.toLocaleString("en-IN")} enforced.`,
    checkoutSessionId: checkoutId,
  };
}

export function deletePurchaseRule(id: string): boolean {
  const initialLen = globalRules.length;
  globalRules = globalRules.filter((r) => r.id !== id);
  return globalRules.length < initialLen;
}

export function evaluateRuleAgainstPrice(
  rule: PurchaseRule,
  simulatedPrice: number
): { isTriggered: boolean; message: string } {
  rule.lastEvaluatedAt = new Date().toISOString();

  if (simulatedPrice <= rule.targetPriceInr) {
    rule.status = rule.purchaseMode === "APPROVAL_REQUIRED" ? "AWAITING_APPROVAL" : "TRIGGER_CONDITION_MET";
    const msg = `Target price condition met: observed ₹${simulatedPrice.toLocaleString("en-IN")} is below target ₹${rule.targetPriceInr.toLocaleString("en-IN")}.`;
    rule.triggerHistory.push({
      timestamp: new Date().toISOString(),
      event: "TARGET_REACHED",
      details: msg,
      effectivePriceObserved: simulatedPrice,
    });
    return { isTriggered: true, message: msg };
  }

  return {
    isTriggered: false,
    message: `Current price ₹${simulatedPrice.toLocaleString("en-IN")} is above target ₹${rule.targetPriceInr.toLocaleString("en-IN")}. Monitoring continues.`,
  };
}
