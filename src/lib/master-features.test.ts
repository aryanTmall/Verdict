import { describe, it, expect } from "vitest";
import { getPriceRadarReport } from "./price-radar";
import {
  createPurchaseRule,
  getPurchaseRules,
  evaluateRuleAgainstPrice,
  approvePurchaseRule,
  getPurchaseRuleById,
} from "./sale-autopilot";
import { getSmartPairings } from "./smart-pairing";
import { processVisualScan } from "./scan-service";
import {
  INDIAN_LANGUAGES,
  detectIndianLanguage,
  getLocalizedVerbalVerdict,
} from "./multilingual";
import { getNotifications, addNotification, markNotificationAsRead } from "./notifications";
import { classifyQuery } from "./domains/classifier";
import { getDomainPack } from "./domains/registry";
import { applyDnaToWeights } from "./buyer-dna";
import { auditDealRisk } from "./deal-risk";
import { isSafeUrl } from "../app/api/products/analyze-link/route";
import { evaluateRealityCheck, VERIFIED_MARKET_MINIMUMS } from "./reality-check";
import { buildTrackedPurchaseLink, MONETIZATION_DISCLOSURE } from "./monetization/affiliate";
import { TIER_ENTITLEMENTS, VERDICT_PRICING } from "./monetization/entitlements";
import { trackEvent } from "./monetization/analytics";

describe("VERDICT Master Platform Features Test Suite", () => {
  // Test 1: Price Radar & Cross-Marketplace Arbitrage
  describe("1. VERDICT Price Radar", () => {
    it("computes accurate effective prices (Listed + Shipping - Verified Discounts)", () => {
      const mockLaptop = {
        name: "Acer Swift Go 14 OLED",
        slug: "acer-swift-go-14-oled",
        priceInr: 72990,
        industry: "electronics",
        ramGb: 16,
        storageGb: 512,
      };

      const report = getPriceRadarReport(mockLaptop);

      expect(report.productName).toBe("Acer Swift Go 14 OLED");
      expect(report.listings.length).toBeGreaterThanOrEqual(4);

      // Verify calculation formula on Amazon listing
      const amazon = report.listings.find((l) => l.marketplace === "Amazon.in");
      expect(amazon).toBeDefined();
      expect(amazon!.effectivePriceInr).toBe(
        amazon!.listedPriceInr + amazon!.shippingInr - amazon!.verifiedDiscountInr
      );

      // Verify exact variant detection
      report.listings.forEach((listing) => {
        expect(listing.isExactVariant).toBe(true);
        expect(listing.destinationUrl).toBeTruthy();
      });

      // Verify historical data coverage
      expect(report.priceHistory.length).toBeGreaterThanOrEqual(5);
      expect(report.lowestEverPriceInr).toBeLessThanOrEqual(report.currentObservedPriceInr);
      expect(report.priceRecommendation).toMatch(/BUY NOW|WAIT FOR SALE|WATCH PRICE/);
    });

    it("evaluates automotive on-road pricing and RTO structures on CarWale feeds", () => {
      const mockCar = {
        name: "Hyundai Creta SX(O) 1.5 Turbo DCT",
        slug: "hyundai-creta-sxo-turbo",
        priceInr: 1870000,
        industry: "automotive",
      };

      const report = getPriceRadarReport(mockCar);
      expect(report.industry).toBe("automotive");
      const carwale = report.listings.find((l) => l.marketplace.includes("CarWale"));
      expect(carwale).toBeDefined();
      // On-road includes RTO & Insurance
      expect(carwale!.listedPriceInr).toBeGreaterThan(1870000);
    });
  });

  // Test 2: Sale Autopilot & Bounded Autonomous Buying
  describe("2. Sale Autopilot & Purchase Rules", () => {
    it("creates, monitors, and evaluates purchase rules across 3 safety modes", () => {
      const rule = createPurchaseRule({
        productId: "sony-a7-iv",
        productName: "Sony Alpha A7 IV",
        targetPriceInr: 195000,
        maxEffectivePayableInr: 200000,
        currentObservedPriceInr: 215000,
        purchaseMode: "APPROVAL_REQUIRED",
      });

      expect(rule.id).toContain("rule-");
      expect(rule.status).toBe("ACTIVE_MONITORING");
      expect(rule.idempotencyToken).toBeTruthy();

      // Price above target -> monitoring continues
      const eval1 = evaluateRuleAgainstPrice(rule, 205000);
      expect(eval1.isTriggered).toBe(false);

      // Price drops below target -> trigger condition met
      const eval2 = evaluateRuleAgainstPrice(rule, 192000);
      expect(eval2.isTriggered).toBe(true);
      expect(rule.status).toBe("AWAITING_APPROVAL");

      // Approve purchase rule
      const approval = approvePurchaseRule(rule.id, {
        userSignature: "ARYAN_BUYER_CONSENT",
      });
      expect(approval.success).toBe(true);
      expect(approval.checkoutSessionId).toBeTruthy();

      // Duplicate approval blocked by idempotency
      const duplicateApproval = approvePurchaseRule(rule.id, {
        userSignature: "ARYAN_BUYER_CONSENT",
      });
      expect(duplicateApproval.success).toBe(false);
      expect(duplicateApproval.message).toContain("Duplicate orders strictly blocked");
    });
  });

  // Test 3: Smart Pairing & Anti-Upselling Engine
  describe("3. Smart Pairing & Compatibility Audit", () => {
    it("recommends essential accessories and flags dealer cosmetic up-sells as REDUNDANT", () => {
      const mockCar = {
        name: "Hyundai Creta SX(O) Turbo",
        slug: "hyundai-creta-sxo-turbo",
        priceInr: 1870000,
        industry: "automotive",
      };

      const pairings = getSmartPairings(mockCar);

      // Must have essential dashcam and tyre inflator
      const dashcam = pairings.companions.find((c) => c.name.includes("Dash Cam"));
      expect(dashcam).toBeDefined();
      expect(dashcam!.necessity).toBe("ESSENTIAL");

      // Must flag cosmetic chrome garnish as NOT NEEDED
      const chrome = pairings.companions.find((c) => c.name.includes("Chrome"));
      expect(chrome).toBeDefined();
      expect(chrome!.necessity).toBe("NOT_NEEDED");
      expect(chrome!.antiUpsellReason).toContain("Dealerships aggressively push");

      // Anti-upsell savings must be tracked
      expect(pairings.bundleSummary.antiUpsellSavingsInr).toBeGreaterThan(0);
      expect(pairings.bundleSummary.bundleDiscountInr).toBeGreaterThan(0);
    });

    it("protects laptop buyers from buying redundant USB-C hubs when native ports exist", () => {
      const mockLaptop = {
        name: "Acer Swift Go 14 OLED",
        slug: "acer-swift-go-14-oled",
        priceInr: 72990,
        industry: "electronics",
      };

      const pairings = getSmartPairings(mockLaptop);
      const hub = pairings.companions.find((c) => c.name.includes("Hub"));
      expect(hub).toBeDefined();
      expect(hub!.necessity).toBe("NOT_NEEDED");
      expect(hub!.antiUpsellReason).toContain("already features dual Thunderbolt 4");
    });
  });

  // Test 4: Visual & Barcode Scanning
  describe("4. Universal Visual & Barcode Scanner", () => {
    it("resolves exact GS1 GTIN-13 barcodes to authenticated catalog records", async () => {
      const scan = await processVisualScan({ barcode: "8901030889123" });
      expect(scan.isExactMatch).toBe(true);
      expect(scan.confidence).toBeGreaterThanOrEqual(0.95);
      expect(scan.scanMethod).toBe("BARCODE_GTIN_LOOKUP");
      expect(scan.identifiedProductName).toContain("Philips");
    });

    it("extracts model numbers and chassis attributes from optical text/OCR", async () => {
      const scan = await processVisualScan({ ocrText: "Hyundai Creta 1.5 Turbo GDi DCT SX(O)" });
      expect(scan.isExactMatch).toBe(true);
      expect(scan.industry).toBe("automotive");
      expect(scan.scanMethod).toBe("LABEL_OCR");
    });
  });

  // Test 5: Multilingual Indian Voice and Language System
  describe("5. Multilingual Indian Language System", () => {
    it("covers all 22 Eighth Schedule Indian languages plus Hinglish and Indian English", () => {
      expect(INDIAN_LANGUAGES.length).toBeGreaterThanOrEqual(23);

      const scheduledCount = INDIAN_LANGUAGES.filter((l) => l.isSchedule8).length;
      expect(scheduledCount).toBe(22);

      // Verify Hindi, Tamil, Telugu, Bengali, Marathi, and Hinglish presence
      const codes = INDIAN_LANGUAGES.map((l) => l.code);
      expect(codes).toContain("hi-IN");
      expect(codes).toContain("ta-IN");
      expect(codes).toContain("te-IN");
      expect(codes).toContain("bn-IN");
      expect(codes).toContain("mr-IN");
      expect(codes).toContain("hi-Latn");
      expect(codes).toContain("en-IN");
    });

    it("auto-detects Hindi, Tamil, Telugu, Bengali, and Hinglish queries accurately", () => {
      expect(detectIndianLanguage("मुझे ₹19 लाख के अंदर एक गाड़ी चाहिए").code).toBe("hi-IN");
      expect(detectIndianLanguage("எனக்கு ₹19 லட்சத்திற்குள் ஒரு கார் வேண்டும்").code).toBe("ta-IN");
      expect(detectIndianLanguage("నాకు ₹19 లక్షల బడ్జెట్‌లో కారు కావాలి").code).toBe("te-IN");
      expect(detectIndianLanguage("আমাকে একটি ভালো গাড়ি দিন").code).toBe("bn-IN");
      expect(detectIndianLanguage("Mujhe 19 lakh ke andar ek acchi car chahiye").code).toBe("hi-Latn");
      expect(detectIndianLanguage("I need a car under 19 lakhs").code).toBe("en-IN");
    });

    it("synthesizes localized verbal cross-examination verdicts", () => {
      const hindiVerdict = getLocalizedVerbalVerdict({
        productName: "Hyundai Creta SX(O)",
        verdictKind: "CAUTION",
        priceInr: 1870000,
        keyFinding: "शहर के ट्रैफिक में एसी के साथ माइलेज 10-11 किमी/लीटर तक गिरता है।",
        languageCode: "hi-IN",
      });

      expect(hindiVerdict.speechText).toContain("आधिकारिक फैसला");
      expect(hindiVerdict.speechText).toContain("सावधानी से खरीदें");
      expect(hindiVerdict.speechText).toContain("₹18,70,000");

      const hinglishVerdict = getLocalizedVerbalVerdict({
        productName: "Hyundai Creta SX(O)",
        verdictKind: "CAUTION",
        priceInr: 1870000,
        keyFinding: "City mileage drops to 10-11 kmpl in traffic.",
        languageCode: "hi-Latn",
      });

      expect(hinglishVerdict.speechText).toContain("official verdict");
      expect(hinglishVerdict.speechText).toContain("Buy with Caution");
    });
  });

  // Test 6: In-App Notifications Hub
  describe("6. Notifications Hub", () => {
    it("handles notification events, mark as read, and persistent state", () => {
      const initialNotifs = getNotifications();
      expect(initialNotifs.length).toBeGreaterThan(0);

      const added = addNotification({
        title: "Test Sale Trigger",
        message: "Target price reached on test specimen",
        type: "AUTOPILOT_TRIGGER",
        severity: "high",
      });

      expect(added.id).toBeTruthy();
      expect(added.isRead).toBe(false);

      const markResult = markNotificationAsRead(added.id);
      expect(markResult).toBe(true);

      const updatedNotifs = getNotifications();
      const readNotif = updatedNotifs.find((n) => n.id === added.id);
      expect(readNotif?.isRead).toBe(true);
    });
  });

  // Test 7: Universal Education Domain Intelligence
  describe("7. Education Domain Intelligence", () => {
    it("correctly classifies educational bootcamps, courses and degrees", () => {
      const classification = classifyQuery("Which course should I choose for data science and AI?");
      expect(classification.industry).toBe("education");
      expect(classification.category).toBe("online_courses");

      const pack = getDomainPack("education");
      expect(pack).toBeDefined();
      expect(pack.id).toBe("education");
      expect(pack.name).toBe("Education, Degrees & Professional Certifications");
      expect(pack.sampleProducts.length).toBeGreaterThanOrEqual(3);

      const upgrad = pack.sampleProducts.find((p) => p.slug.includes("upgrad"));
      expect(upgrad).toBeDefined();
      expect(upgrad?.category).toBe("online_courses");
      expect(upgrad?.ownership).toBeDefined();
      const tcoBreakdown = upgrad?.ownership.tcoBreakdown || [];
      const totalTco = tcoBreakdown.reduce((sum, item) => sum + item.inr, 0);
      expect(totalTco).toBeGreaterThan(upgrad!.priceInr);
    });
  });

  // Test 8: Personal Buyer DNA Engine
  describe("8. Personal Buyer DNA Calibration", () => {
    it("dynamically shifts scoring weights based on buyer profile and maintains 1.0 normalization", () => {
      const baseWeights = {
        priceToValue: 0.25,
        performance: 0.35,
        buildReliability: 0.20,
        ecosystemFit: 0.20,
      };

      const budgetConscious = applyDnaToWeights(baseWeights, {
        budgetSensitivity: "STRICT_HARD_CAP",
        riskTolerance: "CONSERVATIVE_ZERO_DEFECT",
        longevityPriority: "MAXIMUM_LIFESPAN",
        preferredBrands: ["Acer"],
        avoidedBrands: [],
        repairabilityImportance: "CRITICAL",
      });

      // Price weight should increase for strict budget buyers
      expect(budgetConscious.priceToValue).toBeGreaterThan(baseWeights.priceToValue);

      // Sum of normalized weights should equal 1.0 within floating point delta
      const sum =
        budgetConscious.priceToValue +
        budgetConscious.performance +
        budgetConscious.buildReliability +
        budgetConscious.ecosystemFit;
      expect(Math.abs(sum - 1.0)).toBeLessThan(0.001);
    });
  });

  // Test 9: Deal Risk & Seller Reputation Detector
  describe("9. Deal Risk & Seller Reputation Detector", () => {
    it("flags unseasonal steep discounts and short return policies as high risk", () => {
      const suspiciousDeal = auditDealRisk({
        listedPriceInr: 45000,
        originalPriceInr: 95000, // > 50% discount
        sellerName: "FlashDeals Retailer LLC",
        sellerRating: 3.2,
        returnWindowDays: 3,
        isRefurbished: false,
      });

      expect(suspiciousDeal.riskScore).toBeGreaterThanOrEqual(40);
      expect(suspiciousDeal.riskFlags.length).toBeGreaterThanOrEqual(1);
      expect(suspiciousDeal.riskFlags.some((f) => f.includes("anomaly") || f.includes("discount") || f.includes("rating"))).toBe(true);

      const legitimateDeal = auditDealRisk({
        listedPriceInr: 72990,
        originalPriceInr: 79990,
        sellerName: "Appario Retail",
        sellerRating: 4.8,
        returnWindowDays: 14,
        isRefurbished: false,
      });

      expect(legitimateDeal.riskLevel).toBe("LOW");
      expect(legitimateDeal.isRecommended).toBe(true);
    });
  });

  // Test 10: Product Link Analysis & SSRF Security
  describe("10. Product Link Analysis & SSRF Security", () => {
    it("strictly blocks private RFC1918 subnets, localhost, and cloud metadata", () => {
      expect(isSafeUrl("http://localhost:3000/api")).toBe(false);
      expect(isSafeUrl("http://127.0.0.1:8080/secret")).toBe(false);
      expect(isSafeUrl("http://169.254.169.254/latest/meta-data")).toBe(false);
      expect(isSafeUrl("http://10.0.0.5:8000/keys")).toBe(false);
      expect(isSafeUrl("http://192.168.1.1/admin")).toBe(false);
      expect(isSafeUrl("ftp://files.example.com/data")).toBe(false);

      // Safe public domains
      expect(isSafeUrl("https://www.amazon.in/dp/B0CX24D8L2")).toBe(true);
      expect(isSafeUrl("https://www.flipkart.com/item/p/itm12345")).toBe(true);
      expect(isSafeUrl("https://www.carwale.com/hyundai-cars/creta/")).toBe(true);
    });
  });

  // Test 11: Reality Check & Anti-Hallucination Guardrails
  describe("11. Reality Check & Anti-Hallucination Engine", () => {
    it("intercepts impossible, joke, and absurd budgets with courteous corrections and realistic alternatives", () => {
      // Example A3: 'I want a car for ₹1'
      const carForOneRupee = evaluateRealityCheck({
        rawQuery: "I want a car for ₹1.",
        category: "cars",
        budgetInr: 1,
      });

      expect(carForOneRupee.status).toBe("UNREALISTIC_BUDGET");
      expect(carForOneRupee.isRealistic).toBe(false);
      expect(carForOneRupee.explanation).toContain("isn't a realistic budget for purchasing a car");
      expect(carForOneRupee.marketContext?.verifiedMinimumPriceInr).toBeGreaterThanOrEqual(400000);
      expect(carForOneRupee.suggestedAlternatives?.length).toBeGreaterThanOrEqual(2);

      // Joke / impossible science fiction check
      const flyingCar = evaluateRealityCheck({
        rawQuery: "I want a flying car with infinite battery",
      });
      expect(flyingCar.status).toBe("POSSIBLE_JOKE");
      expect(flyingCar.isRealistic).toBe(false);

      // Scam risk detection
      const scamIphone = evaluateRealityCheck({
        rawQuery: "Brand new iPhone 16 Pro Max for ₹8,000 on Telegram",
        category: "smartphones",
        budgetInr: 8000,
      });
      expect(scamIphone.status).toBe("SCAM_RISK");
      expect(scamIphone.isRealistic).toBe(false);
      expect(scamIphone.scamIndicators?.length).toBeGreaterThanOrEqual(1);

      // Contradictory requirements
      const contradiction = evaluateRealityCheck({
        rawQuery: "I want the cheapest laptop with maximum 4K RTX 4090 gaming performance budget 25000",
        category: "laptops",
        budgetInr: 25000,
      });
      expect(contradiction.status).toBe("CONTRADICTORY_REQUIREMENTS");
      expect(contradiction.tradeoffAnalysis).toBeDefined();
      expect(contradiction.tradeoffAnalysis?.conflictPoint).toContain("Portability vs Raw Graphical Wattage");

      // Realistic query passes cleanly
      const realisticCar = evaluateRealityCheck({
        rawQuery: "I need a family car, budget is 19 lakhs",
        category: "cars",
        budgetInr: 1900000,
      });
      expect(realisticCar.status).toBe("REALISTIC");
      expect(realisticCar.isRealistic).toBe(true);
    });
  });

  // Test 12: Business Model, Affiliate Tracking & Trust-First Entitlements
  describe("12. Monetization, Affiliate Architecture & Entitlements", () => {
    it("generates verified affiliate tracking links while maintaining zero scoring influence", () => {
      // Amazon India tracking
      const amazonLink = buildTrackedPurchaseLink({
        rawUrl: "https://www.amazon.in/dp/B0CX24D8L2",
        retailer: "Amazon.in",
        productName: "Acer Swift Go 14",
      });
      expect(amazonLink.hasAffiliateTracking).toBe(true);
      expect(amazonLink.destinationUrl).toContain("tag=verdict-in-21");
      expect(amazonLink.destinationUrl).toContain("utm_source=verdict");
      expect(amazonLink.disclosure).toContain(MONETIZATION_DISCLOSURE);

      // Flipkart tracking
      const flipkartLink = buildTrackedPurchaseLink({
        rawUrl: "https://www.flipkart.com/product/p/itm123",
        retailer: "Flipkart",
        productName: "Poco X6 Pro",
      });
      expect(flipkartLink.hasAffiliateTracking).toBe(true);
      expect(flipkartLink.destinationUrl).toContain("affid=verdictaff");

      // Entitlements matrix
      expect(TIER_ENTITLEMENTS.FREE.maxSavedCaseFiles).toBe(3);
      expect(TIER_ENTITLEMENTS.FREE.maxActivePriceWatches).toBe(2);
      expect(TIER_ENTITLEMENTS.PLUS.maxSavedCaseFiles).toBe(999);
      expect(TIER_ENTITLEMENTS.PLUS.canExportThermalReceipts).toBe(true);
      expect(TIER_ENTITLEMENTS.PLUS.canUseAutonomousSnipeMode).toBe(true);

      // Pricing structure
      expect(VERDICT_PRICING.monthlyInr).toBe(499);
      expect(VERDICT_PRICING.annualInr).toBe(3999);

      // Analytics tracking
      const trackedEvt = trackEvent("EXHIBIT_CLICKED", { specimen: "Acer Swift Go 14" });
      expect(trackedEvt.id).toBeTruthy();
      expect(trackedEvt.eventType).toBe("EXHIBIT_CLICKED");
    });
  });
});
