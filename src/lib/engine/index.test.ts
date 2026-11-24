import { describe, it, expect } from "vitest";
import {
  CRITERIA,
  ASSUMPTIONS,
  demandGb,
  headroom,
  forecast,
  risks,
  tco,
  violations,
  evaluateOne,
  evaluate,
  decide,
  whatIf,
  inr,
  type Product,
  type Profile,
} from "./index";

const sampleProduct: Product = {
  slug: "lenovo-ideapad-slim-5",
  name: "Lenovo IdeaPad Slim 5 16GB",
  brand: "Lenovo",
  priceInr: 68990,
  priceAsOf: "2026-11-20",
  sourceUrl: "https://www.lenovo.com/in/en/p/laptops/ideapad/ideapad-500-series/ideapad-slim-5-gen-9-(16-inch-amd)/len101i0088",
  specs: {
    ramGb: 16,
    ramUpgradable: false,
    storageGb: 512,
    weightKg: 1.82,
    warrantyYears: 1,
  },
  scores: {
    performance: 82,
    battery: 75,
    portability: 70,
    reliability: 84,
  },
  evidenceConfidence: 0.88,
  provenance: {
    priceInr: "verified",
    ramGb: "verified",
    warrantyYears: "verified",
  },
  observed: [
    {
      title: "Hinge stiffness after month 12",
      share: 0.14,
      medianMonths: 14,
      severity: 2,
      reviewCount: 180,
    },
    {
      title: "Fan noise under dual compiler load",
      share: 0.22,
      medianMonths: 6,
      severity: 2,
      reviewCount: 180,
    },
  ],
};

const tightProduct: Product = {
  slug: "budget-8gb-laptop",
  name: "Budget 8GB Everyday Laptop",
  brand: "Generic",
  priceInr: 42000,
  priceAsOf: "2026-11-20",
  sourceUrl: "https://example.com/laptop",
  specs: {
    ramGb: 8,
    ramUpgradable: true,
    storageGb: 512,
    weightKg: 1.65,
    warrantyYears: 1,
  },
  scores: {
    performance: 60,
    battery: 65,
    portability: 80,
    reliability: 70,
  },
  evidenceConfidence: 0.75,
  provenance: {
    priceInr: "source_claim",
  },
  observed: [],
};

const expensiveProduct: Product = {
  slug: "premium-dev-laptop",
  name: "MacBook Pro M3 16GB",
  brand: "Apple",
  priceInr: 169900,
  priceAsOf: "2026-11-20",
  sourceUrl: "https://apple.com/in",
  specs: {
    ramGb: 16,
    ramUpgradable: false,
    storageGb: 512,
    weightKg: 1.55,
    warrantyYears: 1,
  },
  scores: {
    performance: 95,
    battery: 94,
    portability: 88,
    reliability: 92,
  },
  evidenceConfidence: 0.95,
  provenance: {
    priceInr: "verified",
  },
  observed: [],
};

const studentProfile: Profile = {
  budgetInr: 75000,
  years: 4,
  workloads: ["ide", "browser", "android_studio", "docker"],
  concurrency: "moderate",
  weights: {
    performance: 0.25,
    battery: 0.15,
    portability: 0.15,
    reliability: 0.2,
    longevity: 0.15,
    value: 0.1,
  },
  minRamGb: 16,
};

describe("VERDICT Deterministic Engine", () => {
  it("calculates demand and headroom correctly", () => {
    const d0 = demandGb(studentProfile, 0);
    const d4 = demandGb(studentProfile, 4);
    expect(d0).toBeGreaterThan(5);
    expect(d4).toBeGreaterThan(d0);

    const h0 = headroom(sampleProduct, studentProfile, 0);
    const h4 = headroom(sampleProduct, studentProfile, 4);
    expect(h0).toBeGreaterThan(h4);
  });

  it("forecasts headroom points across 4 years", () => {
    const fc = forecast(sampleProduct, studentProfile);
    expect(fc.length).toBeGreaterThanOrEqual(5);
    expect(fc[0].label).toBe("Day 1");
    expect(fc[fc.length - 1].years).toBe(4);
  });

  it("detects hard violations", () => {
    const vExpensive = violations(expensiveProduct, studentProfile);
    expect(vExpensive.some((v) => v.id === "budget")).toBe(true);

    const vTight = violations(tightProduct, studentProfile);
    expect(vTight.some((v) => v.id === "min-ram")).toBe(true);

    const vOk = violations(sampleProduct, studentProfile);
    expect(vOk.length).toBe(0);
  });

  it("evaluates and ranks products monotonically with budget constraints", () => {
    const evals = evaluate([expensiveProduct, tightProduct, sampleProduct], studentProfile);
    expect(evals[0].product.slug).toBe(sampleProduct.slug);
    expect(evals[0].eligible).toBe(true);
    expect(evals[1].eligible).toBe(false);
  });

  it("decides appropriate verdict branches", () => {
    const evals = evaluate([sampleProduct], studentProfile);
    const v = decide(evals, studentProfile);
    expect(["buy", "wait", "avoid", "alternative"]).toContain(v.kind);

    // If budget is too low for all
    const impossibleProfile: Profile = { ...studentProfile, budgetInr: 20000 };
    const impossibleEvals = evaluate([sampleProduct], impossibleProfile);
    const impVerdict = decide(impossibleEvals, impossibleProfile);
    expect(["wait", "avoid"]).toContain(impVerdict.kind);
  });

  it("whatIf accurately reflects parameter shifts", () => {
    const diff = whatIf([sampleProduct, expensiveProduct], studentProfile, { budgetInr: 180000 });
    expect(diff.after.evals.find((e) => e.product.slug === expensiveProduct.slug)?.eligible).toBe(true);
  });

  it("computes TCO lines including warranty reserve", () => {
    const res = tco(sampleProduct, studentProfile);
    expect(res.lines.length).toBeGreaterThanOrEqual(2);
    expect(res.totalInr).toBeGreaterThan(sampleProduct.priceInr);
  });
});
