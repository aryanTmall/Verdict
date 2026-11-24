# VERDICT — "See beyond the buy."

> **A buyer-side AI cross-examination engine that tests seller marketing claims against real owner evidence, forecasts 4-year ownership headroom, and executes instant in-browser what-if recomputation.**

Built for the **IST Hackathon** ("Reimagining Shopping with AI").

---

## 1. Product Overview

Traditional AI shopping assistants are retailer-aligned: they summarize glowing marketing copy, push affiliate links, and recommend whatever fits the keyword query. 

**VERDICT** is strictly buyer-aligned. It acts as an aggressive defense attorney cross-examining a purchase before you pay:
1. **Understands your life:** Extracts nuanced constraints from natural language (English, Hindi, or Hinglish), voice transcripts, retailer links, or product photos.
2. **Deterministic, zero-vibe math:** All scoring, constraint filtering, RAM headroom projections, regret risk scoring, and TCO calculations come from a pure TypeScript engine (`src/lib/engine/index.ts`). The LLM only interprets and narrates.
3. **Audits marketing claims:** Every listing claim is tested against real owner review evidence, stamping each claim `SUPPORTED`, `CONTRADICTED`, or `CAN'T VERIFY`, backed by verbatim receipts under 25 words.
4. **The Ownership Strip:** Forecasts Day 1 through Year 4 RAM headroom and maps observed failure modes (e.g. hinge stiffness at month 14, fan noise at month 6) along with a "Regret Clock".
5. **Instant What-If Recomputation:** Moving any budget or priority slider recomputes recommendations live in the browser with zero network lag and animates ranking shifts.
6. **Official Verdict Stamp & Receipt:** Slams a BUY / WAIT / AVOID / CHOOSE ALTERNATIVE stamp, prints a thermal audit receipt, generates a shareable web link, and exports an `.ics` calendar warranty reminder.

---

## 2. Architecture & Data Flow

```mermaid
flowchart TD
    User([Buyer Input: Voice / Text / Photo / Link]) --> Intake[Intake Index Card]
    Intake --> ParseAPI[/api/mission/parse]
    
    subgraph IntakeEngine [Intake & Extraction]
        ParseAPI --> SonnetExtract[Claude Sonnet 5.5 / Regex Fallback]
        SonnetExtract --> Profile[Normalized Profile & Weights]
    end

    Profile --> ClientEngine[In-Browser Deterministic Engine]
    Catalog[(Verified Catalog 30 Products)] --> ClientEngine
    
    subgraph EngineCore [Deterministic Core: src/lib/engine]
        ClientEngine --> ConstraintFilter[Hard Constraint Filtering]
        ClientEngine --> Scoring[Multi-Criteria Weight Normalization]
        ClientEngine --> HeadroomCalc[RAM Demand & Headroom Growth]
        ClientEngine --> RiskCalc[Risk Matrix Score = Likelihood x Impact]
        ClientEngine --> TCOCalc[4-Year TCO + Uncovered Warranty Reserve]
    end

    EngineCore --> Shortlist[Top 3 Exhibits A/B/C + Dismissed Strip]
    EngineCore --> OwnershipStrip[Ownership Strip Timeline: Day 1 - Year 4]
    
    Shortlist --> ClaimsAPI[/api/claims]
    Reviews[(Forensic Reviews)] --> ClaimsAPI
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

## 3. Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack, React 19)
- **Language:** TypeScript (strict mode)
- **Styling & Tokens:** Tailwind CSS v4, custom "The Case File" design tokens (Paper `#F2EBD8`, Sheet `#FBF7EA`, Ink `#1B1A17`, Carbon Blue `#2540D9`, Stamp Vermilion `#D8381C`, Evidence Green `#1F6B4F`, Tape Yellow `#F3C94B`, Graphite `#8A8576`)
- **Typography:** Bricolage Grotesque (Display & UI) + IBM Plex Mono (Tabular numbers, receipts, provenance chips)
- **Motion & Smooth Scroll:** Framer Motion layout springs + Lenis smooth scrolling (with `prefers-reduced-motion` detection)
- **Data Visualizations:** Recharts Radar Chart (ink-styled)
- **LLM Engine:** Anthropic SDK (`@anthropic-ai/sdk`), models `claude-sonnet-5-5` & `claude-haiku-5-5` with deterministic regex/NLP fallbacks
- **Persistence:** Supabase (`@supabase/supabase-js`) with automatic fallback to local JSON file store (`data/vault/`)
- **Calendar:** `ics` for warranty cutoff reminder export
- **Testing:** Vitest for deterministic engine guarantees, quote substring validation, and digit guard enforcement

---

## 4. Run Instructions

### Prerequisites
- Node.js >= 20
- npm >= 10

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Run test suite
npm run test

# 3. Run forensic review derivation script
npm run derive

# 4. Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

To run the design system showcase:
[http://localhost:3000/design](http://localhost:3000/design)

To run in demo mode with preset engineering student mission and cached fixtures:
[http://localhost:3000/?demo=1](http://localhost:3000/?demo=1)

### Environment Variables (`.env`)
Create a `.env` file in the root directory (see `.env.example`):
```env
# Local LLM (Ollama)
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.1:latest

# Cloud LLM (Optional fallback)
ANTHROPIC_API_KEY=

# Supabase (Optional - falls back to local file store in data/vault/ if omitted)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 5. Verified Data Sources & Assumptions

### Real Indian Laptop & Earbud Catalog (`data/catalog.json`)
The catalog contains 30 verified consumer electronics items available in India:
- **Laptops (24 models):** Lenovo IdeaPad Slim 5, Acer Swift Go 14 OLED, ASUS Vivobook 16, Apple MacBook Air M2 & M3, HP Victus 15, ASUS TUF Gaming F15, Lenovo LOQ 15, Dell Inspiron 3530, HP Pavilion Plus 14 OLED, Samsung Galaxy Book4, ASUS Zenbook 14 OLED, Acer Nitro V 15, Lenovo IdeaPad Slim 3, HP 15s, Dell G15, MSI Thin 15, Acer Aspire Lite 15, MacBook Pro 14 M3 Pro, Lenovo Yoga Slim 7x, ASUS ROG Zephyrus G14, Infinix ZEROBOOK, Xiaomi Notebook Pro 120G, Dell XPS 13 Plus.
- **Earbuds (6 models):** Sony WF-1000XM5, Apple AirPods Pro 2, OnePlus Buds Pro 2, Realme Buds Air 5 Pro, Nothing Ear (2024), boAt Airdopes 141.
- **Prices Recorded:** As of November 15–20, 2026 across Amazon.in, Flipkart, and official brand stores.

### Engine Assumptions Table
Every number in the engine is an editable assumption documented in code:
| Parameter | Default Value | Reasoning |
| :--- | :--- | :--- |
| `osOverheadGb` | 3.0 GB | Baseline Windows 11 / macOS memory reservation |
| `workloadRamGb.ide` | 2.0 GB | VS Code + language server processes |
| `workloadRamGb.browser` | 3.0 GB | 25-30 active Chromium tabs |
| `workloadRamGb.android_studio` | 6.0 GB | Android Studio + Gradle daemon + Android Virtual Device (AVD) |
| `workloadRamGb.docker` | 4.0 GB | Docker desktop VM engine + multiple containers |
| `workloadRamGb.gaming` | 6.0 GB | Dedicated allocation for 3D game client |
| `concurrencyFactor` | Light: 0.4 · Moderate: 0.6 · Heavy: 0.8 | Fractional overlap of concurrent non-gaming processes |
| `demandGrowthPerYear` | 10% (0.10) | Annual bloat of web apps, IDEs, and dependencies |
| `ramUpgradeCostInr` | ₹3,500 | Estimated cost for 16GB DDR4/DDR5 SO-DIMM expansion |
| `uncoveredYearRepairReservePct` | 2% per year | Reserve budgeted for years exceeding warranty |

---

## 6. What Actually Happens When Budget Changes: ₹75,000 → ₹85,000

In the preset engineering student mission (budget ₹75,000, 4-year horizon, Android Studio + Docker):
1. **At ₹75,000:**
   - **Exhibit A (Top Pick):** `Lenovo IdeaPad Slim 5 16"` (₹68,990) leads with an 88/100 fit score. It passes the 16GB minimum RAM constraint. However, memory headroom is tight by Year 3 (1.05x), and owner reviews contradict the 11.5-hour battery claim (real-world ~6 hours).
   - **Apple MacBook Air M2 8GB (₹84,990):** Is **DISMISSED** because it fails both the ₹75,000 budget constraint and the 16GB minimum RAM constraint (triggering a Day 1 virtualisation bottleneck).
2. **Dragging Budget Slider to ₹85,000:**
   - The engine instantly recomputes in the browser.
   - `Apple MacBook Air M2` now falls inside the budget limit, but remains **filtered out by the hard 16GB minimum constraint** (since Docker + Android Studio demand >11GB on Day 1).
   - `HP Pavilion Plus 14 OLED` (₹78,990) and `Infinix ZEROBOOK 32GB` (₹79,990) become top contenders. The Infinix ZEROBOOK eliminates the memory bottleneck entirely (headroom 2.8x by Year 4), causing memory regret risk to drop from **74% to 14%**.
   - A yellow diff tape chip immediately notifies the user: *"Pick changed: Infinix ZEROBOOK now fits your budget · memory risk fell from 74% to 14%"*.

---

## 7. Two-Minute Demo Script for Judges

- **0:00 - The Hook:** *"Every AI shopping tool today works for the seller: it summarizes marketing buzzwords and nudges you to check out. VERDICT is the first buyer-side cross-examiner. It sees beyond the buy."*
- **0:25 - The Intake:** Paste the engineering student mission: *"Need a laptop for coding, Android Studio, Docker, college travel, ₹75,000 budget for 4 years."* Watch the letter reel resolve and the honest agent log execute each verifiable step with zero theatre.
- **0:50 - The Claims Ledger:** Open the Claims Ledger for the top-ranked Lenovo IdeaPad Slim 5. Point to the seller's claim of *"Up to 11.5 hours battery life"*. Show the **CONTRADICTED** stamp with verbatim review receipts: *"Battery backup dropped to around 6 hours during my coding and browser sessions"* (Month 4).
- **1:15 - The Ownership Strip:** Walk along the horizontal timeline from Day 1 to Year 4. Watch the RAM ink gauge drain as demand grows. Point to the yellow tape flag at Month 14: *"Hinge stiffness and creaking"* reported across 16.7% of owners.
- **1:40 - The Live What-If Moment:** Drag the budget slider from ₹75,000 to ₹85,000. Watch the shortlist reorder instantly with zero network delay. The 32GB machine enters budget, and memory regret drops from 74% to 14%.
- **2:00 - The Verdict Stamp:** Hit *"Get Official Verdict"*. Hear the synthesized stamp thud as **BUY WITH CAUTION** slams onto the dossier, step-prints the thermal receipt, and exports a warranty calendar reminder. *"VERDICT gives you purchasing confidence because it never vibes—it shows its receipts."*

---

## 8. Final Report: What Works, What is Cached, Known Limitations

### What Works End-to-End
- Full responsive interface (380px mobile to 1920px desktop) with "The Case File" design system.
- Complete deterministic engine running in TypeScript with 100% test pass rate.
- Honest agent log displaying actual execution steps.
- Server-side quote substring verification (<25 words) against raw reviews.
- Strict digit-guard in narration preventing hallucinated numbers.
- Live in-browser what-if simulation with Framer Motion spring layout animations and NumberReels.
- Voice intake and persistent contextual Q&A drawer with cited exhibit chips.
- Shareable receipt URLs (`/r/[slug]`) and downloadable `.ics` warranty calendar reminders.
- Standalone `/design` route documenting all tokens, contrast ratios, and components.

### What is Cached / Fixtured
- `?demo=1` uses verified cached responses in `data/fixtures/demo-mission.json` so the entire experience works seamlessly offline and during live hackathon demos when API keys are absent.
- Claims checks are cached on disk in `data/cache/` to minimize external LLM latency.

### Known Limitations
- Live camera photo identification requires an active `ANTHROPIC_API_KEY` for Claude Sonnet 5.5 vision; when absent, it gracefully falls back to identifying the top catalog match from file metadata.
- P2 features (price watch tracking, refurbished/rental marketplace parity) are intentionally left for future expansion as specified in the non-negotiable principles.
