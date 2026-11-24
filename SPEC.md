# VERDICT — Universal Purchase Intelligence Architecture & Domain Specification

> **"See beyond the buy."**  
> An industrial-grade, buyer-aligned purchasing decision engine that cross-examines marketing claims, forecasts multi-year ownership consequences, and evaluates products and services across every industry with zero vibe math.

---

## 1. Executive Architectural Overview

Traditional e-commerce algorithms and conversational shopping agents are optimized for **the seller**: they summarize promotional marketing copy, optimize for conversion rates, and recommend products based on generic keyword matching.

**VERDICT** is architected strictly from the **buyer's perspective** as a legal cross-examination dossier. It replaces subjective prose with:
1. **Universal Category Classification:** Automatic extraction of industry, category, market, budget, constraints, and risk factors from conversational natural language.
2. **Domain-Specific Intelligence Packs:** Custom evaluation models, specialized milestone stations, running-cost calculators, and ownership metrics tailored per industry.
3. **Deterministic Engine Purity:** 100% of scoring, constraint filtering, TCO forecasting, and risk analysis is executed by a pure TypeScript engine (`src/lib/engine/index.ts`) with zero LLM hallucination.
4. **Verified Real Imagery & Direct Destination Links:** Authentic CDN product photography paired with verified manufacturer model listings and verified portals.
5. **Dynamic Ownership Strips:** Adapts the lifecycle visualization to the exact physics of the industry (fuel/service burn for cars, RERA/maintenance for real estate, energy/water for appliances, midsole degradation for sports shoes).

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

### Domain Summary Table

| Domain ID | Name | Primary Metrics | Key Hard Constraints | Real Catalog Specimens |
| :--- | :--- | :--- | :--- | :--- |
| `automotive` | Automotive | ARAI vs Real City Mileage, ADAS L2, NCAP Stars, 5-Yr Service | Fuel Type, Seating Capacity, Transmission, Ground Clearance | Hyundai Creta SX(O) Turbo, Mahindra XUV700 AX5, Tata Harrier Smart |
| `real_estate` | Real Estate | Price/sq.ft, Carpet Area Ratio, RERA Compliance, Maintenance | Location Radius, OC Status, Bedroom Count | Prestige Lakeside Habitat, Sobha Dream Acres, Godrej Splendour |
| `electronics` | Electronics & Computing | RAM Headroom, Burst Watts, CIPA Shot Rating, Shutter Lifespan | Memory Capacity, Battery Life, Sensor Format | Sony Alpha A7 IV, Canon EOS R6 Mark II, Acer Swift Go 14 OLED |
| `appliances` | Home & Appliances | BEE Energy Stars, Noise dB, Annual Water/Power Burn | Installation Dimensions, Capacity (kg/L), Door Type | Bosch 9kg 5-Star Series 6, LG 8kg AI Direct Drive, Celfrost 1000L Chiller |
| `sports` | Sports & Fitness | Cost per km, Midsole Resilience, Grip Lug Depth, Stack Height | Foot Strike Type, Waterproofing, Total Weight | Nike Pegasus 41 ReactX, Asics Gel-Kayano 31 4D Guidance |
| `agriculture` | Agriculture | PTO HP, Diesel L/Hour, Hydraulic Lift kg, Service Radius | Implement Compatibility, Soil Type, Farm Acreage | Mahindra OJA 2127 4WD, John Deere 3028EN 4WD |
| `travel` | Travel & Experiences | Proximity to Attractions, Hidden Fee Index, Safety Rating | Direct Beach Access, Child Safety, Date Availability | Taj Exotica Resort & Spa Goa, Grand Hyatt Bambolim Bay |
| `fashion` | Fashion & Lifestyle | Cost per Wear (3-Yr), Movement Caliber, Water Resistance | Material Authenticity, Wrist Fit, Lug-to-Lug | Seiko 5 Sports SRPD55K1 Automatic, Tissot PRX Powermatic 80 |
| `health` | Health & Wellness | CADR m³/h, Filtration Micron (0.003μ), Decibel Level | Room Coverage sq.ft, Non-Medical Disclosures | Philips Series 3000i Air Purifier, Dyson Purifier Hot+Cool |
| `services` | Business & Services | Uptime SLA %, MTTR Hours, Static IP, Contention Ratio | Contract Lock-in, Bandwidth Symmetry | Airtel Business Dedicated Fiber 1 Gbps, Tata Tele Business |
| `universal` | Universal Fallback | Build Durability, Maintenance Cadence, Total Cost of Ownership | Core Budget, Intended Use Compatibility | Configurable specimens scaled to exact buyer requirements |

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

## 5. Verified Data Integrity & Outbound Links

To uphold the legal cross-examination standard:
- **No Broken Image Placeholders:** Products use verified, high-resolution CDN images from manufacturer CDNs and curated media repositories, backed by instant inline vector SVG blueprints if network traffic fails.
- **Accurate Outbound Links:** Every card features a verified direct destination link labeled with clear buyer intent:
  - `"View official model ↗"` for automotive OEM spec portals (e.g., Hyundai India, Tata Motors).
  - `"View exact listing ↗"` for real estate and appliances (e.g., 99acres RERA records, Amazon India, Tata CLiQ).
  - `"View verified portal ↗"` for enterprise services and agricultural equipment.

---

## 6. Deterministic Engine Testing & Verification

The system is validated by an automated test suite with 22 passing unit and integration tests across 3 suites:
- `src/lib/domains.test.ts`: Validates category classification, budget parsing, hard constraint filtering, ownership milestones, and TCO projections across all 10 domain packs.
- `src/lib/engine/engine.test.ts`: Asserts deterministic math invariance, headroom calculations, and score stability.
- `src/lib/llm.test.ts`: Verifies digit guards and claim receipt substring integrity.

All tests execute with **100% pass rate** via `npm test`.
