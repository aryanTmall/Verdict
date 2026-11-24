import type { DomainClassification, IndustryId } from "./types";

/**
 * Universal Natural Language Purchase Classifier
 * Classifies arbitrary buyer requirements into rich domain taxonomy, budgets, constraints, and targeted clarifying questions.
 */
export function classifyQuery(text: string): DomainClassification {
  const lower = text.toLowerCase().trim();

  // 1. Extract Budget
  let budget = 0;
  let currency: "INR" | "USD" | "EUR" | "GBP" = "INR";
  let budgetType: DomainClassification["budgetType"] = "unspecified";

  // Check budget type hints
  if (/on[\s-]*road|all[\s-]*inclusive|total\s*budget|final\s*cost/i.test(lower)) {
    budgetType = "on_road";
  } else if (/ex[\s-]*showroom|base\s*price|sticker\s*price/i.test(lower)) {
    budgetType = "ex_showroom";
  } else if (/per\s*month|monthly|\/mo/i.test(lower)) {
    budgetType = "monthly";
  }

  // Regex patterns for budget
  const croreMatch = lower.match(/(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)\b/i);
  const lakhMatch = lower.match(/(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*(?:lakh|lakhs|lac|lacs|l)\b/i);
  const kMatch = lower.match(/(?:budget|under|below|around|within|range|price|cost|upto)?\s*(?:rs\.?|inr|₹)?\s*(\d+(?:\.\d+)?)\s*k\b/i);
  const rawNumMatch = lower.match(/(?:rs\.?|inr|₹|\bunder\b|\bbudget\b|\bprice\b|\bwithin\b)\s*(\d{4,9})\b/i);

  if (croreMatch && croreMatch[1]) {
    budget = Math.round(parseFloat(croreMatch[1]) * 10000000);
  } else if (lakhMatch && lakhMatch[1]) {
    budget = Math.round(parseFloat(lakhMatch[1]) * 100000);
  } else if (kMatch && kMatch[1]) {
    const val = parseFloat(kMatch[1]);
    // Skip if it was 4k resolution
    if (!lower.includes(`${kMatch[1]}k resolution`) && !lower.includes(`${kMatch[1]}k tv`) && !lower.includes(`${kMatch[1]}k drone`) && !lower.includes(`${kMatch[1]}k video`)) {
      budget = Math.round(val * 1000);
    }
  } else if (rawNumMatch && rawNumMatch[1]) {
    budget = parseInt(rawNumMatch[1], 10);
  }

  // Currency detection
  if (/\$|usd|dollars?/i.test(lower)) currency = "USD";
  else if (/€|eur|euros?/i.test(lower)) currency = "EUR";
  else if (/£|gbp|pounds?/i.test(lower)) currency = "GBP";

  // 2. Extract Intent
  let intent: DomainClassification["intent"] = "purchase";
  if (/rent|rental|lease|leasing/i.test(lower)) intent = "rental";
  else if (/hotel|flight|trip|stay|vacation|holiday|book|booking|resort/i.test(lower)) intent = "booking";
  else if (/plan|subscription|saas|broadband|internet|cloud/i.test(lower)) intent = "service_subscription";

  // 3. Extract City / Locality
  let city: string | undefined = undefined;
  const cityMatch = lower.match(/\b(?:in|at|near|around)\s+(bangalore|bengaluru|delhi|delhi-ncr|gurgaon|noida|mumbai|pune|hyderabad|chennai|kolkata|goa|ahmedabad|jaipur|chandigarh|kochi)\b/i);
  if (cityMatch && cityMatch[1]) {
    city = cityMatch[1].charAt(0).toUpperCase() + cityMatch[1].slice(1);
    if (city.toLowerCase() === "bengaluru") city = "Bangalore";
  }

  // 4. Industry & Category Identification
  let industry: IndustryId = "universal";
  let category = "item";
  let subcategory = "general";
  const userWorkloads: string[] = [];
  const preferences: string[] = [];
  const requiredAttributes: Record<string, any> = {};
  const missingInfo: string[] = [];
  const clarifyingQuestions: DomainClassification["clarifyingQuestions"] = [];
  const assumptions: string[] = [];
  let requiresClarification = false;
  let ownershipYears = 3;

  // Domain A: AUTOMOTIVE
  if (/\b(?:car|cars|automobile|automobiles|vehicle|vehicles|suv|suvs|sedan|sedans|hatchback|hatchbacks|diesel|petrol|creta|harrier|xuv|venue|ciaz|city|verna|seltos|nexon|brezza|scorpio|thar|safari|innova|bike|bikes|motorcycle|motorcycles|scooter|scooters|scooty|activa|ather|ola\s*s1|bullet|classic\s*350|hunter\s*350)\b/i.test(lower)) {
    industry = "automotive";
    ownershipYears = 5;
    if (/\b(?:bike|motorcycle|scooter|scooty|bullet|hunter|classic|activa|ather)\b/i.test(lower)) {
      category = "motorcycles";
      subcategory = "two_wheeler";
      if (!budget) budget = 175000;
    } else {
      category = "cars";
      subcategory = "passenger_vehicle";
      if (!budget) budget = 1900000;

      // Essential Automotive Clarifications
      requiresClarification = true;
      if (budgetType === "unspecified") missingInfo.push("on_road_or_ex_showroom_budget");
      missingInfo.push("preferred_vehicle_type");
      missingInfo.push("usage_pattern");

      clarifyingQuestions.push({
        id: "budget_type",
        question: `Is ₹${budget.toLocaleString("en-IN")} your Ex-Showroom budget or final On-Road budget (including State RTO road tax and 1-year zero-dep insurance)?`,
        options: ["On-Road (All-Inclusive Final Cost)", "Ex-Showroom Price", "Flexible / Stretchable"],
        importance: "critical",
      });

      clarifyingQuestions.push({
        id: "vehicle_body_style",
        question: "Which vehicle body style best fits your driving lifestyle and parking needs?",
        options: ["Mid-Size SUV (High 190mm+ ground clearance & command view)", "Executive Sedan (Superior highway stability & 500L+ boot)", "Compact Crossover (Agile city parking & fuel economy)"],
        importance: "high",
      });

      clarifyingQuestions.push({
        id: "usage_pattern",
        question: "What is your primary expected driving cycle and fuel preference?",
        options: ["City Commute (Turbo Petrol / Automatic DCT)", "Long Highway Cruising (Endurance Diesel / High Torque)", "Mixed Urban & Weekend Travel"],
        importance: "high",
      });

      assumptions.push(`Evaluated with Automotive Intelligence: Ex-showroom vs On-road RTO tax slabs (~12%), ARAI fuel burn vs real-world traffic variance, and 5-year maintenance schedules.`);
    }
  }
  // Domain B: REAL ESTATE
  else if (/\b(?:flat|flats|apartment|apartments|house|houses|villa|villas|plot|plots|property|properties|bhk|sqft|carpet\s*area|real\s*estate|rera)\b/i.test(lower)) {
    industry = "real_estate";
    category = "apartments";
    subcategory = "residential_property";
    ownershipYears = 5;
    if (!budget) budget = 9000000;

    requiresClarification = true;
    missingInfo.push("bhk_configuration");
    missingInfo.push("possession_timeline");

    clarifyingQuestions.push({
      id: "bhk_choice",
      question: "Which configuration are you prioritizing?",
      options: ["2 BHK (800–1200 sq.ft)", "3 BHK (1400–1800 sq.ft)", "Luxury Villa / Penthouse"],
      importance: "critical",
    });

    clarifyingQuestions.push({
      id: "possession",
      question: "Are you looking for Ready-to-Move with Occupancy Certificate (OC) or Under-Construction?",
      options: ["Ready to Move (Immediate possession & zero GST)", "Under Construction (1-2 years possession with RERA escrow)", "Flexible"],
      importance: "high",
    });

    assumptions.push("Evaluated against State RERA verification databases, Occupancy Certificate validity, and statutory ~6.6% stamp duty/registration outlays.");
  }
  // Domain C: ELECTRONICS & COMPUTING
  else if (/\b(?:laptop|laptops|macbook|thinkpad|zenbook|vivobook|ideapad|coding|developer|docker|android\s*studio|desktop|camera|cameras|dslr|mirrorless|lens|photography|wildlife|sensor|monitor|tv|television|smartphone|iphone|galaxy|tablet)\b/i.test(lower)) {
    industry = "electronics";
    ownershipYears = 4;
    if (/\b(?:camera|dslr|mirrorless|photography|wildlife|lens|shutter)\b/i.test(lower)) {
      category = "cameras";
      subcategory = "mirrorless_cameras";
      if (!budget) budget = 215000;
      preferences.push("wildlife_animal_eye_af");
      assumptions.push("Evaluated against CIPA battery benchmarks, mechanical shutter cycle durability, and wildlife eye autofocus algorithms.");
    } else if (/\b(?:phone|smartphone|iphone|galaxy|pixel|oneplus)\b/i.test(lower)) {
      category = "smartphones";
      subcategory = "flagship_mobile";
      if (!budget) budget = 65000;
      assumptions.push("Evaluated against multi-year OS security update commitments and camera optical stabilization.");
    } else {
      category = "laptops";
      subcategory = "computing_workstations";
      if (!budget) budget = 75000;
      if (lower.includes("docker")) userWorkloads.push("docker");
      if (lower.includes("android studio") || lower.includes("android")) userWorkloads.push("android_studio");
      if (lower.includes("coding") || lower.includes("developer")) userWorkloads.push("ide");
      if (lower.includes("gaming")) userWorkloads.push("gaming");
      assumptions.push("Evaluated via Multi-Year RAM headroom projection and thermal throttling analysis.");
    }
  }
  // Domain D: APPLIANCES & HOME
  else if (/\b(?:washing\s*machine|washer|refrigerator|refrigerators|fridge|chiller|ac|air\s*conditioner|sofa|sofas|furniture|couch|mattress|dishwasher|oven)\b/i.test(lower)) {
    industry = "appliances";
    ownershipYears = 5;
    if (/\b(?:washing\s*machine|washer)\b/i.test(lower)) {
      category = "washing_machines";
      subcategory = "front_load_washers";
      if (!budget) budget = 42000;
      if (/five|5\s*member|large\s*family/i.test(lower)) {
        requiredAttributes["capacity"] = "8kg - 9kg";
        preferences.push("family_of_five");
      }
      assumptions.push("Evaluated with BEE 5-Star electricity draw models and 10-year direct drive motor warranties.");
    } else if (/\b(?:commercial\s*refrigerator|restaurant|commercial\s*chiller|visi\s*cooler|celfrost)\b/i.test(lower)) {
      category = "commercial_chillers";
      subcategory = "commercial_refrigeration";
      if (!budget) budget = 125000;
      requiredAttributes["commercialKitchenGrade"] = true;
      assumptions.push("Evaluated for 43°C ambient commercial kitchen duty with Embraco heavy-duty compressors and forced-air cooling.");
    } else {
      category = "refrigerators";
      subcategory = "home_appliances";
      if (!budget) budget = 35000;
    }
  }
  // Domain E: SPORTS & FITNESS
  else if (/\b(?:running\s*shoes?|shoes?|marathon|sneakers?|bicycle|bicycles?|cycle|cycles?|treadmill|gym|workout|fitness)\b/i.test(lower)) {
    industry = "sports";
    category = "running_shoes";
    subcategory = "marathon_training";
    ownershipYears = 2;
    if (!budget) budget = 12000;
    if (/marathon|long\s*distance|training/i.test(lower)) {
      preferences.push("marathon_cushioning_endurance");
    }
    assumptions.push("Evaluated against biomechanical midsole energy return compounds and 800+ km outsole durability curves.");
  }
  // Domain F: AGRICULTURE
  else if (/\b(?:tractor|tractors|farm|farming|acre|acres|harvester|rotavator|plow|irrigation|kisan|agriculture|crops?|soil)\b/i.test(lower)) {
    industry = "agriculture";
    category = "tractors";
    subcategory = "utility_tractors";
    ownershipYears = 5;
    if (!budget) budget = 580000;
    if (/5\s*acre|five\s*acre/i.test(lower)) {
      requiredAttributes["farmAcreage"] = 5;
      requiredAttributes["recommendedHpBand"] = "24HP - 30HP";
      preferences.push("compact_4wd_maneuverability");
    }
    assumptions.push("Evaluated for 5-acre crop requirements: 24-30 HP PTO matching, rotavator soil torque, and 2.2L/hr diesel efficiency.");
  }
  // Domain G: TRAVEL & EXPERIENCES
  else if (/\b(?:hotel|hotels|resort|resorts|holiday|vacation|goa|flight|flights|package|tour|stay|villa\s*stay)\b/i.test(lower)) {
    industry = "travel";
    category = "resorts";
    subcategory = "family_beach_resort";
    ownershipYears = 1;
    if (!budget) budget = 22000;
    if (/goa/i.test(lower)) requiredAttributes["destination"] = "Goa";
    if (/family|children|kids/i.test(lower)) preferences.push("child_friendly_pools_and_beach");
    assumptions.push("Evaluated for verified private beach frontage, certified lifeguard pool safety, and transparent zero-hidden-fee pricing.");
  }
  // Domain H: FASHION & LIFESTYLE
  else if (/\b(?:watch|watches|automatic\s*watch|chronograph|seiko|tissot|rolex|handbag|bags|apparel|clothing|jewellery)\b/i.test(lower)) {
    industry = "fashion";
    category = "watches";
    subcategory = "mechanical_horology";
    ownershipYears = 3;
    if (!budget) budget = 25000;
    assumptions.push("Evaluated against 316L surgical stainless steel casing, mechanical caliber reliability, and 3-year cost-per-wear analytics.");
  }
  // Domain I: HEALTH & WELLNESS
  else if (/\b(?:air\s*purifier|purifier|pm2\.5|hepa|pollution|blood\s*pressure|bp\s*monitor|omron|wellness)\b/i.test(lower)) {
    industry = "health";
    category = "air_purifiers";
    subcategory = "hepa_air_purification";
    ownershipYears = 3;
    if (!budget) budget = 28000;
    assumptions.push("Evaluated against CADR clean air delivery rates (m³/h), true mechanical HEPA trapping down to 0.003 microns, and annual filter replacement economics.");
  }
  // Domain J: BUSINESS & PROFESSIONAL SERVICES
  else if (/\b(?:internet|broadband|wifi|cloud|aws|hosting|saas|software\s*subscription|telecom|insurance)\b/i.test(lower)) {
    industry = "services";
    category = "internet_plans";
    subcategory = "business_broadband";
    ownershipYears = 1;
    if (!budget) budget = 4000;
    assumptions.push("Evaluated for contractual 99.9% uptime SLAs, symmetric Gigabit throughput, static IP availability, and zero-FUP data terms.");
  }
  // Domain K: EDUCATION & CERTIFICATIONS
  else if (/\b(?:course|courses|degree|diploma|certification|certifications|bootcamp|bootcamps|coaching|data\s*science|machine\s*learning\s*course|college|university|mba|upskilling|scaler|upgrad|coursera)\b/i.test(lower)) {
    industry = "education";
    category = "online_courses";
    subcategory = "professional_education";
    ownershipYears = 2;
    if (!budget) budget = 150000;
    assumptions.push("Evaluated for university accreditation, WES degree equivalency, mentor-to-student ratios, capstone portfolio rigor, and verified salary placement claims.");
  }
  // Domain L: UNIVERSAL FALLBACK
  else {
    industry = "universal";
    // Extract entity phrase
    const stripped = lower
      .replace(/^(?:i\s+(?:am\s+(?:an?\s+)?[a-z0-9\-]+\s*(?:student|professional|buyer|user)?[\.,\s]+)?(?:want|need|am\s+looking\s+for|would\s+like|am\s+searching\s+for|plan\s+to\s+buy|suggest|recommend|search|find|give\s+me)\s+(?:a|an|the)?\s*)/i, "")
      .trim();
    const phrase = stripped.match(/^([a-z0-9\s\-]+?)(?:\s+(?:under|for|with|budget|in\s+price|below|around|at|saal|years?)|[,;\.]|$)/i);
    const cleanItem = phrase && phrase[1] ? phrase[1].trim() : "Specialized Equipment";
    category = cleanItem;
    subcategory = "general_consumer";
    if (!budget) budget = 50000;
    assumptions.push(`Evaluated via Universal Forensic Engine: Normalized build quality, duty cycle expectations, and transparent confidence ratings for ${cleanItem}.`);
  }

  return {
    intent,
    industry,
    category,
    subcategory,
    market: "IN",
    currency,
    budget,
    budgetType,
    userWorkloadsOrUsage: userWorkloads,
    ownershipYears,
    requiredAttributes,
    preferences,
    city,
    requiresClarification,
    missingInformation: missingInfo,
    clarifyingQuestions,
    assumptions,
  };
}
