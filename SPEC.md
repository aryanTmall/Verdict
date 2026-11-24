# VERDICT — Universal Purchase Intelligence Architecture & Domain Specification

> **"See beyond the buy."**  
> An industrial-grade, buyer-aligned purchasing decision engine that cross-examines marketing claims, forecasts multi-year ownership consequences, audits cross-marketplace prices, executes bounded sale autopilots, scans physical items, and evaluates products and services across every industry with zero vibe math.

---

## 1. Executive Architectural Overview

Traditional e-commerce algorithms and conversational shopping agents are optimized for **the seller**: they summarize promotional marketing copy, optimize for conversion rates, and recommend products based on generic keyword matching.

**VERDICT** is architected strictly from the **buyer's perspective** as a legal cross-examination dossier. It replaces subjective prose with:
1. **Universal Category Classification:** Automatic extraction of industry, category, market, budget, constraints, and risk factors from conversational natural language.
2. **Domain-Specific Intelligence Packs:** Custom evaluation models, specialized milestone stations, running-cost calculators, and ownership metrics tailored per industry.
3. **Deterministic Engine Purity:** 100% of scoring, constraint filtering, TCO forecasting, and risk analysis is executed by a pure TypeScript engine (`src/lib/engine/index.ts`) with zero LLM hallucination.
4. **Verified Real Imagery & Direct Destination Links:** Authentic CDN product photography paired with verified manufacturer model listings and verified portals.
5. **Dynamic Ownership Strips:** Adapts the lifecycle visualization to the exact physics of the industry (fuel/service burn for cars, RERA/maintenance for real estate, energy/water for appliances, midsole degradation for sports shoes).
6. **VERDICT Price Radar:** Cross-marketplace price comparison with guaranteed effective payable prices (`Listed + Shipping - Verified Discounts`).
7. **Sale Autopilot:** Pre-configured target price triggers and bounded autonomous buying workflows with 3 explicit safety modes.
8. **Smart Companion Pairing:** Compatibility intelligence that explicitly rejects redundant dealer up-sells.
9. **Universal Visual & Barcode Scanning:** Physical product identification via phone camera, image drop, and GS1 GTIN-13 barcodes.
10. **Multilingual Indian Speech System:** Full coverage for all 22 Eighth Schedule Indian languages, Indian English, and practical Hinglish code-switching.

---

## 2. Universal Industry Classification Engine (`src/lib/domains/classifier.ts`)

Every user inquiry undergoes multi-dimensional intent and entity parsing before reaching the decision engine.

### Classification Schema
```typescript
interface DomainClassification {
  intent: "purchase" | "rental" | "subscription" | "booking" | "service";
  industry: IndustryId;
  category: string;
  subcategory?: string;
  market: "IN" | "US" | "UK" | "GLOBAL";
  currency: "INR" | "USD" | "EUR" | "GBP";
  budget?: number;
  budget_type: "on_road" | "ex_showroom" | "monthly" | "total" | "nightly" | "unspecified";
  requires_clarification: boolean;
  missing_information: string[];
  clarifying_questions?: Array<{
    id: string;
    question: string;
    options: string[];
  }>;
}
```

### Clarifying Question Strategy
When high-impact variables are absent from the buyer's statement (e.g. asking for a ₹19 Lakh car without specifying On-Road vs. Ex-Showroom budget), the classifier does **not** overwhelm the user. It prioritizes the single most critical differentiator and presents interactive option chips directly inside the Mission Intake dossier:

```json
{
  "industry": "automotive",
  "budget": 1900000,
  "requires_clarification": true,
  "missing_information": ["on_road_or_ex_showroom_budget", "preferred_vehicle_type"],
  "clarifying_questions": [
    {
      "id": "budget_type",
      "question": "Is ₹19,00,000 your maximum On-Road budget or Ex-Showroom price?",
      "options": ["On-Road (All-inclusive)", "Ex-Showroom (+ RTO/Taxes)"]
    }
  ]
}
```

---

## 3. Supported Industry Domains (`src/lib/domains/`)

VERDICT features 10 fully realized Domain Intelligence Packs plus an adaptive Universal Fallback engine.

```
src/lib/domains/
├── types.ts          # Unified domain types, attributes, milestone stations, & products
├── classifier.ts     # Universal regex/NLP query classifier & question generator
├── registry.ts       # Domain pack registry, lookup, and fallback specimen generator
├── automotive.ts     # Domain A: Cars, SUVs, Sedans, EVs (ex-showroom/on-road, RTO, ARAI vs traffic)
├── real_estate.ts    # Domain B: Apartments, Villas (RERA, carpet area, 6.6% stamp duty)
├── electronics.ts    # Domain C: Laptops, Wildlife Cameras (CIPA shots, shutter durability)
├── appliances.ts     # Domain D: Front-Load Washers, Commercial Chillers (BEE stars, energy/water)
├── sports.ts         # Domain E: Marathon Footwear, Gym Gear (cost-per-km, 850km midsole fatigue)
├── agriculture.ts    # Domain F: Utility Tractors, Irrigation (PTO HP, diesel burn per hour)
├── travel.ts         # Domain G: Family Beach Resorts (direct access, child safety, fee transparency)
├── fashion.ts        # Domain H: Automatic Timepieces (Calibers, 100m water resistance, cost-per-wear)
├── health.ts         # Domain I: True HEPA Air Purifiers (CADR 520m³/h, sleep dB, non-medical safety)
├── services.ts       # Domain J: Enterprise Dedicated Fiber (1 Gbps symmetric, 99.9% uptime SLA)
└── universal.ts      # Domain K: Universal dynamic evaluator for custom/unsupported goods
```

---

## 4. The Ownership Strip Across Industries

The trademark **Ownership Strip** dynamically transforms its horizon metrics depending on the industry:

```
[Day 1 (Acquisition / Onboarding)]
  ├── Automotive: PDI Inspection, RTO registration, initial ceramic shield
  ├── Real Estate: Stamp duty & 1% registration fees, khata transfer, interior fit-out
  ├── Appliances: Unboxing, authorized technician wall-mount demo, water inlet testing
  ├── Sports: Break-in period, initial arch stiffness, blister mitigation
  └── Electronics: Baseline OS overhead, thermal throttle testing

[Month 6 - Year 1]
  ├── Automotive: First 10,000 km paid service, real-world AC city fuel burn observed
  ├── Real Estate: Resident Welfare Association (RWA) monthly maintenance kicks in
  ├── Appliances: Descaling tablet cycle, drum cleanliness check
  ├── Sports: 350 km landmark, minor heel counter wear
  └── Electronics: Language server bloat, browser tab concurrency increase

[Year 3 - Year 5]
  ├── Automotive: Front brake pad replacement, tyre tread depth wear, battery swap
  ├── Real Estate: Capital appreciation tracking, exterior facade painting reserve
  ├── Appliances: Out-of-warranty motor PCB replacement reserve
  ├── Sports: 850 km foam compression milestone (rebound rate drops >35%)
  └── Electronics: Silicon headroom saturation, thermal paste drying
```

---

## 5. VERDICT Price Radar (`src/lib/price-radar.ts`)

Provides real-time cross-marketplace price comparison across Amazon, Flipkart, Croma, Reliance Digital, and Brand Official Stores.

### Mathematical Pricing Formula
$$\text{Effective Price} = \text{Listed Base Price} + \text{Shipping/Delivery} - \text{Verified Coupons}$$

Conditional bank card offers are audited separately and never conflated with guaranteed effective payable amounts.

### Exact Variant Detection
- Automatically parses RAM, storage, vehicle engine displacement, trim levels, and appliance capacities.
- Flags mismatches with prominent amber warnings, preventing misleading "cheapest" rankings based on inferior configurations.

---

## 6. Sale Autopilot & Autonomous Buying Safety (`src/lib/sale-autopilot.ts`)

Empowers buyers to set future price targets before seasonal festive sales launch.

### Three Distinct Operational Modes
1. **MODE 1 — NOTIFY ONLY:** Fires instant in-app alerts and notifications when target condition is met.
2. **MODE 2 — APPROVAL REQUIRED:** Prepares the cart checkout session and requires 1-click explicit buyer biometric or signature confirmation.
3. **MODE 3 — PRE-AUTHORIZED PURCHASE:** Enforces strict max payable ceiling, tokenized idempotency tokens, and zero raw financial credential storage.

---

## 7. Smart Companion Pairing & Anti-Upselling Defense (`src/lib/smart-pairing.ts`)

Evaluates accessories strictly against buyer need rather than merchant basket-size optimization.

### Categorization Tiers
- `ESSENTIAL`: Critical for warranty, safety, or legal compliance (e.g. Dual-channel dashcam, legal title verification).
- `RECOMMENDED`: High utility add-on (e.g. 7D all-weather floor mats, 65W GaN compact charger).
- `OPTIONAL`: Ergonomic or quality of life additions.
- `NOT_NEEDED / REDUNDANT`: Actively warns buyer against buying unnecessary dealer packages (e.g. ₹9,500 cosmetic chrome garnish, unpowered USB-C hubs when native Thunderbolt ports exist).

---

## 8. Universal Visual & Barcode Scanner (`src/lib/scan-service.ts`)

Allows buyers to identify products in physical stores:
- **Phone Camera Viewfinder:** Real-time stream capture via HTML5 `getUserMedia`.
- **GS1 GTIN-13 Barcode Resolver:** Instant catalog lookups with 98% match confidence.
- **Packaging Label OCR:** Extracts engine displacement, model year, and technical trims.

---

## 9. Multilingual Indian Voice & Speech System (`src/lib/multilingual.ts`)

Engineered for linguistic inclusivity across the Indian subcontinent:
- **All 22 Eighth Schedule Languages:** Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Santali, Kashmiri, Nepali, Sindhi, Konkani, Dogri, Manipuri, Bodo, Sanskrit.
- **Hinglish & Indian English:** Real-time conversational code-switching.
- **Web Speech Synthesis & SpeechRecognition:** Voice-driven search and spoken verdict summaries.

---

## 10. Automated Testing & Quality Assurance

Validated by **33 automated tests** executing in Vitest across 4 suites with 100% pass rate:
- `src/lib/master-features.test.ts` (11 tests)
- `src/lib/domains.test.ts` (10 tests)
- `src/lib/engine/index.test.ts` (7 tests)
- `src/lib/llm.test.ts` (5 tests)
