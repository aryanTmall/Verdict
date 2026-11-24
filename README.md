# VERDICT — "See beyond the buy."

[![Build & Tests](https://img.shields.io/badge/tests-39%20passing-1f6b4f?style=flat-square&logo=vitest&logoColor=white)](https://github.com/aryanTmall/Verdict)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.6%20Turbopack-1b1a17?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Node Version](https://img.shields.io/badge/node-%3E%3D22.0.0-2540d9?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20Strict-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Live Deployment](https://img.shields.io/badge/Render-Deployed%20Live-46e3b7?style=flat-square&logo=render&logoColor=black)](https://verdict-u9pt.onrender.com/)

> **A buyer-side AI purchasing and ownership intelligence engine that cross-examines marketing claims against real owner evidence, calculates total cost of ownership (TCO), arbitrates cross-marketplace prices, executes bounded sale autopilots, scans physical goods, and evaluates products and services across 11 core industries with zero vibe math.**

* **Live Application:** [https://verdict-u9pt.onrender.com/](https://verdict-u9pt.onrender.com/)
* **GitHub Repository:** [https://github.com/aryanTmall/Verdict](https://github.com/aryanTmall/Verdict)
* **Architecture Specification:** [SPEC.md](SPEC.md)
* **Test Verification Report:** [TEST_REPORT.md](TEST_REPORT.md)

---

## Table of Contents

1. [Product Manifesto](#1-product-manifesto)
2. [End-to-End System Architecture](#2-end-to-end-system-architecture)
3. [Universal 11-Industry Domain Packs](#3-universal-11-industry-domain-packs)
4. [How VERDICT Works: The Core Modules](#4-how-verdict-works-the-core-modules)
   - [4.1 Universal Query Classifier & Clarification](#41-universal-query-classifier--clarification)
   - [4.2 Deterministic Multi-Criteria Engine](#42-deterministic-multi-criteria-engine)
   - [4.3 VERDICT Price Radar & Arbitrage](#43-verdict-price-radar--arbitrage)
   - [4.4 Sale Autopilot & Bounded Buying Rules](#44-sale-autopilot--bounded-buying-rules)
   - [4.5 Seller & Deal Risk Detector](#45-seller--deal-risk-detector)
   - [4.6 Personal Buyer DNA Calibration](#46-personal-buyer-dna-calibration)
   - [4.7 Smart Pairing & Anti-Upsell Defense](#47-smart-pairing--anti-upsell-defense)
   - [4.8 Universal Visual & Barcode Scanner](#48-universal-visual--barcode-scanner)
   - [4.9 Multilingual Indian Voice (22 Scheduled Languages)](#49-multilingual-indian-voice-22-scheduled-languages)
   - [4.10 Product Link Intelligence & SSRF Protection](#410-product-link-intelligence--ssrf-protection)
   - [4.11 Purchase Memory Vault & Warranty Calendar Sync](#411-purchase-memory-vault--warranty-calendar-sync)
5. [The Legal Case File Design System](#5-the-legal-case-file-design-system)
6. [API Endpoints Reference](#6-api-endpoints-reference)
7. [Tech Stack & Architecture](#7-tech-stack--architecture)
8. [Automated Verification & Test Suite](#8-automated-verification--test-suite)
9. [Local Development & Setup Guide](#9-local-development--setup-guide)
10. [Production Deployment Guide (Render)](#10-production-deployment-guide-render)

---

## 1. Product Manifesto

Traditional shopping bots and recommendation engines are fundamentally compromised:
* **Retailer-Aligned:** They summarize manufacturer ad copy, promote affiliate kickbacks, and push products with the highest seller margins.
* **Electronics Myopia:** They assume every shopper is buying a laptop or smartphone.
* **"Vibe Math":** They generate arbitrary ratings (e.g., "8.7/10") out of thin air using non-deterministic LLM temperature loops.
* **Day-1 Blindness:** They optimize for checkout friction while ignoring Year-3 maintenance bills, battery degradation, and dealer up-sell traps.

**VERDICT** is built on an adversarial premise: **Act as an aggressive defense attorney cross-examining a purchase before the buyer parts with their money.**

```
[ Traditional AI Shopping ]                   [ VERDICT Intelligence ]
---------------------------                   ------------------------
Summarizes 5-star ad copy   ───► INSTEAD ───► Cross-examines 1-star owner receipts
Hides dealer up-sells       ───► INSTEAD ───► Flags cosmetic accessories as REDUNDANT
Hallucinates 9.2/10 scores  ───► INSTEAD ───► Calculates deterministic scores via pure math
Focuses on checkout click   ───► INSTEAD ───► Simulates multi-year TCO & maintenance milestones
```

---

## 2. End-to-End System Architecture

```mermaid
flowchart TD
    User([Buyer Input: Voice / Text / Camera Scan / URL Link]) --> Intake[Intake Index Card]
    
    subgraph InputProcessing [1. Ingestion & Link Intelligence]
        Intake -->|Raw Query| ParseAPI[/api/mission/parse]
        Intake -->|Pasted URL| LinkAPI[/api/products/analyze-link]
        Intake -->|Camera / Barcode| ScanAPI[/api/products/scan]
        LinkAPI -->|SSRF Check Passed| ExtractedSpecimen[Extracted Specimen & Mission Query]
        ExtractedSpecimen --> ParseAPI
    end

    subgraph UniversalClassification [2. Universal Category Classification]
        ParseAPI --> Classifier[Regex & Semantic Classifier]
        Classifier --> DomainRegistry[Domain Pack Lookup: 11 Industries]
        DomainRegistry --> ClarifyCheck{Requires Clarification?}
        ClarifyCheck -->|Yes| DefenseChips[Defense Counsel Clarification Chips]
        ClarifyCheck -->|No| NormalizedProfile[Normalized Multi-Domain Profile]
        DefenseChips --> NormalizedProfile
    end

    subgraph DeterministicEngine [3. Deterministic Core: src/lib/engine]
        NormalizedProfile --> DnaAdjuster[Personal Buyer DNA Calibration]
        DnaAdjuster --> ConstraintFilter[Domain Hard Constraint Filtering]
        ConstraintFilter --> ScoringEngine[Multi-Criteria Normalization: Sum = 1.0]
        ScoringEngine --> MilestoneCalc[Domain Lifecycle Trajectory Engine]
        ScoringEngine --> RiskCalc[Risk Matrix Score: Likelihood x Impact]
        ScoringEngine --> TCOCalc[TCO Engine: Invoice + Opex + Reserves]
    end

    subgraph IntelligenceSuite [4. Intelligence & Protection Suite]
        ScoringEngine --> Shortlist[Exhibits A/B/C + Dismissed Strip]
        Shortlist --> PriceRadar[VERDICT Price Radar & Arbitrage]
        Shortlist --> SaleAutopilot[Sale Autopilot & Bounded Purchase Rules]
        Shortlist --> DealRisk[Seller & Deal Risk Detector]
        Shortlist --> SmartPairing[Smart Pairing & Anti-Upsell Defense]
        Shortlist --> OwnershipStrip[5-Year Ownership Horizon & Regret Clock]
    end

    subgraph PostPurchase [5. Purchase Memory & Vault]
        Shortlist --> VaultSave[/api/save]
        VaultSave --> VaultDashboard[/vault: Case Files, Watchlist, Reminders]
        VaultDashboard --> CalendarSync[/api/ics: 1-Click .ics Calendar Export]
    end
```

---

## 3. Universal 11-Industry Domain Packs

VERDICT departs completely from single-category tools. It incorporates **11 comprehensive domain packs** plus an adaptive Universal Fallback engine. Each pack defines domain-specific attributes, hard constraint rules, mathematical scoring weights, multi-year lifecycle milestones, and risk models:

| Industry Domain | Key Metrics & Specifications | Real-World Specimen Examples | Multi-Year TCO & Risk Model |
| :--- | :--- | :--- | :--- |
| **1. Automotive** (`automotive.ts`) | ARAI vs City Real-World Mileage, NCAP Crash Rating, Powertrain, RTO/Registration | Hyundai Creta SX(O) (₹18.7L), Mahindra XUV700 AX5 (₹19.2L), Tata Harrier Smart (₹17.9L) | 5-Year Fuel Burn (City vs Hwy), Mandatory Insurance, Scheduled 10k/20k/50k km Services, Brake Pad Fatigue. |
| **2. Real Estate** (`real_estate.ts`) | Carpet Area, RERA Registration, Undivided Land Share (UDS), Water/STP Source | Prestige Lakeside Habitat (₹88L), Sobha Dream Acres (₹84L) | Registration Stamp Duty, Society RWA Maintenance Reserve, Water Tanker Escalation Risk, Dampness Audits. |
| **3. Electronics** (`electronics.ts`) | Single-Core Cinebench, RAM Expandability, Battery Wh, Display Nits, Port Topology | Acer Swift Go 14 OLED (₹72.9k), Apple MacBook Air M3 (₹1.14L), Lenovo Yoga Slim 6 (₹68.9k) | Battery Health Degradation Curve, Soldered RAM Obsoletion, Display Burn-In Risks, Thermal Throttling. |
| **4. Appliances** (`appliances.ts`) | BEE Star Energy Rating, Operating Noise (dB), BLDC Direct Drive Motor, Water Litres/Cycle | Bosch Series 6 9kg Front Load (₹43.9k), LG AI Direct Drive (₹39.9k), Celfrost 1000L Chiller (₹1.24L) | 5-Year Annual Power Consumption, Hard-Water Descaling, Inverter Motor Warranty, Damaged Seal Alerts. |
| **5. Sports & Fitness** (`sports.ts`) | Midsole Foam Tech, Stack Height, Heel-to-Toe Drop, Pronation Support, Wet Grip Traction | Nike Pegasus 41 ReactX (₹11.8k), Asics Gel-Kayano 31 (₹14.9k) | 850km Midsole Cushioning Breakdown Curve, Cost-Per-Kilometer Analytics, Outsole Rubber Delamination. |
| **6. Agriculture** (`agriculture.ts`) | PTO Horsepower, Diesel Burn (L/hr), Hydraulic Lift Capacity, 4WD Axle, Dealer Radius | Mahindra OJA 2127 4WD 27HP (₹5.65L), John Deere 3028EN 28HP (₹6.75L) | Operational Diesel Costs per Acre, 500-Hour Hydraulic Fluid Flushes, Rotavator Load Wear, Implements. |
| **7. Travel & Stays** (`travel.ts`) | Beach Access, Infant/Child Safety, Cancellation Window, Resort Hidden Fees, Meal Plan | Taj Exotica Resort & Spa Goa (₹24.5k/nt), Grand Hyatt Bambolim Bay (₹18.5k/nt) | Airport Transfers, Mandatory Surcharges, Monsoon Sea-Roughness Flags, Hidden Resort Amenity Fees. |
| **8. Fashion & Horology** (`fashion.ts`) | Mechanical Movement Caliber, Water Resistance (Meters), Glass Crystal, Lug Width | Seiko 5 Sports SRPD55K1 (₹25k) | Cost-Per-Wear Over 3 Years (~₹55/wear), 5-Year Mechanical Gasket & Lubrication Overhaul Reserves. |
| **9. Health Tech** (`health.ts`) | CADR Clean Air Delivery (m³/h), Filtration Microns, Decibels in Sleep Mode, Ozone-Free | Philips Series 3000i (₹28.9k) | Annual Replacement HEPA Filter Costs, Sensor Optical Dust Recalibration, Sleep Mode Sound Audits. |
| **10. Commercial Services** (`services.ts`) | Symmetric Throughput, Uptime SLA Guarantee (99.9%), Static IPv4, MTTR Repair Window | Airtel Business Dedicated Internet Gigabit | Monthly Recurring Fiber Leases, Downtime Penalty Rebates, Router Hardware Upgrades. |
| **11. Education & Bootcamps** (`education.ts`) | Weekly Hours, Accreditation (WES / ACE), Placement Network, Capstones, Mentorship | IIT Bangalore / UpGrad PG Diploma (₹2.99L), Scaler ML Master (₹1.85L), Google Coursera (₹14.9k) | Cloud Compute Lab Reserves, Exam Fees, Workload Fatigue Failure Rate, Placement Fine-Print Audits. |
| **12. Universal Fallback** (`universal.ts`) | Dynamically maps intent, budget, and durability criteria for unlisted categories | Espresso Machines, 4K Cinema Drones, Synthesizers, Industrial Power Tools, etc. | Normalized Build Quality, Projected MTBF, Maintenance Overhaul Schedules, Operating Consumables. |

---

## 4. How VERDICT Works: The Core Modules

### 4.1 Universal Query Classifier & Clarification
* Located at [`src/lib/domains/classifier.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/lib/domains/classifier.ts).
* Parses natural language input using regex heuristics and token boundaries to extract:
  - `industry`, `category`, `subcategory`, `market`, `budget`, `currency`
  - Required attributes (e.g., fuel type, seating capacity, storage size, duration)
  - Missing critical context (e.g., On-Road vs Ex-Showroom budget, City vs Highway usage)
* If vital parameters are ambiguous, the engine serves targeted **Defense Counsel Clarification Chips** to confirm intent with a single tap rather than bombarding the buyer with open-ended chat queries.

### 4.2 Deterministic Multi-Criteria Engine
* Located at [`src/lib/engine/index.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/lib/engine/index.ts).
* **Guaranteed Zero Vibe Math:** Eliminates non-deterministic LLM grading.
* **Hard Constraint Pruning:** Specimen candidates that exceed budget tolerance or violate required physical criteria are immediately dismissed to the `Dismissed Candidates` ledger with clear legal reasoning (e.g., *"Exceeds on-road budget cap by ₹1,40,000"*).
* **Criteria Normalization:** Normalizes scores across Performance, Reliability, Longevity, and Value:
$$\text{Score}_{\text{final}} = \sum_{i=1}^n \left( w_i \cdot \text{Score}_i \right), \quad \text{where} \quad \sum_{i=1}^n w_i = 1.0$$
* **Shortlist Archetype Badges:** Every evaluated shortlist maps candidates to unambiguous roles:
  - `🥇 BEST OVERALL` (Exhibit A): Highest balanced score across all criteria.
  - `💰 BEST VALUE` (Exhibit B): Highest performance yield per rupee spent.
  - `🛡️ BEST ALTERNATIVE` (Exhibit C): High reliability safety pick with minimal operational risk.
* **Buyer Demarcation:** Explicitly provides `"Who should buy"` vs `"Who should avoid / Regret Risk"` for each option.

### 4.3 VERDICT Price Radar & Arbitrage
* Located at [`src/lib/price-radar.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON build/src/lib/price-radar.ts) and [`PriceRadarModal.tsx`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/components/radar/PriceRadarModal.tsx).
* **Cross-Marketplace Arbitrage:** Compares identical variant SKUs across Amazon.in, Flipkart, Croma, Reliance Digital, and Brand Direct Stores.
* **Real Effective Price Calculation:**
$$\text{Effective Price} = \text{Listed Price} + \text{Shipping Charges} - \text{Verified Guaranteed Discounts}$$
* **Historical Price Intelligence:** Records 12-month median price curves:
  - Detects if an item is currently at its All-Time Low, Typical Stable Median, or Overpriced Peak.
  - Recommends whether to **"BUY NOW"** or **"WAIT FOR SALE"** based on historical seasonal drops.

### 4.4 Sale Autopilot & Bounded Buying Rules
* Located at [`src/lib/sale-autopilot.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/lib/sale-autopilot.ts) and [`SaleAutopilotModal.tsx`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/components/autopilot/SaleAutopilotModal.tsx).
* Prepares buyers for flash sales (Diwali, Great Indian Festival, Big Billion Days) before prices drop:
  1. **Mode 1 — NOTIFY ONLY:** Sends in-app and browser notifications when target price is hit.
  2. **Mode 2 — APPROVAL REQUIRED:** Stages the order, prepares the cart, and requires 1-click dual confirmation.
  3. **Mode 3 — PRE-AUTHORIZED AUTONOMOUS PURCHASE:** Executes automated checkout strictly bounded by:
     - Hard maximum payable budget cap (cannot be exceeded under any circumstances).
     - Tokenized idempotency keys to strictly prevent accidental duplicate orders.
     - Authorized payment method reservation with seller rating bounds ($\ge 4.2$ stars).

### 4.5 Seller & Deal Risk Detector
* Located at [`src/lib/deal-risk.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/lib/deal-risk.ts).
* Automatically audits listing metadata before transaction authorization:
  - **Steep Discount Anomaly:** Flags unseasonal discounts $> 28\%$ below recorded market median to warn against grey-market imports, refurbished returns, or open-box fraud.
  - **Seller Reputation Audit:** Penalizes unverified 3rd-party sellers and ratings $< 4.0$ stars.
  - **Short Return Policy Warning:** Flags listings with restrictive ($\le 3$ days) or non-existent return policies.

### 4.6 Personal Buyer DNA Calibration
* Located at [`src/lib/buyer-dna.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/lib/buyer-dna.ts) and [`BuyerDnaModal.tsx`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/components/dna/BuyerDnaModal.tsx).
* Personalizes buying intelligence without black-box AI bias:
  - **Budget Sensitivity:** `STRICT_HARD_CAP` boosts Price-to-Value scoring weights by $+10\%$.
  - **Risk Tolerance:** `CONSERVATIVE_ZERO_DEFECT` shifts $+10\%$ weight onto Reliability and Build Quality.
  - **Longevity Priority:** `MAXIMUM_LIFESPAN` boosts battery, motor, and chassis durability weights by $+5\%$.
  - **Brand Affinity:** Injects user-specified preferred and avoided brands directly into exhibit filtering.
  - **Mathematical Invariant:** Automatically renormalizes all adjusted criteria weights to strictly sum to $1.0000$.

### 4.7 Smart Pairing & Anti-Upsell Defense
* Located at [`src/lib/smart-pairing.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/lib/smart-pairing.ts) and [`SmartPairingSection.tsx`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/components/pairing/SmartPairingSection.tsx).
* **Active Anti-Upselling:** Flags dealer accessory kits and add-ons into clear categories:
  - `ESSENTIAL`: Critical for safety/operation (e.g., 70mai A500S Dashcam for cars, 67W GaN Charger for laptops).
  - `RECOMMENDED`: Protective items extending lifespan (e.g., 3M Underbody Rust Coating, Hard-Water Descaler).
  - `REDUNDANT / NOT NEEDED`: Warns buyers against high-margin traps (e.g., ₹9,500 dealer chrome trim kits, unpowered USB-C hubs when laptop already has native HDMI/USB-A).
* **Bundle Optimizer:** Applies genuine bundle discounts ($\approx 8\%$) when pairing verified accessories.

### 4.8 Universal Visual & Barcode Scanner
* Located at [`src/lib/scan-service.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/lib/scan-service.ts) and [`ScanModal.tsx`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/components/scanner/ScanModal.tsx).
* **Live Camera Feed:** Runs directly in-browser using HTML5 `navigator.mediaDevices.getUserMedia`.
* **GS1 GTIN-13 Barcode Resolver:** Instant barcode lookup against verified catalog specimens.
* **Optical Model & Plate Extraction:** Extracts model numbers and brand markings from physical product stickers, appliance badges, or vehicle nameplates.

### 4.9 Multilingual Indian Voice (22 Scheduled Languages)
* Located at [`src/lib/multilingual.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/lib/multilingual.ts) and [`MultilingualVoiceDrawer.tsx`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/components/voice/MultilingualVoiceDrawer.tsx).
* **Comprehensive Indian Language Coverage:** Covers all **22 Eighth Schedule Indian Languages**:
  * *Assamese, Bengali, Bodo, Dogri, Gujarati, Hindi, Kannada, Kashmiri, Konkani, Maithili, Malayalam, Manipuri, Marathi, Nepali, Odia, Punjabi, Sanskrit, Santali, Sindhi, Tamil, Telugu, Urdu.*
  * Plus Indian English and natural code-switching **Hinglish** (Hindi in Roman script).
* **Audio Synthesis:** Uses the Web Speech API with fallbacks to synthesize verbal cross-examination verdicts in the user's native dialect.

### 4.10 Product Link Intelligence & SSRF Protection
* Located at [`src/app/api/products/analyze-link/route.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/app/api/products/analyze-link/route.ts).
* Enables buyers to paste any URL from Amazon India, Flipkart, CarWale, or web portals.
* **Strict SSRF (Server-Side Request Forgery) Defense:**
  - Rejects localhost (`127.0.0.1`, `localhost`, `::1`, `0.0.0.0`).
  - Rejects AWS / GCP / Azure metadata endpoints (`169.254.169.254`, `metadata.*`).
  - Rejects RFC1918 private subnets (`10.0.0.0/8`, `192.168.0.0/16`, `172.16.0.0/12`, `*.local`, `*.internal`).
* Extracts canonical model names and automatically triggers an aggressive cross-examination mission.

### 4.11 Purchase Memory Vault & Warranty Calendar Sync
* Located at [`src/app/vault/page.tsx`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/app/vault/page.tsx) and [`src/app/api/ics/route.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/app/api/ics/route.ts).
* Multi-Tab Purchase Companion:
  - **Saved Case Files:** Thermal receipts and complete multi-year evidence logs for all saved verdicts.
  - **Price Watch & Autopilot:** Active price alerts and pre-authorized rules.
  - **Warranty & Maintenance Calendar Sync:** Generates RFC 5545 compliant `.ics` calendar invitation files to sync maintenance dates (e.g. 10,000 km car service, 6-month RO water filter replacement, credit card warranty expiration) with Google Calendar, Apple Calendar, and Microsoft Outlook.

### 4.12 Reality Check & Anti-Hallucination Guardrails Engine (Module A)
* Located at [`src/lib/reality-check.ts`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/lib/reality-check.ts) and [`src/components/reality/RealityCheckBanner.tsx`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/components/reality/RealityCheckBanner.tsx).
* **Zero-Hallucination Invariant:** VERDICT strictly refuses to fabricate fake cars, impossible specs, non-existent deals, or imaginary sellers.
* **10-State Request Classification:**
  - `REALISTIC`: Request is viable within contemporary retail inventory.
  - `UNREALISTIC_BUDGET`: Intercepts absurd budgets (e.g., *"I want a car for ₹1"*) and politely explains realistic market minimums (e.g., Maruti Alto K10 starts at ₹4.3L ex-showroom) while offering actionable alternatives (used vehicles, monthly subscriptions, budget adjustments).
  - `CONTRADICTORY_REQUIREMENTS`: Detects conflicting physical engineering goals (e.g., *"cheapest laptop with maximum 4K RTX 4090 gaming performance"*) and provides a balanced trade-off analysis explaining the physical conflict between thermal dissipation mass and low cost/weight.
  - `SCAM_RISK`: Alerts buyers when a flagship item is listed dramatically below wholesale cost (e.g., *"iPhone 16 Pro Max for ₹8,000 on Telegram"*), detailing counterfeit and advance-fee fraud indicators.
  - `IMPOSSIBLE_REQUIREMENTS` / `POSSIBLE_JOKE`: Redirects sci-fi or meme requests (*"flying car"*, *"100TB RAM laptop"*, *"plot on Mars"*) toward real-world performance engineering.
  - `UNSAFE_PURCHASE`: Blocks hazardous, uncertified lithium packs or prescription drugs without medical authorization.

### 4.13 Business Model, Monetization & Trust-First Charter (Module B)
* Located at [`src/lib/monetization/`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/lib/monetization/) and [`MonetizationTransparencyModal.tsx`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/components/monetization/MonetizationTransparencyModal.tsx).
* **The Trust-First Rule:** Affiliate commissions and commercial relationships strictly **NEVER** influence product scores, rankings, Best Overall awards, or risk matrices. Affiliate tracking is an exit monetization attribute, completely decoupled from evaluation math.
* **Affiliate Purchase Link Abstraction (`affiliate.ts`):** Transparently attaches verified partner tags (Amazon Associates `verdict-in-21`, Flipkart `verdictaff`, Croma) and standard analytics UTM tags without breaking destination URLs.
* **VERDICT PLUS Subscription Tier (`entitlements.ts`):**
  - **Free Tier:** Core advisor, 3 saved case files, 2 active price monitors, 2-year ownership horizon.
  - **VERDICT PLUS (₹499/mo · ₹3,999/yr):** Unlimited saved cases, unlimited price watches, full 5-year ownership milestone forecasts, exportable thermal PDF receipts, What-If simulator, and Autopilot Mode 3 autonomous snipe.
  - *Includes an in-browser 1-click Free Pass toggle for judges and test users.*
* **Zero-Corruption Sponsored Placement Rules:** Future sponsored placements must be distinctly labelled `[SPONSORED PROMOTION]`, visually separated from organic exhibits, and can never replace Exhibit A (Best Overall).
* **Privacy-First Analytics (`analytics.ts`):** Beacon tracking for search volume, category distribution, and affiliate clicks with **zero PII collection**.
* **B2B Purchasing Intelligence API (`/api/b2b/evaluate`):** Programmatic endpoint for enterprise e-commerce platforms, marketplaces, and consumer finance apps.

### 4.14 Second-Hand, Pre-Owned & Refurbished Market Intelligence (Module C)
* Located at [`src/lib/second-hand/`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/lib/second-hand/) and [`src/components/second-hand/`](file:///C:/Users/aryan/.gemini/antigravity/scratch/IST%20HACKATHON%20build/src/components/second-hand/).
* Answers the three fundamental buyer arbitration questions:
  1. *Which product is best for me?*
  2. *Should I buy it new, refurbished, or used?*
  3. *Is this specific deal worth taking, or is it a trap?*
* **Purchase Condition Selector (C1):** Direct filtering across `NEW`, `REFURBISHED`, `CERTIFIED_PRE_OWNED`, `OPEN_BOX`, and `ANY_CONDITION` (which triggers automatic price-to-utility condition arbitrage).
* **New vs Used vs Refurbished Comparison Matrix (C2):** Side-by-side comparative table evaluating Initial Price, Real-world Warranty, Reliability Risk, Expected Lifespan, Repair Reserves, and Total Value Score.
* **Marketplace Discovery Engine (C3):** Pluggable provider architecture integrating **Amazon Renewed**, **Cashify SuperSale Certified**, **Spinny Assured (200-Point Inspection)**, **CARS24 Quality Verified**, and **Verified Classifieds**.
* **Empirical Fair-Price Engine (C4):** Calculates realistic fair depreciation curves tailored to the Indian market:
  - Electronics & Laptops: 26–28% Year 1 depreciation, 14–15% subsequent years, with condition, box, and GST invoice multipliers.
  - Automotive: 15% Year 1 depreciation, 8% subsequent years.
  - Anomaly Flag: Any listing $> 22\%$ below fair market floor is aggressively flagged as `SUSPICIOUSLY_CHEAP` (potential scam, stolen goods, or unrepairable board defect).
* **Dedicated Used Deal Score (C5):** Deterministic 0–100 rating combining fair price score, physical condition score, and seller risk deduction, emitting clear advice: `BUY`, `BUY_IF_NEGOTIATED`, `INSPECT_FIRST`, `WAIT`, or `AVOID`.
* **Category Physical Inspection Checklists (C7):** Critical verification steps with exact instructions and red-flag explanations:
  - *Automotive:* Chassis apron welds, Parivahan bank hypothecation NOC, odometer tampering vs service logs, flood line detection.
  - *Smartphones:* DoT CEIR IMEI blacklist, iCloud/FRP activation locks, TrueTone/120Hz display authenticity, SIM tray liquid contact indicators (LCI).
  - *Laptops & Tech:* BIOS passwords, corporate Computrace/MDM locks, battery cycle counts, thermal throttle tests, USB-C power negotiation.
* **Multi-Year Pre-Owned Regret Simulator (C8):** Timeline forewarning buyers of common second-hand failure points (worn battery cells, brake rotor skimming, dry thermal paste, discontinued OS updates).
* **Negotiation Assistant (C9):** Computes suggested opening offer, target price, and walk-away ceiling, providing a **1-click copyable polite WhatsApp / chat message** citing market comps.
* **Buy New or Used Decision Banner (C10 / C12):** Deterministic arbitration banner specifying whether buying refurbished or used is mathematically justified and listing mandatory pre-purchase conditions.
* **Dedicated REST API:** `/api/products/[id]/used-market` returns the full comparative matrix, discovered listings, valuation, deal score, checklist, and negotiation strategy.

---

## 5. The Legal Case File Design System

VERDICT uses a bespoke design language modeled after an **adversarial courtroom case file**:

```
Background Primary:       #F2EBD8   (Warm Manila Courtroom Folder)
Index Card Specimen:      #FBF7EA   (Off-white Legal Evidence Paper)
Typography & Ink:         #1B1A17   (Deep Archival Jet Black)
Legal Accent Blue:        #2540D9   (Court Docket Blue)
Contradiction Red:        #D8381C   (Evidence Defect / Regret Stamp)
Verified Green:           #1F6B4F   (Affirmed Specimen Green)
Advisory Amber:           #F3C94B   (Warning / Caveat Emptor)
Primary Font:             Bricolage Grotesque (Bold, authoritative legal headers)
Monospace Font:           IBM Plex Mono (Exact specs, chassis codes, receipts)
```

---

## 6. API Endpoints Reference

| Route | Method | Purpose & Guardrails |
| :--- | :--- | :--- |
| `/api/mission/parse` | `POST` | Parses query string into structured JSON domain intent profile. |
| `/api/products/analyze-link` | `POST` | Validates pasted URLs against SSRF and extracts product specimens. |
| `/api/products/scan` | `POST` | Accepts Base64 images or barcodes and identifies catalog specimens. |
| `/api/price-radar/search` | `GET` | Compares live marketplace listings across Amazon, Flipkart, Croma, etc. |
| `/api/products/[id]/price-history` | `GET` | Returns 12-month historical price points and seasonal dip trends. |
| `/api/products/[id]/pairings` | `GET` | Audits accessories into Essential, Recommended, and Redundant up-sells. |
| `/api/sale-autopilot/rules` | `GET/POST` | Lists and registers autonomous price watch and auto-purchase rules. |
| `/api/sale-autopilot/rules/[id]/approve` | `POST` | Idempotent endpoint to authorize execution of pre-authorized orders. |
| `/api/voice/transcribe` | `POST` | Transcribes audio buffers across Indian dialects into text. |
| `/api/voice/respond` | `POST` | Synthesizes localized verbal cross-examination verdicts. |
| `/api/notifications` | `GET/POST` | Manages persistent in-app notifications and sale triggers. |
| `/api/ics` | `POST` | Generates `.ics` calendar reminder files for maintenance milestones. |
| `/api/claims` | `POST` | Verifies product claims with strict substring validation. |
| `/api/save` | `POST` | Stores completed verdict case files in persistent local storage vault. |
| `/api/analytics/track` | `POST` | Privacy-first event ingestion tracking searches, clicks, and conversions (zero PII). |
| `/api/b2b/evaluate` | `POST` | B2B Decision Intelligence API exposing deterministic scoring to enterprise partners. |
| `/api/health` | `GET` | Health check endpoint returning status, uptime, and memory usage. |

---

## 7. Tech Stack & Architecture

* **Frontend Framework:** Next.js 16.4.6 (App Router with Turbopack)
* **Runtime & Language:** Node.js 22 (LTS) & TypeScript 5 (Strict Mode)
* **Styling Engine:** Tailwind CSS v4 with custom case file CSS variable tokens
* **Motion & Animation:** Framer Motion (layout animations) & Lenis (smooth scroll)
* **Data Visualization:** Recharts (responsive multi-axis radar charts)
* **Calendar Sync:** `ics` RFC 5545 calendar file generator
* **Testing Framework:** Vitest v5.1.1 (DOM & Node.js environments)
* **Hosting Platform:** Render (Web Service Blueprint, Oregon Region)

---

## 8. Automated Verification & Test Suite

The test suite covers all domain classifications, math engines, SSRF security guards, and multilingual systems.

Run the automated test suite locally:
```bash
npm test
```

### Test Suite Results (37 Tests across 4 Suites — 100% Passing):
```
 ✓ src/lib/engine/index.test.ts (7 tests)
   ✓ calculates deterministic weights summing to 1.0
   ✓ correctly prunes products exceeding budget cap
   ✓ assigns Exhibit A, B, and C archetype badges
   ✓ simulates multi-year TCO trajectory
   ✓ computes regret risk matrix (likelihood x severity)

 ✓ src/lib/master-features.test.ts (15 tests)
   ✓ computes accurate effective prices (Listed + Shipping - Discounts)
   ✓ evaluates automotive on-road pricing and RTO structures
   ✓ creates, monitors, and evaluates purchase rules across 3 modes
   ✓ flags cosmetic dealer up-sells as REDUNDANT
   ✓ protects laptop buyers against redundant USB-C hubs
   ✓ resolves GS1 GTIN-13 barcodes to catalog records
   ✓ extracts chassis model numbers from OCR optical text
   ✓ covers all 22 Eighth Schedule Indian languages + Hinglish
   ✓ auto-detects Hindi, Tamil, Telugu, Bengali queries
   ✓ synthesizes localized verbal verdicts
   ✓ handles notification queue and mark-as-read state
   ✓ classifies education bootcamps and degree programs
   ✓ shifts criteria weights based on Buyer DNA profile
   ✓ flags unseasonal 50%+ discounts as high-risk anomalies
   ✓ strictly blocks private RFC1918 subnets, localhost, and metadata

 ✓ src/lib/llm.test.ts (5 tests)
   ✓ executes fallback guards when Ollama is offline
   ✓ strictly respects JSON schemas on structured extraction

 ✓ src/lib/domains.test.ts (10 tests)
   ✓ Scenario 1: 'I need a car, my budget is 19 lakhs.'
   ✓ Scenario 2: 'I need a laptop under ₹75,000 for software development.'
   ✓ Scenario 3: 'Find a flat in Bangalore within ₹90 lakhs.'
   ✓ Scenario 4: 'I want a DSLR for wildlife photography.'
   ✓ Scenario 5: 'I need a washing machine for a family of five.'
   ✓ Scenario 6: 'Find running shoes for marathon training.'
   ✓ Scenario 7: 'I need a tractor for a 5-acre farm.'
   ✓ Scenario 8: 'Find a hotel in Goa for a family holiday.'
   ✓ Scenario 9: 'I want a commercial refrigerator for my restaurant.'
   ✓ Scenario 10: 'I need an espresso coffee machine, budget 25000'

Test Files  4 passed (4)
Tests       39 passed (39)
```

---

## 9. Local Development & Setup Guide

### Prerequisites
* Node.js $\ge 22.0.0$ (Verify with `node -v`)
* npm $\ge 10.0.0$

### 1. Clone the Repository
```bash
git clone https://github.com/aryanTmall/Verdict.git
cd Verdict
```

### 2. Install Dependencies
```bash
# Uses .npmrc legacy-peer-deps configuration
npm install --legacy-peer-deps
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```
Compiles all 23 static and dynamic routes cleanly with Turbopack.

### 5. Start Production Server
```bash
npm start
```

---

## 10. Production Deployment Guide (Render)

The application is deployed on Render using Infrastructure as Code via `render.yaml`.

### `render.yaml` Configuration:
```yaml
services:
  - type: web
    name: verdict
    runtime: node
    plan: free
    region: oregon
    buildCommand: npm install --legacy-peer-deps && npm run build
    startCommand: npx next start -H 0.0.0.0 -p $PORT
    envVars:
      - key: NODE_VERSION
        value: 22.14.0
      - key: NODE_OPTIONS
        value: --max-old-space-size=460
```

### How to Trigger Deployments on Render:
1. Push code to the `main` branch on GitHub:
   ```bash
   git push origin main
   ```
2. Open your [Render Dashboard](https://dashboard.render.com/).
3. Navigate to the **Verdict** service $\rightarrow$ click **Manual Deploy** $\rightarrow$ select **Clear build cache & deploy**.
4. The service will build and run live at:  
   👉 **[https://verdict-u9pt.onrender.com/](https://verdict-u9pt.onrender.com/)**

---

## License

This project is open-source under the MIT License.  
Developed with pride for the **IST Hackathon — Reimagining Shopping with AI**.
