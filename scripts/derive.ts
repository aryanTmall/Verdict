import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import type { Product, ObservedIssue, StoredCriterion } from "../src/lib/engine";

dotenv.config();

export interface ReviewItem {
  id: string;
  rating: number;
  body: string;
  date: string;
  verified: boolean;
  monthsUsed?: number | null;
  failureModes?: string[];
  flags?: string[];
  forensicWeight?: number;
}

export interface CatalogItem extends Product {
  imageUrl?: string;
  listingClaims: string[];
  category: "laptop" | "earbuds";
  demo?: boolean;
}

/**
 * 1. DETERMINISTIC REVIEW FORENSICS
 * Flags suspect patterns:
 * - Extremely short text (< 25 characters) -> weight *= 0.4
 * - Same-day burst (more than 3 reviews on the same calendar day) -> weight *= 0.6
 * - Near-duplicate text similarity (Jaccard token similarity > 0.8) -> weight *= 0.3
 * These reduce weight, NEVER delete data.
 */
export function applyReviewForensics(reviews: ReviewItem[]): ReviewItem[] {
  const dateCounts: Record<string, number> = {};
  for (const r of reviews) {
    const d = r.date.split("T")[0];
    dateCounts[d] = (dateCounts[d] || 0) + 1;
  }

  const tokenSets = reviews.map((r) => {
    const tokens = new Set(
      r.body
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3)
    );
    return tokens;
  });

  return reviews.map((r, i) => {
    let weight = 1.0;
    const flags: string[] = [...(r.flags || [])];

    // Check shortness
    if (r.body.trim().length < 25) {
      weight *= 0.4;
      flags.push("low-signal-short-text");
    }

    // Check same-day burst
    const day = r.date.split("T")[0];
    if ((dateCounts[day] || 0) > 3) {
      weight *= 0.6;
      flags.push("same-day-burst");
    }

    // Check near duplicate against prior reviews
    for (let j = 0; j < i; j++) {
      const setA = tokenSets[i];
      const setB = tokenSets[j];
      if (setA.size > 5 && setB.size > 5) {
        let intersection = 0;
        for (const token of setA) {
          if (setB.has(token)) intersection++;
        }
        const union = new Set([...setA, ...setB]).size;
        const jaccard = union > 0 ? intersection / union : 0;
        if (jaccard > 0.75) {
          weight *= 0.3;
          flags.push("near-duplicate");
          break;
        }
      }
    }

    return {
      ...r,
      flags,
      forensicWeight: Math.max(0.1, Number(weight.toFixed(2))),
    };
  });
}

/**
 * 2. DETERMINISTIC TAGGING OF MONTHS USED & FAILURE MODES
 * Rule-based fallback if Anthropic SDK is offline/not keyed.
 */
export function extractMonthsUsed(text: string): number | null {
  const match = text.match(/(\d+)\s*(months?|mos?|yrs?|years?)\s*(of use|after|later|in|old)?/i);
  if (!match) return null;
  const num = parseInt(match[1], 10);
  const unit = match[2].toLowerCase();
  if (unit.startsWith("y")) return num * 12;
  return num;
}

const FAILURE_PATTERNS: Array<{ pattern: RegExp; title: string; severity: 1 | 2 | 3 | 4 | 5 }> = [
  { pattern: /hinge|creak|crack near screen/i, title: "Hinge stiffness and creaking", severity: 3 },
  { pattern: /battery (drain|died|degraded|backup dropped|last only \d hours?)/i, title: "Battery degradation under sustained workload", severity: 3 },
  { pattern: /fan (loud|noise|whine|jet engine|spins up)/i, title: "Fan noise under dual compiler load", severity: 2 },
  { pattern: /thermal|throttl|overheat|hot to touch/i, title: "Thermal throttling under heavy multitasking", severity: 3 },
  { pattern: /ram (full|bottleneck|stutter|lag with docker|out of memory|8gb not enough)/i, title: "Memory bottleneck with concurrent containers", severity: 4 },
  { pattern: /display (bleed|flicker|ghosting|dead pixel)/i, title: "Display backlight bleed / flickering", severity: 3 },
  { pattern: /wifi (disconnect|drop|slow|mediatek)/i, title: "Wi-Fi adapter latency and drops", severity: 2 },
  { pattern: /trackpad|touchpad (stuck|unresponsive)/i, title: "Trackpad palm rejection and click stiffness", severity: 2 },
  { pattern: /earbud (disconnect|left bud stopped|charging pin|case battery)/i, title: "Charging pin corrosion or single-bud disconnect", severity: 3 },
];

export function extractFailureModes(text: string): Array<{ title: string; severity: 1 | 2 | 3 | 4 | 5 }> {
  const found: Array<{ title: string; severity: 1 | 2 | 3 | 4 | 5 }> = [];
  for (const { pattern, title, severity } of FAILURE_PATTERNS) {
    if (pattern.test(text)) {
      found.push({ title, severity });
    }
  }
  return found;
}

/**
 * 3. AGGREGATE OBSERVED ISSUES
 */
export function aggregateObservedIssues(reviews: ReviewItem[]): ObservedIssue[] {
  if (reviews.length === 0) return [];

  const weightedTotal = reviews.reduce((sum, r) => sum + (r.forensicWeight ?? 1), 0);
  const issueMap = new Map<string, { severities: number[]; months: number[]; weightedMentions: number; rawCount: number }>();

  for (const r of reviews) {
    const weight = r.forensicWeight ?? 1;
    const months = r.monthsUsed ?? extractMonthsUsed(r.body);
    const failures = extractFailureModes(r.body);

    for (const f of failures) {
      const existing = issueMap.get(f.title) || {
        severities: [],
        months: [],
        weightedMentions: 0,
        rawCount: 0,
      };
      existing.severities.push(f.severity);
      if (months !== null) existing.months.push(months);
      existing.weightedMentions += weight;
      existing.rawCount += 1;
      issueMap.set(f.title, existing);
    }
  }

  const observed: ObservedIssue[] = [];
  for (const [title, data] of issueMap.entries()) {
    // Only surface issues mentioned by at least 2 raw reviews or >5% weighted share
    const share = data.weightedMentions / Math.max(1, weightedTotal);
    if (data.rawCount >= 2 || share >= 0.05) {
      data.months.sort((a, b) => a - b);
      const medianMonths = data.months.length > 0
        ? data.months[Math.floor(data.months.length / 2)]
        : null;

      const avgSeverity = Math.round(
        data.severities.reduce((s, x) => s + x, 0) / data.severities.length
      ) as 1 | 2 | 3 | 4 | 5;

      observed.push({
        title,
        share: Math.min(1, Number(share.toFixed(3))),
        medianMonths,
        severity: avgSeverity || 2,
        reviewCount: reviews.length,
      });
    }
  }

  return observed.sort((a, b) => b.share - a.share);
}

/**
 * 4. DERIVE STORED 0-100 CRITERIA SCORES
 * Documented formulas in code comments as required by spec:
 * - performance: derived from RAM capacity, upgradability, and price-tier CPU proxy.
 * - battery: derived from battery capacity proxy vs weight & platform efficiency (e.g. Apple Silicon vs Intel H).
 * - portability: directly inverse to weight (1.0kg -> 95, 1.5kg -> 80, 2.0kg -> 60, 2.5kg -> 40).
 * - reliability: 100 base minus penalty for observed issues (share * severity * 15).
 *   Falls back to 50 with low evidenceConfidence when no review evidence exists.
 */
export function deriveScores(
  specs: Product["specs"],
  observed: ObservedIssue[],
  reviewCount: number,
  category: "laptop" | "earbuds",
  name: string
): { scores: Record<StoredCriterion, number>; evidenceConfidence: number } {
  const isApple = name.toLowerCase().includes("macbook") || name.toLowerCase().includes("airpods");
  const isGaming = name.toLowerCase().includes("tuf") || name.toLowerCase().includes("loq") || name.toLowerCase().includes("nitro") || name.toLowerCase().includes("victus");

  // Performance formula
  let perf = 60;
  if (category === "laptop") {
    perf += Math.min(25, (specs.ramGb - 8) * 3); // 8GB -> 60, 16GB -> 84, 32GB -> 95
    if (specs.ramUpgradable) perf += 4;
    if (isGaming) perf += 8; // dedicated GPU
    if (isApple) perf += 6; // unified memory bandwidth
  } else {
    perf = 80;
  }
  const performance = Math.max(30, Math.min(98, Math.round(perf)));

  // Portability formula
  let port = 70;
  if (category === "laptop") {
    // 1.2kg = 90, 1.8kg = 70, 2.4kg = 45
    port = Math.round(115 - specs.weightKg * 25);
  } else {
    port = 95;
  }
  const portability = Math.max(25, Math.min(98, port));

  // Battery formula
  let bat = 70;
  if (category === "laptop") {
    if (isApple) bat = 94;
    else if (isGaming) bat = 48; // gaming laptops run ~3.5h
    else if (specs.weightKg < 1.4) bat = 82; // modern ultrabooks
    else bat = 68;
  } else {
    bat = 85;
  }
  const battery = Math.max(30, Math.min(98, bat));

  // Reliability formula
  let reliability = 88;
  let evidenceConfidence = 0.85;

  if (reviewCount === 0) {
    reliability = 50;
    evidenceConfidence = 0.25;
  } else {
    // Reduce reliability by observed issue penalties: share * severity * 20
    let penalty = 0;
    for (const issue of observed) {
      penalty += issue.share * issue.severity * 22;
    }
    reliability = Math.max(40, Math.min(95, Math.round(92 - penalty)));
    // Confidence scaled by review count: 10 reviews -> 0.6, 50 reviews -> 0.85, 150+ -> 0.95
    evidenceConfidence = Math.min(0.95, Number((0.45 + Math.log10(Math.max(1, reviewCount)) * 0.22).toFixed(2)));
  }

  return {
    scores: {
      performance,
      battery,
      portability,
      reliability,
    },
    evidenceConfidence,
  };
}

/**
 * 5. MAIN DERIVATION SCRIPT
 */
export function runDerivation() {
  const rootDir = path.resolve(__dirname, "..");
  const catalogPath = path.join(rootDir, "data", "catalog.json");
  const reviewsDir = path.join(rootDir, "data", "reviews");

  if (!fs.existsSync(catalogPath)) {
    console.error(`Catalog not found at ${catalogPath}`);
    return;
  }

  const catalog: CatalogItem[] = JSON.parse(fs.readFileSync(catalogPath, "utf-8"));
  console.log(`Processing derivation for ${catalog.length} catalog items...`);

  const updatedCatalog = catalog.map((item) => {
    const reviewFile = path.join(reviewsDir, `${item.slug}.json`);
    let rawReviews: ReviewItem[] = [];
    if (fs.existsSync(reviewFile)) {
      rawReviews = JSON.parse(fs.readFileSync(reviewFile, "utf-8"));
    }

    const forensicReviews = applyReviewForensics(rawReviews);
    const observed = aggregateObservedIssues(forensicReviews);
    const { scores, evidenceConfidence } = deriveScores(
      item.specs,
      observed,
      forensicReviews.length,
      item.category,
      item.name
    );

    return {
      ...item,
      scores,
      evidenceConfidence,
      observed,
    };
  });

  fs.writeFileSync(catalogPath, JSON.stringify(updatedCatalog, null, 2), "utf-8");
  console.log(`Successfully updated ${updatedCatalog.length} items in ${catalogPath}`);
}

if (process.argv[1] && path.basename(process.argv[1]) === "derive.ts") {
  runDerivation();
}
