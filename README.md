# VERDICT — "See beyond the buy."

> **A buyer-side AI purchasing and ownership intelligence platform that tests seller marketing claims against real owner evidence, forecasts multi-year ownership headroom, compares cross-marketplace prices, executes bounded sale autopilots, scans physical goods, and evaluates products and services across every industry with zero vibe math.**

Built for the **IST Hackathon** ("Reimagining Shopping with AI") — Upgraded to **Universal Purchase Intelligence Engine**.

Live URL: [https://verdict-u9pt.onrender.com/](https://verdict-u9pt.onrender.com/)  
GitHub Repository: [https://github.com/aryanTmall/Verdict](https://github.com/aryanTmall/Verdict)  
Architecture Specification: [SPEC.md](SPEC.md)  
Comprehensive Test Report: [TEST_REPORT.md](TEST_REPORT.md)

---

## 1. Product Overview

Traditional AI shopping assistants are retailer-aligned: they summarize glowing marketing copy, push affiliate links, and recommend whatever fits the keyword query. 

**VERDICT** is strictly buyer-aligned. It acts as an aggressive defense attorney cross-examining a purchase before you pay:
1. **Universal Industry Intelligence:** Automatically understands any purchase query across 10 core industries (Automotive, Real Estate, Electronics, Appliances, Sports, Agriculture, Travel, Fashion, Health, Services) + an adaptive Universal Fallback.
2. **VERDICT Price Radar:** Instant cross-marketplace comparison across Amazon, Flipkart, Croma, Reliance Digital, and Brand Stores, calculating true Effective Prices ($\text{Effective} = \text{Listed} + \text{Shipping} - \text{Verified Discounts}$).
3. **Sale Autopilot:** Configures future target price conditions and safe autonomous buying rules before festive sales launch (with Notify Only, Approval Required, and Pre-Authorized bounded purchase modes).
4. **Smart Companion Pairing & Anti-Upselling:** Recommends essential accessories while actively warning buyers against deceptive dealer up-sells (e.g. ₹9,500 cosmetic chrome garnish, redundant unpowered USB-C hubs).
5. **Universal Scan Anything:** Identifies physical goods in real-time using phone camera feeds, uploaded photos, or GS1 GTIN-13 barcodes.
6. **Multilingual Indian Speech:** Complete voice-driven interface covering all 22 Eighth Schedule Indian languages, Indian English, and conversational Hinglish code-switching.
7. **The Ownership Strip:** Forecasts Day 1 through Year 4/5 lifecycle milestones (e.g. ARAI vs city fuel burn and brake pad wear for cars, RERA and RWA maintenance for real estate, midsole fatigue for running shoes, water/power burn for appliances) along with an active "Regret Clock".
8. **Deterministic, zero-vibe math:** All scoring, constraint filtering, headroom projections, regret risk scoring, and TCO calculations come from a pure TypeScript engine (`src/lib/engine/index.ts`).

---

## 2. Universal Architecture & Data Flow

```mermaid
flowchart TD
    User([Buyer Input: Voice / Text / Camera Scan / Barcode]) --> Intake[Intake Index Card]
    Intake --> ParseAPI[/api/mission/parse]
    
    subgraph UniversalClassifier [Universal Category Classifier]
        ParseAPI --> Classifier[Regex & Semantic Classifier]
        Classifier --> DomainPack[Domain Registry Lookup: 10 Industries]
        DomainPack --> ClarifyCheck{Requires Clarification?}
        ClarifyCheck -->|Yes| ClarifyChips[Defense Counsel Option Chips: On-Road vs Ex-Showroom]
        ClarifyCheck -->|No| Profile[Normalized Multi-Domain Profile]
        ClarifyChips --> Profile
    end

    Profile --> ClientEngine[In-Browser Deterministic Engine]
    DomainPacks[(10 Domain Packs + Universal Fallback)] --> ClientEngine
    
    subgraph EngineCore [Deterministic Core: src/lib/engine]
        ClientEngine --> ConstraintFilter[Domain Hard Constraint Filtering]
        ClientEngine --> Scoring[Multi-Criteria Normalization]
        ClientEngine --> MilestoneCalc[Domain Milestones & Trajectory]
        ClientEngine --> RiskCalc[Risk Matrix Score = Likelihood x Impact]
        ClientEngine --> TCOCalc[Multi-Year TCO + Operational Reserves]
    end

    EngineCore --> Shortlist[Top 3 Exhibits A/B/C + Dismissed Strip]
    EngineCore --> OwnershipStrip[Domain Ownership Strip: Day 1 - Year 5]
    
    Shortlist --> PriceRadar[VERDICT Price Radar: Amazon / Flipkart / Croma / Brand]
    Shortlist --> SmartPairing[Smart Pairing & Anti-Upsell Defense]
    Shortlist --> SaleAutopilot[Sale Autopilot & Bounded Buying Rules]
    
    Shortlist --> ClaimsAPI[/api/claims]
    ClaimsAPI --> SubstringVerifier[Server-side Quote Substring Verifier]
    SubstringVerifier --> ClaimsLedger[Claims Ledger Panel]
    
    EngineCore --> WhatIf[Instant What-If Simulator Sliders]
    WhatIf -.->|Zero-latency In-Browser Loop| ClientEngine

    EngineCore --> NarrateAPI[/api/narrate]
    NarrateAPI --> DigitGuard[Strict Digit-Guard Validator]
    DigitGuard --> VerdictModal[Verdict Rubber Stamp Slam & Thermal Receipt]
```

---

## 3. Supported Industries & Domain Intelligence Packs

VERDICT does not assume every query is about laptops or phones. It implements dedicated domain intelligence packs in `src/lib/domains/`:

1. **Automotive (`automotive.ts`):** Distinguishes Ex-Showroom and On-Road pricing (RTO + insurance), real-world city traffic mileage vs ARAI claims, ADAS availability, safety ratings (NCAP), and 5-year maintenance stations.
   *Specimens:* Hyundai Creta SX(O) Turbo (₹18.7L), Mahindra XUV700 AX5 (₹17.8L), Tata Harrier Smart (₹15.49L).
2. **Real Estate (`real_estate.ts`):** Carpet area ratio, RERA registration numbers, 6.6% stamp duty/registration acquisition costs, construction status, and monthly maintenance reserves.
   *Specimens:* Prestige Lakeside Habitat (₹89.5L, OC received), Sobha Dream Acres (₹84.5L), Godrej Splendour (₹88L).
3. **Electronics & Computing (`electronics.ts`):** Developer laptops, wildlife mirrorless cameras, CIPA battery ratings, shutter durability, RAM/silicon headroom growth.
   *Specimens:* Sony Alpha A7 IV (₹2.15L), Canon EOS R6 Mark II (₹2.05L), Acer Swift Go 14 OLED (₹72.9k).
4. **Home & Appliances (`appliances.ts`):** Front-load washers, refrigerators, commercial restaurant chillers, 5-star BEE energy ratings, annual water consumption, motor warranty.
   *Specimens:* Bosch 9kg 5-Star Series 6 (₹43.9k), LG 8kg AI Direct Drive (₹39.9k), Celfrost 1000L Chiller (₹1.24L).
5. **Sports & Fitness (`sports.ts`):** Marathon training shoes, running ergonomics, 850km midsole fatigue tracking, cost-per-km analytics.
   *Specimens:* Nike Pegasus 41 ReactX (₹11.8k), Asics Gel-Kayano 31 (₹14.9k).
6. **Agriculture (`agriculture.ts`):** 5-acre utility tractors, PTO horsepower, diesel burn per hour (2.2 L/hr), hydraulic lift capacity, local dealer radius.
   *Specimens:* Mahindra OJA 2127 4WD 27HP (₹5.65L), John Deere 3028EN 28HP (₹6.75L).
7. **Travel & Experiences (`travel.ts`):** Family beach resorts, direct private beach access, child safety, transparent fee audits.
   *Specimens:* Taj Exotica Resort & Spa Goa (₹24.5k/nt), Grand Hyatt Bambolim Bay (₹18.5k/nt).
8. **Fashion & Lifestyle (`fashion.ts`):** Automatic mechanical timepieces, Caliber 4R36 movement, 100m water resistance, 3-year cost-per-wear (~₹55/wear).
   *Specimens:* Seiko 5 Sports SRPD55K1 (₹25k).
9. **Health & Personal Care (`health.ts`):** True HEPA air purifiers (CADR 520 m³/h, 0.003-micron NanoProtect), 24dB sleep noise, filter replacement cadence.
   *Specimens:* Philips Series 3000i (₹28.9k).
10. **Business & Professional Services (`services.ts`):** Dedicated commercial enterprise fiber (1 Gbps symmetric, 99.9% uptime SLA, static IPv4).
    *Specimens:* Airtel Business Dedicated Internet.
11. **Universal Fallback (`universal.ts`):** Dynamic evaluator for any unsupported category (espresso machines, 4k drones, musical instruments, etc.) that extracts intended purpose and constructs explainable comparison criteria.

---

## 4. Master Feature Highlights

### A. VERDICT Price Radar
- Cross-marketplace arbitrage comparing same exact variant across Amazon, Flipkart, Croma, Reliance Digital, and Brand Official Stores.
- Calculates true **Effective Price**: Listed Price + Shipping + Applicable Charges - Verified Discounts.
- Audits separate conditional bank offers without inflating the guaranteed price.
- 12-month historical price points tracking Launch, Festive Dips, and Current Stabilized Medians.

### B. Sale Autopilot & Bounded Buying Rules
- Arms buyers with autonomous monitoring rules before festive sales launch.
- Three distinct modes:
  - `MODE 1 — NOTIFY ONLY`: Instant in-app alerts and notifications.
  - `MODE 2 — APPROVAL REQUIRED`: Prepares cart checkout and strictly awaits buyer authorization.
  - `MODE 3 — PRE-AUTHORIZED PURCHASE`: Bounded execution enforcing hard maximum payable cap with tokenized idempotency.

### C. Smart Companion Pairing
- Anti-upselling protection: Actively categorizes accessories into `ESSENTIAL`, `RECOMMENDED`, `OPTIONAL`, and `NOT_NEEDED`.
- Protects buyers from paying ₹9,500 for dealer chrome trims or redundant unpowered USB-C hubs.
- Automatic bundle discount optimizer providing verified 8% combo savings.

### D. Universal Scan Anything
- Live phone camera scanning via HTML5 `getUserMedia`.
- GS1 GTIN-13 barcode lookups resolving direct manufacturer catalog records.
- OCR text extraction from vehicle plates, appliance packaging, and tech spec sheets.

### E. Multilingual Indian Voice & Speech
- Complete coverage for all **22 Eighth Schedule Indian Languages** (Hindi, Bengali, Telugu, Marathi, Tamil, Urdu, Gujarati, Kannada, Odia, Malayalam, Punjabi, Assamese, Maithili, Santali, Kashmiri, Nepali, Sindhi, Konkani, Dogri, Manipuri, Bodo, Sanskrit) + Indian English & Hinglish.
- Real-time speech recognition, script auto-detection, and localized spoken cross-examination verdicts.

---

## 5. Tech Stack

- **Framework:** Next.js 16.4.6 (App Router, Turbopack, React 19)
- **Language:** TypeScript 5 (strict mode)
- **Styling:** Tailwind CSS v4 with custom "The Case File" design tokens
- **Typography:** Bricolage Grotesque + IBM Plex Mono
- **Motion:** Framer Motion layout springs + Lenis smooth scrolling
- **Charts:** Recharts Radar Chart (ink-styled)
- **Testing:** Vitest v5.1.1 with 33 passing automated tests across 4 suites

---

## 6. Run & Test Instructions

```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run complete test suite (All 33 tests across 4 suites)
npm test

# 3. Build for production (22 routes compiled cleanly)
npm run build

# 4. Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 7. Deployment Configuration (Render)

- **Build Command:** `npm install --legacy-peer-deps && npm run build`
- **Start Command:** `npx next start -H 0.0.0.0 -p $PORT`
- **Configuration File:** `render.yaml`
- **Node Version:** 20.18.0
