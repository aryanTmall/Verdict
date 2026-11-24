# VERDICT — "See beyond the buy."

> **A buyer-side AI cross-examination engine that tests seller marketing claims against real owner evidence, forecasts multi-year ownership headroom, and executes instant in-browser what-if recomputation across every major purchasing domain.**

Built for the **IST Hackathon** ("Reimagining Shopping with AI") — Upgraded to **Universal Purchase Intelligence Engine**.

Live URL: [https://verdict-u9pt.onrender.com/](https://verdict-u9pt.onrender.com/)  
Architecture Specification: [SPEC.md](SPEC.md)

---

## 1. Product Overview

Traditional AI shopping assistants are retailer-aligned: they summarize glowing marketing copy, push affiliate links, and recommend whatever fits the keyword query. 

**VERDICT** is strictly buyer-aligned. It acts as an aggressive defense attorney cross-examining a purchase before you pay:
1. **Universal Industry Intelligence:** Automatically understands any purchase query across 10 core industries (Automotive, Real Estate, Electronics, Appliances, Sports, Agriculture, Travel, Fashion, Health, Services) + an adaptive Universal Fallback.
2. **Deterministic, zero-vibe math:** All scoring, constraint filtering, ownership trajectories, regret risk scoring, and TCO calculations come from a pure TypeScript engine (`src/lib/engine/index.ts`). The LLM only interprets and narrates.
3. **Audits marketing claims:** Every listing claim is tested against real owner review evidence, stamping each claim `SUPPORTED`, `CONTRADICTED`, or `CAN'T VERIFY`, backed by verbatim receipts under 25 words.
4. **The Ownership Strip:** Forecasts Day 1 through Year 4/5 lifecycle milestones (e.g. ARAI vs city fuel burn and brake pad wear for cars, RERA and RWA maintenance for real estate, midsole fatigue for running shoes, water/power burn for appliances) along with an active "Regret Clock".
5. **Instant What-If Recomputation:** Moving any budget or priority slider recomputes recommendations live in the browser with zero network lag and animates ranking shifts.
6. **Official Verdict Stamp & Receipt:** Slams a BUY / WAIT / AVOID / CHOOSE ALTERNATIVE stamp, prints a thermal audit receipt, generates a shareable web link, and exports an `.ics` calendar warranty reminder.

---

## 2. Universal Industry Architecture

```mermaid
flowchart TD
    User([Buyer Input: "I need a car, budget 19 lakhs"]) --> Intake[Intake Index Card]
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
    
    Shortlist --> ClaimsAPI[/api/claims]
    ClaimsAPI --> SubstringVerifier[Server-side Quote Substring Verifier]
    SubstringVerifier --> ClaimsLedger[Claims Ledger Panel]
    
    EngineCore --> WhatIf[Instant What-If Simulator Sliders]
    WhatIf -.->|Zero-latency In-Browser Loop| ClientEngine

    EngineCore --> NarrateAPI[/api/narrate]
    NarrateAPI --> DigitGuard[Strict Digit-Guard Validator]
    DigitGuard --> VerdictModal[Verdict Rubber Stamp Slam & Thermal Receipt]
    
    VerdictModal --> Vault[(Supabase / Local Vault)]
    VerdictModal --> CalendarICS[/api/ics Reminder Export]
    
    User <--> AskAPI[/api/ask: Evidence-Gated Q&A Drawer]
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

## 4. Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Language:** TypeScript (strict mode)
- **Styling & Tokens:** Tailwind CSS v4, custom "The Case File" design tokens (Paper `#F2EBD8`, Sheet `#FBF7EA`, Ink `#1B1A17`, Carbon Blue `#2540D9`, Stamp Vermilion `#D8381C`, Evidence Green `#1F6B4F`, Tape Yellow `#F3C94B`, Graphite `#8A8576`)
- **Typography:** Bricolage Grotesque (Display & UI) + IBM Plex Mono (Tabular numbers, receipts, provenance chips)
- **Motion & Smooth Scroll:** Framer Motion layout springs + Lenis smooth scrolling (with `prefers-reduced-motion` detection)
- **Data Visualizations:** Recharts Radar Chart (ink-styled)
- **LLM Engine:** Local Ollama (`llama3.1:latest`) or Anthropic SDK (`@anthropic-ai/sdk`), models `claude-sonnet-5-5` & `claude-haiku-5-5` with deterministic regex/NLP fallbacks
- **Persistence:** Supabase (`@supabase/supabase-js`) with automatic fallback to local JSON file store (`data/vault/`)
- **Calendar:** `ics` for warranty cutoff reminder export
- **Testing:** Vitest with 22 automated unit and integration tests across 3 suites

---

## 5. Run & Test Instructions

### Prerequisites
- Node.js >= 20
- npm >= 10

### Setup & Run
```bash
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Run test suite (All 22 unit & domain tests)
npm test

# 3. Build for production
npm run build

# 4. Start production server
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 6. End-to-End Benchmark Scenarios

### Benchmark A: ₹19 Lakh Automotive Cross-Examination
1. **Intake Statement:** `"I need a car, my budget is 19 lakhs."`
2. **Classification Output:** Industry `automotive`, category `cars`, budget `₹19,00,000`, market `IN`, currency `INR`.
3. **Clarifying Defense:** System presents interactive option chips: *`"Is ₹19,00,000 your maximum On-Road budget or Ex-Showroom price?"`*
4. **Shortlist Candidates:**
   - **Exhibit A (Top Pick):** `Hyundai Creta SX(O) 1.5 Turbo DCT` (₹18,70,000) — Level 2 ADAS, 158 bhp.
   - **Exhibit B:** `Mahindra XUV700 AX5 Petrol MT` (₹17,80,000) — 5-Star Global NCAP, 197 bhp.
   - **Exhibit C:** `Tata Harrier Smart MT` (₹15,49,000) — 5-Star Bharat NCAP, robust road presence.
5. **Ownership Strip:** Replaces RAM memory with ARAI 18.4 kmpl vs Real Traffic 10.5 kmpl burn, Day 1 RTO/Taxes, Month 6 first service, and Year 3 brake pad wear.
6. **Direct Link:** `"View official model ↗"` linking to verified manufacturer specification portals.

### Benchmark B: Bangalore Flat ₹90 Lakhs (Real Estate)
- Extracts `real_estate`, carpet area ratio, RERA registration numbers, 6.6% stamp duty/registration acquisition costs, and possession timelines.

### Benchmark C: Wildlife Photography DSLR (Electronics)
- Identifies Sony Alpha A7 IV (₹2.15L) and Canon EOS R6 Mark II (₹2.05L) with CIPA shot ratings and shutter lifecycle tracking.

---

## 7. Deployment Configuration (Render)

VERDICT is configured for automated builds on Render:
- **Build Command:** `npm install --legacy-peer-deps && npm run build`
- **Start Command:** `npx next start -H 0.0.0.0 -p $PORT`
- **Environment:** `NODE_VERSION=20.18.0`, `NODE_OPTIONS=--max-old-space-size=460`
- **Configuration File:** `render.yaml`
