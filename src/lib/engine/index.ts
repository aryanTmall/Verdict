// VERDICT decision engine. Pure TypeScript, no I/O, no LLM calls.
// Runs in the browser (instant what-if sliders) and on the server (saved verdicts).

export type StoredCriterion = "performance" | "battery" | "portability" | "reliability";
export type Criterion = StoredCriterion | "longevity" | "value";
export const CRITERIA: Criterion[] = ["performance", "battery", "portability", "reliability", "longevity", "value"];
export type Weights = Record<Criterion, number>;

export type Provenance = "verified" | "source_claim" | "user_input" | "ai_inference" | "assumption" | "unknown";

export type ObservedIssue = {
  title: string;
  share: number; // 0..1 share of reviews mentioning it
  medianMonths: number | null; // typical months of use when it appears
  severity: 1 | 2 | 3 | 4 | 5;
  reviewCount: number;
};

export type Product = {
  slug: string;
  name: string;
  brand: string;
  priceInr: number;
  priceAsOf: string; // ISO date the price was recorded
  sourceUrl: string;
  specs: { ramGb: number; ramUpgradable: boolean; storageGb: number; weightKg: number; warrantyYears: number };
  scores: Record<StoredCriterion, number>; // 0..100, derived offline from specs + review evidence
  evidenceConfidence: number; // 0..1
  provenance: Record<string, Provenance>;
  observed: ObservedIssue[];
  industry?: string;
  category?: string;
  subcategory?: string;
  specsSummary?: string;
  destinationUrl?: string;
  destinationLabel?: string;
  primaryImageUrl?: string;
  galleryImageUrls?: string[];
  domainSpecs?: Record<string, any>;
  ownership?: any;
  bestFor?: string;
  compromise?: string;
  listingClaims?: string[];
  salePrediction?: any;
};

export type WorkloadId = "ide" | "browser" | "android_studio" | "docker" | "gaming" | "office";
export type Concurrency = "light" | "moderate" | "heavy";

export type Profile = {
  budgetInr: number;
  years: number;
  workloads: WorkloadId[];
  concurrency: Concurrency;
  weights: Weights;
  minRamGb?: number;
  maxWeightKg?: number;
};

// Every number here is an editable ASSUMPTION and is shown to the user as one.
export const ASSUMPTIONS = {
  workloadRamGb: { ide: 2, browser: 3, android_studio: 6, docker: 4, gaming: 6, office: 1.5 } as Record<WorkloadId, number>,
  concurrencyFactor: { light: 0.4, moderate: 0.6, heavy: 0.8 } as Record<Concurrency, number>,
  osOverheadGb: 3,
  demandGrowthPerYear: 0.1,
  ramUpgradeCostInr: 3500,
  uncoveredYearRepairReservePct: 0.02,
};

const clamp = (x: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, x));
export const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export function demandGb(prof: Profile, atYears: number): number {
  const a = ASSUMPTIONS;
  const concurrent =
    prof.workloads.filter((w) => w !== "gaming").reduce((s, w) => s + a.workloadRamGb[w], 0) *
    a.concurrencyFactor[prof.concurrency];
  const gaming = prof.workloads.includes("gaming") ? a.workloadRamGb.gaming : 0;
  return (Math.max(concurrent, gaming) + a.osOverheadGb) * Math.pow(1 + a.demandGrowthPerYear, atYears);
}
export const headroom = (p: Product, prof: Profile, t: number) => {
  const ram = p.specs?.ramGb ?? 16;
  const dem = demandGb(prof, t);
  return dem > 0 ? ram / dem : 1.5;
};

export type ForecastPoint = {
  label: string;
  years: number;
  headroom: number;
  status: "comfortable" | "tight" | "bottleneck";
  regretLikelihood: number;
};
const POINTS: [string, number][] = [["Day 1", 0], ["Month 6", 0.5], ["Year 1", 1], ["Year 2", 2], ["Year 3", 3], ["Year 4", 4]];

export function forecast(p: Product, prof: Profile): ForecastPoint[] {
  // If product has domain ownership stations, convert them to ForecastPoints
  if (p.ownership && p.ownership.stations && p.ownership.stations.length > 0) {
    return p.ownership.stations.map((st: any) => ({
      label: st.station,
      years: st.month / 12,
      headroom: st.status === "comfortable" ? 1.8 : st.status === "tight" ? 1.1 : 0.8,
      status: st.status,
      regretLikelihood: st.status === "bottleneck" ? 0.7 : st.status === "tight" ? 0.35 : 0.05,
    }));
  }

  const pts = POINTS.filter(([, y]) => y <= prof.years);
  if (!pts.some(([, y]) => y === prof.years)) pts.push([`Year ${prof.years}`, prof.years]);
  return pts.map(([label, years]) => {
    const h = headroom(p, prof, years);
    const validH = isNaN(h) || !isFinite(h) ? 1.5 : h;
    return {
      label,
      years,
      headroom: validH,
      status: validH >= 1.3 ? "comfortable" : validH >= 1.0 ? "tight" : "bottleneck",
      regretLikelihood: clamp((1.3 - validH) / 0.5),
    };
  });
}

export type Risk = {
  id: string;
  title: string;
  trigger: string;
  evidence: string;
  provenance: Provenance;
  likelihood: number; // 0..1
  impact: 1 | 2 | 3 | 4 | 5;
  score: number; // likelihood x impact / 5
  mitigation: string;
};
const mkRisk = (r: Omit<Risk, "score">): Risk => ({ ...r, score: (r.likelihood * r.impact) / 5 });

export function risks(p: Product, prof: Profile): Risk[] {
  const out: Risk[] = [];
  const isComputing = !p.industry || p.industry === "electronics" || p.category === "laptop";

  if (isComputing && p.specs && p.specs.ramGb) {
    const fc = forecast(p, prof);
    const end = fc[fc.length - 1];

    if (end && end.regretLikelihood >= 0.05) {
      out.push(mkRisk({
        id: "ram-headroom",
        title: "Memory headroom runs out",
        trigger: `Running ${prof.workloads.join(", ")} together`,
        evidence: `${p.specs.ramGb} GB RAM vs ~${demandGb(prof, end.years).toFixed(1)} GB estimated demand by ${end.label} (assumption-based)`,
        provenance: "assumption",
        likelihood: end.regretLikelihood,
        impact: p.specs.ramUpgradable ? 3 : 5,
        mitigation: p.specs.ramUpgradable
          ? `RAM is upgradable (about ${inr(ASSUMPTIONS.ramUpgradeCostInr)} assumed)`
          : "RAM is not upgradable: only fixable by buying more memory now",
      }));
    }
  }

  const warrantyYrs = p.specs?.warrantyYears ?? (p.domainSpecs?.warrantyYears as number) ?? 2;
  const gap = prof.years - warrantyYrs;
  if (gap > 0) {
    out.push(mkRisk({
      id: "warranty-gap",
      title: "Warranty ends before your ownership period",
      trigger: `You plan to keep it ${prof.years} years`,
      evidence: `${warrantyYrs}-year warranty`,
      provenance: p.provenance?.["warrantyYears"] ?? "source_claim",
      likelihood: clamp(gap / prof.years) * 0.6,
      impact: 2,
      mitigation: "Consider an extended warranty or budget a repair reserve",
    }));
  }

  for (const o of p.observed || []) {
    if (o.medianMonths !== null && o.medianMonths > prof.years * 12) continue;
    out.push(mkRisk({
      id: `observed-${o.title.toLowerCase().replace(/\W+/g, "-")}`,
      title: o.title,
      trigger: o.medianMonths ? `Typically reported around month ${o.medianMonths}` : "Reported by owners",
      evidence: `${Math.round(o.share * 100)}% of ${o.reviewCount} reviews mention this`,
      provenance: "source_claim",
      likelihood: clamp(o.share),
      impact: o.severity,
      mitigation: "Check recent reviews and the seller's service record before buying",
    }));
  }
  return out.sort((a, b) => b.score - a.score);
}

export type CostLine = { label: string; inr: number; provenance: Provenance };
export function tco(p: Product, prof: Profile): { lines: CostLine[]; totalInr: number } {
  // If product has domain ownership tcoBreakdown, use it directly
  if (p.ownership && p.ownership.tcoBreakdown && p.ownership.tcoBreakdown.length > 0) {
    const lines: CostLine[] = p.ownership.tcoBreakdown.map((item: any) => ({
      label: item.label,
      inr: item.inr,
      provenance: item.provenance === "verified" || item.provenance === "statutory_tax" ? "verified" : "assumption",
    }));
    return { lines, totalInr: lines.reduce((s: number, l: CostLine) => s + l.inr, 0) };
  }

  const lines: CostLine[] = [{ label: "Purchase price", inr: p.priceInr, provenance: p.provenance?.["priceInr"] ?? "source_claim" }];
  const warrantyYrs = p.specs?.warrantyYears ?? 2;
  const uncovered = Math.max(0, prof.years - warrantyYrs);
  if (uncovered > 0) {
    lines.push({
      label: `Repair reserve, ${uncovered} uncovered year(s)`,
      inr: p.priceInr * ASSUMPTIONS.uncoveredYearRepairReservePct * uncovered,
      provenance: "assumption",
    });
  }
  const end = forecast(p, prof).slice(-1)[0];
  if (p.specs?.ramUpgradable && end && end.headroom < 1.3) {
    lines.push({ label: "RAM upgrade", inr: ASSUMPTIONS.ramUpgradeCostInr, provenance: "assumption" });
  }
  return { lines, totalInr: lines.reduce((s, l) => s + l.inr, 0) };
}

export type Violation = { id: "budget" | "min-ram" | "max-weight" | "day1-bottleneck"; message: string };
export function violations(p: Product, prof: Profile): Violation[] {
  const v: Violation[] = [];
  const isComputing = !p.industry || p.industry === "electronics" || p.category === "laptop";

  if (p.priceInr > prof.budgetInr) v.push({ id: "budget", message: `${inr(p.priceInr - prof.budgetInr)} over budget` });
  if (isComputing && p.specs) {
    if (prof.minRamGb && p.specs.ramGb < prof.minRamGb) v.push({ id: "min-ram", message: `Needs at least ${prof.minRamGb} GB RAM` });
    if (prof.maxWeightKg && p.specs.weightKg > prof.maxWeightKg) v.push({ id: "max-weight", message: `Heavier than ${prof.maxWeightKg} kg` });
    if (headroom(p, prof, 0) < 1) v.push({ id: "day1-bottleneck", message: "Cannot comfortably run your workloads on Day 1" });
  }
  return v;
}

function normalise(w: Weights): Weights {
  const sum = CRITERIA.reduce((s, c) => s + Math.max(0, w[c]), 0);
  const out = {} as Weights;
  for (const c of CRITERIA) out[c] = sum === 0 ? 1 / CRITERIA.length : Math.max(0, w[c]) / sum;
  return out;
}

export type Evaluation = {
  product: Product;
  eligible: boolean;
  violations: Violation[];
  fit: number; // 0..100
  breakdown: Record<Criterion, { score: number; weight: number; contribution: number }>;
  risks: Risk[];
  maxRisk: number;
  forecast: ForecastPoint[];
  tco: { lines: CostLine[]; totalInr: number };
};

export function evaluateOne(p: Product, prof: Profile): Evaluation {
  const w = normalise(prof.weights);
  const fc = forecast(p, prof);
  const hEnd = fc && fc.length > 0 ? fc[fc.length - 1].headroom : 1.5;
  const scores: Record<Criterion, number> = {
    performance: p.scores?.performance ?? 80,
    battery: p.scores?.battery ?? (p.scores as any)?.efficiency ?? (p.scores as any)?.comfort ?? 75,
    portability: p.scores?.portability ?? (p.scores as any)?.comfort ?? 75,
    reliability: p.scores?.reliability ?? 85,
    longevity: clamp((hEnd - 0.7) / 0.8, 0, 1) * 100,
    value: clamp(((prof.budgetInr - p.priceInr) / prof.budgetInr) * 2.5, 0, 1) * 100,
  };

  // Ensure every criterion is a guaranteed finite number
  for (const c of CRITERIA) {
    if (scores[c] === undefined || isNaN(scores[c]) || !isFinite(scores[c])) {
      scores[c] = 75;
    }
  }

  const breakdown = {} as Evaluation["breakdown"];
  let fit = 0;
  for (const c of CRITERIA) {
    const contribution = w[c] * scores[c];
    const safeContrib = isNaN(contribution) || !isFinite(contribution) ? 0 : contribution;
    breakdown[c] = { score: scores[c], weight: w[c], contribution: safeContrib };
    fit += safeContrib;
  }
  const safeFit = isNaN(fit) || !isFinite(fit) ? 75 : Math.max(0, Math.min(100, fit));
  const rs = risks(p, prof);
  const viol = violations(p, prof);
  return {
    product: p, eligible: viol.length === 0, violations: viol, fit: safeFit, breakdown,
    risks: rs, maxRisk: rs.reduce((m, r) => Math.max(m, r.score), 0), forecast: fc, tco: tco(p, prof),
  };
}

export function evaluate(products: Product[], prof: Profile): Evaluation[] {
  return products.map((p) => evaluateOne(p, prof)).sort((a, b) =>
    a.eligible !== b.eligible ? (a.eligible ? -1 : 1) : b.fit - a.fit);
}

// repair / rent / refurbished are only emitted when real data exists (P2), never faked.
export type Verdict = {
  kind: "buy" | "wait" | "avoid" | "alternative";
  productSlug: string | null;
  caution: boolean;
  reason: string;
  confidence: number;
};

export function decide(evals: Evaluation[], prof: Profile): Verdict {
  const eligible = evals.filter((e) => e.eligible);
  if (eligible.length === 0) {
    const near = evals
      .filter((e) => e.violations.every((v) => v.id === "budget") && e.product.priceInr <= prof.budgetInr * 1.2)
      .sort((a, b) => a.product.priceInr - b.product.priceInr)[0];
    if (near) {
      return {
        kind: "wait", productSlug: near.product.slug, caution: false,
        reason: `Nothing meets your requirements at ${inr(prof.budgetInr)}. Closest: ${near.product.name} at ${inr(near.product.priceInr)} (${inr(near.product.priceInr - prof.budgetInr)} more). Raise the budget or wait for a price drop.`,
        confidence: near.product.evidenceConfidence,
      };
    }
    return { kind: "avoid", productSlug: null, caution: false, reason: "No product in the catalog meets your hard requirements.", confidence: 0.5 };
  }
  const top = eligible[0];
  const safer = eligible.slice(1).find((e) => e.maxRisk < top.maxRisk - 0.15 && e.fit >= top.fit - 10);
  if (safer) {
    return {
      kind: "alternative", productSlug: safer.product.slug, caution: false,
      reason: `${top.product.name} fits slightly better, but ${safer.product.name} carries much lower regret risk (${Math.round(safer.maxRisk * 100)}% vs ${Math.round(top.maxRisk * 100)}%).`,
      confidence: safer.product.evidenceConfidence,
    };
  }
  const caution = top.maxRisk >= 0.5;
  return {
    kind: "buy", productSlug: top.product.slug, caution,
    reason: caution
      ? `${top.product.name} is your best fit, but note: ${top.risks[0]?.title.toLowerCase()}.`
      : `${top.product.name} is your best fit with no major regret risks found.`,
    confidence: top.product.evidenceConfidence,
  };
}

export function whatIf(products: Product[], prof: Profile, patch: Partial<Profile>) {
  const after = { ...prof, ...patch, weights: { ...prof.weights, ...(patch.weights ?? {}) } };
  const b = evaluate(products, prof), a = evaluate(products, after);
  const bv = decide(b, prof), av = decide(a, after);
  return {
    before: { evals: b, verdict: bv }, after: { evals: a, verdict: av },
    changed: {
      verdict: bv.kind !== av.kind || bv.productSlug !== av.productSlug,
      topPick: b[0]?.product.slug !== a[0]?.product.slug,
    },
  };
}
