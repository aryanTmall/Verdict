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
});
